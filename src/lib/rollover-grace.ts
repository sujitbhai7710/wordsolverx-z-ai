export const DAILY_ROLLOVER_GRACE_SECONDS = 30;
export const DAILY_ROLLOVER_GRACE_MS = DAILY_ROLLOVER_GRACE_SECONDS * 1000;

export function applyDailyRolloverGrace(now: Date = new Date()): Date {
	return new Date(now.getTime() - DAILY_ROLLOVER_GRACE_MS);
}
