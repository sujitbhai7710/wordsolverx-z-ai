$taskScript = "C:\Users\akasa\Desktop\MYPROJECTS\wordsolverx-cloudflare\wordsolverx-svelte\scripts\scheduled-main-publish.ps1"
$taskCommand = "powershell.exe -ExecutionPolicy Bypass -File `"$taskScript`""

$tasks = @(
	@{ Name = "WordSolverX Main Publish 2201"; Time = "22:01" },
	@{ Name = "WordSolverX Main Publish 2206"; Time = "22:06" },
	@{ Name = "WordSolverX Main Publish 2211"; Time = "22:11" }
)

foreach ($task in $tasks) {
	schtasks /Create /F /SC DAILY /TN $task.Name /TR $taskCommand /ST $task.Time | Out-Host
}
