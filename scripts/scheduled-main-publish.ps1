$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$lockDir = Join-Path $projectRoot ".scheduler"
$lockPath = Join-Path $lockDir "main-publish-lock.json"
$logPath = Join-Path $lockDir "main-publish.log"
$statusUrl = "https://api.wordsolverx.workers.dev/api/publish-status/main"
$minLockMinutes = 20

if (-not (Test-Path $lockDir)) {
	New-Item -ItemType Directory -Path $lockDir -Force | Out-Null
}

function Write-Log {
	param([string]$Message)
	$line = "{0} {1}" -f (Get-Date -Format o), $Message
	Add-Content -Path $logPath -Value $line
	Write-Host $line
}

function Get-CurrentLock {
	if (-not (Test-Path $lockPath)) {
		return $null
	}

	try {
		return Get-Content $lockPath -Raw | ConvertFrom-Json
	} catch {
		return $null
	}
}

function Set-Lock {
	param(
		[string]$TargetDate,
		[string]$State,
		[string]$Reason
	)

	$payload = [ordered]@{
		targetDate = $TargetDate
		state = $State
		reason = $Reason
		recordedAt = (Get-Date).ToUniversalTime().ToString("o")
	}

	$payload | ConvertTo-Json | Set-Content -Path $lockPath
}

try {
	$status = Invoke-RestMethod -Uri $statusUrl
} catch {
	Write-Log "STATUS_FETCH_FAILED $($_.Exception.Message)"
	exit 1
}

if (-not $status.targetDate) {
	Write-Log "SKIP missing_target_date action=$($status.action) reason=$($status.reason)"
	exit 0
}

if ($status.canary.current -eq $true) {
	Write-Log "SKIP canary_current targetDate=$($status.targetDate) baseUrl=$($status.canary.baseUrl)"
	exit 0
}

if ($status.allReady -ne $true) {
	Write-Log "SKIP not_ready targetDate=$($status.targetDate) reason=$($status.reason)"
	exit 0
}

$existingLock = Get-CurrentLock
if ($existingLock -and $existingLock.targetDate -eq $status.targetDate -and $existingLock.recordedAt) {
	$recordedAt = [DateTimeOffset]::Parse($existingLock.recordedAt)
	$lockAgeMinutes = ((Get-Date).ToUniversalTime() - $recordedAt.UtcDateTime).TotalMinutes
	if ($existingLock.state -ne "failed" -and $lockAgeMinutes -lt $minLockMinutes) {
		Write-Log "SKIP recent_lock targetDate=$($status.targetDate) state=$($existingLock.state) ageMinutes=$([math]::Round($lockAgeMinutes,2))"
		exit 0
	}
}

Set-Lock -TargetDate $status.targetDate -State "started" -Reason "status_ready"
Write-Log "DEPLOY_START targetDate=$($status.targetDate)"

. $PROFILE
Set-Location $projectRoot
cf-on

$deployOutput = & cmd.exe /c "npm run deploy:pages 2>&1"
$deployOutput | Tee-Object -FilePath $logPath -Append | Out-Host
$deployExitCode = $LASTEXITCODE

if ($deployExitCode -ne 0) {
	Set-Lock -TargetDate $status.targetDate -State "failed" -Reason "deploy_command_failed"
	Write-Log "DEPLOY_FAILED targetDate=$($status.targetDate) exitCode=$deployExitCode"
	exit $deployExitCode
}

Set-Lock -TargetDate $status.targetDate -State "completed" -Reason "deploy_command_succeeded"
Write-Log "DEPLOY_SUCCESS targetDate=$($status.targetDate)"
