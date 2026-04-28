
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
export const PRESTON_HAYES_AUTHOR_IMAGE = '/auther-wordsolverx.webp';
export const PRESTON_HAYES_AUTHOR_IMAGE_URL = 'https://wordsolverx.com/auther-wordsolverx.webp';
export const PRESTON_HAYES_AUTHOR_DESCRIPTION =
    'Preston Hayes writes clear daily answer guides and archive pages for WordSolverX, helping readers find the right solution quickly.';

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
        PRESTON_HAYES_AUTHOR_IMAGE_URL
    );
}
