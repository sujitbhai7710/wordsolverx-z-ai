export interface AnswerDateLike {
    date?: string | null;
}

export function pickLatestAnswerDate(answers: AnswerDateLike[]): string | null {
    let latest: string | null = null;
    for (const answer of answers) {
        if (!answer?.date) continue;
        if (!latest || answer.date > latest) {
            latest = answer.date;
        }
    }
    return latest;
}

export function formatAnswerDate(answers: AnswerDateLike[]): string | null {
    const dateStr = pickLatestAnswerDate(answers);
    if (!dateStr) return null;
    const date = new Date(`${dateStr}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
    });
}
