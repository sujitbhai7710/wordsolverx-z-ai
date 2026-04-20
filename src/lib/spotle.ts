import { format } from 'date-fns';

export const COUNTRY_NAMES: Record<string, string> = {
	us: 'United States',
	gb: 'United Kingdom',
	ca: 'Canada',
	au: 'Australia',
	de: 'Germany',
	fr: 'France',
	br: 'Brazil',
	mx: 'Mexico',
	es: 'Spain',
	it: 'Italy',
	jp: 'Japan',
	kr: 'South Korea',
	in: 'India',
	nl: 'Netherlands',
	se: 'Sweden',
	no: 'Norway',
	pr: 'Puerto Rico',
	co: 'Colombia',
	ar: 'Argentina',
	cl: 'Chile',
	bb: 'Barbados',
	tt: 'Trinidad and Tobago',
	jm: 'Jamaica',
	ie: 'Ireland',
	pl: 'Poland',
	be: 'Belgium',
	at: 'Austria',
	dk: 'Denmark',
	nz: 'New Zealand',
	ph: 'Philippines',
	ng: 'Nigeria',
	za: 'South Africa',
	is: 'Iceland',
	ro: 'Romania',
	cu: 'Cuba',
	do: 'Dominican Republic',
	ve: 'Venezuela',
	pa: 'Panama',
	gt: 'Guatemala',
	ht: 'Haiti',
	vg: 'British Virgin Islands',
	ma: 'Morocco',
	tr: 'Turkey',
	gr: 'Greece',
	pt: 'Portugal',
	cz: 'Czech Republic',
	hu: 'Hungary',
	fi: 'Finland'
};

export const GENDER_NAMES: Record<string, string> = {
	m: 'Male',
	f: 'Female',
	nb: 'Non-binary',
	x: 'Mixed',
	X: 'Mixed'
};

export type SpotleFeedback = 'green' | 'yellow' | 'gray';
export type SpotleArrowDirection = 'up' | 'down' | 'none';

export interface SpotleArtist {
	index: number;
	artist: string;
	country: string;
	genre: string;
	gender: string;
	group_size: number;
	debut_album_year: number;
	track_name?: string;
	uri?: string;
	image_uri?: string;
	song_uri?: string;
	song_image_uri?: string;
	embedded_track?: string;
}

export interface SpotleAnswer {
	date: string;
	dayNumber: number;
	artist: string;
	track?: string;
	image?: string;
	soundcloudUrl?: string;
}

export interface SpotleData {
	artists: SpotleArtist[];
	answers: SpotleAnswer[];
	metadata: {
		startDate: string;
		totalArtists: number;
		totalAnswers: number;
		lastSyncedAt?: string;
		source?: string;
	};
}

export interface SpotleGuessFeedback {
	listener_rank: SpotleFeedback;
	listener_arrow: SpotleArrowDirection;
	debut_album_year: SpotleFeedback;
	debut_arrow: SpotleArrowDirection;
	genre: SpotleFeedback;
	country: SpotleFeedback;
	group_size: SpotleFeedback;
	group_arrow: SpotleArrowDirection;
	gender: SpotleFeedback;
}

export interface SpotleGuess {
	artist: SpotleArtist;
	feedback: SpotleGuessFeedback;
}

export interface SpotleAttributeConfig {
	key: keyof SpotleGuessFeedback;
	label: string;
	shortLabel: string;
	getDisplayValue: (artist: SpotleArtist) => string;
	hasArrow?: boolean;
	arrowKey?: keyof SpotleGuessFeedback;
}

export const SPOTLE_ATTRIBUTES: SpotleAttributeConfig[] = [
	{
		key: 'listener_rank',
		label: 'Rank',
		shortLabel: 'Rank',
		getDisplayValue: (artist) => `#${artist.index + 1}`,
		hasArrow: true,
		arrowKey: 'listener_arrow'
	},
	{
		key: 'debut_album_year',
		label: 'Debut Year',
		shortLabel: 'Debut',
		getDisplayValue: (artist) => String(artist.debut_album_year),
		hasArrow: true,
		arrowKey: 'debut_arrow'
	},
	{
		key: 'genre',
		label: 'Genre',
		shortLabel: 'Genre',
		getDisplayValue: (artist) => artist.genre
	},
	{
		key: 'country',
		label: 'Country',
		shortLabel: 'Country',
		getDisplayValue: (artist) => COUNTRY_NAMES[artist.country] ?? artist.country.toUpperCase()
	},
	{
		key: 'group_size',
		label: 'Group Size',
		shortLabel: 'Size',
		getDisplayValue: (artist) => (artist.group_size === 1 ? 'Solo' : String(artist.group_size)),
		hasArrow: true,
		arrowKey: 'group_arrow'
	},
	{
		key: 'gender',
		label: 'Gender',
		shortLabel: 'Gender',
		getDisplayValue: (artist) => GENDER_NAMES[artist.gender] ?? artist.gender
	}
];

export function formatSpotleDate(date: Date): string {
	return format(date, 'yyyy-MM-dd');
}

export function parseSpotleDate(dateString: string): Date {
	return new Date(`${dateString}T12:00:00Z`);
}

export function getDefaultSpotleFeedback(): SpotleGuessFeedback {
	return {
		listener_rank: 'gray',
		listener_arrow: 'none',
		debut_album_year: 'gray',
		debut_arrow: 'none',
		genre: 'gray',
		country: 'gray',
		group_size: 'gray',
		group_arrow: 'none',
		gender: 'gray'
	};
}

export function getNextSpotleFeedback(current: SpotleFeedback): SpotleFeedback {
	const cycle: SpotleFeedback[] = ['gray', 'green', 'yellow'];
	return cycle[(cycle.indexOf(current) + 1) % cycle.length] ?? 'gray';
}

export function getNextSpotleArrow(current: SpotleArrowDirection): SpotleArrowDirection {
	const cycle: SpotleArrowDirection[] = ['none', 'up', 'down'];
	return cycle[(cycle.indexOf(current) + 1) % cycle.length] ?? 'none';
}

export function matchesSpotleFeedback(artist: SpotleArtist, guess: SpotleGuess): boolean {
	const feedback = guess.feedback;
	const guessedArtist = guess.artist;

	if (feedback.listener_rank === 'green' && artist.index !== guessedArtist.index) {
		return false;
	}
	if (feedback.listener_rank === 'yellow') {
		const diff = Math.abs(artist.index - guessedArtist.index);
		if (diff > 50 || diff === 0) {
			return false;
		}
	}
	if (feedback.listener_rank === 'gray') {
		if (Math.abs(artist.index - guessedArtist.index) <= 50) {
			return false;
		}
	}
	if (feedback.listener_arrow === 'up' && artist.index >= guessedArtist.index) {
		return false;
	}
	if (feedback.listener_arrow === 'down' && artist.index <= guessedArtist.index) {
		return false;
	}

	if (feedback.debut_album_year === 'green' && artist.debut_album_year !== guessedArtist.debut_album_year) {
		return false;
	}
	if (feedback.debut_album_year === 'yellow') {
		const diff = Math.abs(artist.debut_album_year - guessedArtist.debut_album_year);
		if (diff === 0 || diff > 5) {
			return false;
		}
	}
	if (feedback.debut_album_year === 'gray') {
		if (Math.abs(artist.debut_album_year - guessedArtist.debut_album_year) <= 5) {
			return false;
		}
	}
	if (feedback.debut_arrow === 'up' && artist.debut_album_year <= guessedArtist.debut_album_year) {
		return false;
	}
	if (feedback.debut_arrow === 'down' && artist.debut_album_year >= guessedArtist.debut_album_year) {
		return false;
	}

	if (feedback.country === 'green' && artist.country !== guessedArtist.country) {
		return false;
	}
	if (feedback.country === 'gray' && artist.country === guessedArtist.country) {
		return false;
	}
	if (feedback.genre === 'green' && artist.genre !== guessedArtist.genre) {
		return false;
	}
	if (feedback.genre === 'gray' && artist.genre === guessedArtist.genre) {
		return false;
	}
	if (feedback.gender === 'green' && artist.gender !== guessedArtist.gender) {
		return false;
	}
	if (feedback.gender === 'gray' && artist.gender === guessedArtist.gender) {
		return false;
	}

	if (feedback.group_size === 'green' && artist.group_size !== guessedArtist.group_size) {
		return false;
	}
	if (feedback.group_size === 'yellow') {
		const diff = Math.abs(artist.group_size - guessedArtist.group_size);
		if (diff === 0 || diff > 2) {
			return false;
		}
	}
	if (feedback.group_size === 'gray') {
		if (Math.abs(artist.group_size - guessedArtist.group_size) <= 2) {
			return false;
		}
	}
	if (feedback.group_arrow === 'up' && artist.group_size <= guessedArtist.group_size) {
		return false;
	}
	if (feedback.group_arrow === 'down' && artist.group_size >= guessedArtist.group_size) {
		return false;
	}

	return true;
}

export function filterSpotleCandidates(artists: SpotleArtist[], guesses: SpotleGuess[]): SpotleArtist[] {
	return artists.filter((artist) => guesses.every((guess) => matchesSpotleFeedback(artist, guess)));
}
