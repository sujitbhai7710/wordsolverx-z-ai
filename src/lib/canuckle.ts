import { format } from 'date-fns';

const CANUCKLE_SUPABASE_URL = 'https://xjhkrbqmubhnxkhpniqm.supabase.co';
const CANUCKLE_SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaGtyYnFtdWJobnhraHBuaXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjQ4ODEsImV4cCI6MjA3NTYwMDg4MX0.d9bs2dl4O3nEr3bgQEocNwvTXCs6L3uemnnv692BfZ4';

export interface CanuckleAnswer {
	dateKey: string;
	date: string;
	word: string;
	funFact: string;
	hintTitle: string | null;
	hintText: string | null;
	puzzleNumber: number | null;
	avgGuesses: number | null;
}

interface CanuckleSolutionRow {
	date: string;
	answer: string;
	fun_fact?: string | null;
	hint_title?: string | null;
	hint_text?: string | null;
}

function getCanuckleHeaders(extraHeaders: Record<string, string> = {}): HeadersInit {
	return {
		apikey: CANUCKLE_SUPABASE_ANON_KEY,
		Authorization: `Bearer ${CANUCKLE_SUPABASE_ANON_KEY}`,
		...extraHeaders
	};
}

function toCanuckleAnswer(row: CanuckleSolutionRow): CanuckleAnswer {
	const date = new Date(`${row.date}T12:00:00Z`);

	return {
		dateKey: row.date,
		date: format(date, 'MMMM d, yyyy'),
		word: row.answer.toUpperCase(),
		funFact: row.fun_fact?.trim() || 'A new Canuckle puzzle appears every day with a Canadian-themed answer.',
		hintTitle: row.hint_title?.trim() || null,
		hintText: row.hint_text?.trim() || null,
		puzzleNumber: null,
		avgGuesses: null
	};
}

async function fetchCanuckleSolutions(query: string): Promise<CanuckleSolutionRow[]> {
	const response = await fetch(`${CANUCKLE_SUPABASE_URL}/rest/v1/solutions?${query}`, {
		headers: getCanuckleHeaders()
	});

	if (!response.ok) {
		throw new Error(`Canuckle source request failed with ${response.status}`);
	}

	return (await response.json()) as CanuckleSolutionRow[];
}

export async function fetchCanuckleAnswerByDateKey(dateKey: string): Promise<CanuckleAnswer | null> {
	const rows = await fetchCanuckleSolutions(
		`select=date,answer,fun_fact,hint_title,hint_text&date=eq.${dateKey}&limit=1`
	);
	return rows[0] ? toCanuckleAnswer(rows[0]) : null;
}

export async function fetchLatestCanuckleAnswer(): Promise<CanuckleAnswer | null> {
	const rows = await fetchCanuckleSolutions(
		'select=date,answer,fun_fact,hint_title,hint_text&order=date.desc&limit=1'
	);
	return rows[0] ? toCanuckleAnswer(rows[0]) : null;
}

export async function fetchCanuckleArchive(limit = 30): Promise<CanuckleAnswer[]> {
	const rows = await fetchCanuckleSolutions(
		`select=date,answer,fun_fact,hint_title,hint_text&order=date.desc&limit=${limit}`
	);
	return rows.map(toCanuckleAnswer);
}
