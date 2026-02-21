import { getJSTToday, getWordleNumber, getWordleDate, formatDate } from './utils';

export interface ArchiveItem {
    id: number;
    date: string;
    formattedDate: string;
    url: string;
    name: string;
}

export function generateWordleArchiveItems(baseUrl: string = 'https://wordsolverx.com'): ArchiveItem[] {
    const jstToday = getJSTToday();
    const todayNum = getWordleNumber(jstToday);
    const items: ArchiveItem[] = [];

    // We count backwards from today to the start (Wordle #219)
    // Limiting to recent 50 for schema to avoid bloating the HTML too much, 
    // or we can generate all if the user wants a full list. 
    // Google recommends pagination for large lists, but for a single page schema, 
    // a reasonable subset or full list is okay. Let's do full list but be mindful of size.
    // Actually, for SEO "CollectionPage", showing the *visible* items is best, 
    // but since the client component paginates, maybe we just show the first page (recent 20) 
    // or the "most important" ones. 
    // Let's generate the first page (20 items) which corresponds to what the user sees initially.

    const count = 20;

    for (let i = todayNum; i > todayNum - count; i--) {
        if (i < 219) break;
        const date = getWordleDate(i);
        const dateStr = date.toISOString();
        const formatted = formatDate(date);
        // Format: /wordle-answer-for-month-day-year
        // We need to match the format used in ArchiveClient: MMMM-d-yyyy (lowercase)
        const slugDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/,/g, ''); // formatting might be tricky to match exactly, let's use a helper if possible or strict format

        // Manual formatting to match 'november-24-2023'
        const month = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
        const day = date.getDate();
        const year = date.getFullYear();
        const slug = `${month}-${day}-${year}`;

        items.push({
            id: i,
            date: dateStr,
            formattedDate: formatted,
            url: `${baseUrl}/wordle-answer-for-${slug}`,
            name: `Wordle Answer for ${formatted} (#${i})`
        });
    }

    return items;
}

export function generateQuordleArchiveItems(baseUrl: string = 'https://wordsolverx.com'): ArchiveItem[] {
    const jstToday = getJSTToday();
    const QUORDLE_START_DATE = new Date(2022, 0, 24); // January 24, 2022

    // Calculate ID: days since start
    const sd = new Date(jstToday.getFullYear(), jstToday.getMonth(), jstToday.getDate(), 12, 0, 0);
    const e_d = new Date(2022, 0, 24, 12, 0, 0);
    const todayNum = Math.floor((sd.getTime() - e_d.getTime()) / 86400000);

    const items: ArchiveItem[] = [];
    const count = 20;

    for (let i = todayNum; i > todayNum - count; i--) {
        if (i < 0) break;

        const date = new Date(QUORDLE_START_DATE);
        date.setDate(date.getDate() + i);

        const dateStr = date.toISOString();
        const formatted = formatDate(date);

        // Url Format: /quordle-answer-for-month-day-year
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const slug = `${months[date.getMonth()]}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`;

        items.push({
            id: i,
            date: dateStr,
            formattedDate: formatted,
            url: `${baseUrl}/quordle-answer-for-${slug}`,
            name: `Quordle Answer for ${formatted} (#${i})`
        });
    }

    return items;
}
