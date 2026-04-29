
import { generatePersonAuthorSchema } from '$lib/seo';

export const AUTHORS = [
    "Ethan Walker",
    "Madison Clark",
    "Ryan Mitchell",
    "Olivia Harper",
    "Jacob Reynolds",
    "Emily Carter",
    "Daniel Brooks"
];

export const PRESTON_HAYES_AUTHOR_NAME = 'Preston Hayes';
export const PRESTON_HAYES_AUTHOR_URL = 'https://wordsolverx.com/about#preston-hayes';
export const PRESTON_HAYES_AUTHOR_IMAGE = '/author-wordsolverx.webp';
export const PRESTON_HAYES_AUTHOR_IMAGE_URL = 'https://wordsolverx.com/author-wordsolverx.webp';
export const PRESTON_HAYES_AUTHOR_DESCRIPTION =
    'Preston Hayes has been solving and analyzing daily word puzzles since Wordle launched in October 2021. He maintains a daily solving streak across Wordle, Quordle, and Nerdle, and has written over 500 daily puzzle guides. His approach focuses on statistical letter frequency and strategic elimination rather than guessing — the same logic that powers the solvers on this site.';
export const PRESTON_HAYES_AUTHOR_JOB_TITLE = 'Word Puzzle Analyst';
export const PRESTON_HAYES_AUTHOR_KNOWS_ABOUT = [
    'Wordle',
    'Word Puzzles',
    'Daily Puzzle Answers',
    'Puzzle Solver Tools',
    'Information Theory'
];
export const PRESTON_HAYES_AUTHOR_SAME_AS = [
    'https://www.facebook.com/wordsolverx/',
    'https://t.me/wordsolverx'
];

// Deterministically assign an author to a game based on its name character codes
export function getAuthorForGame(gameName: string): string {
    const sum = gameName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = sum % AUTHORS.length;
    return AUTHORS[index];
}

export function getAuthorProfileUrl(authorName: string): string {
    // In a real app, this would link to an author bio page
    // For now, we can link to the about page or just return a hash
    return `https://wordsolverx.com/about#${authorName.toLowerCase().replace(' ', '-')}`;
}

export function getPrestonHayesAuthorSchema() {
    return generatePersonAuthorSchema(
        PRESTON_HAYES_AUTHOR_NAME,
        PRESTON_HAYES_AUTHOR_URL,
        PRESTON_HAYES_AUTHOR_IMAGE_URL,
        PRESTON_HAYES_AUTHOR_JOB_TITLE,
        PRESTON_HAYES_AUTHOR_KNOWS_ABOUT,
        PRESTON_HAYES_AUTHOR_SAME_AS
    );
}
