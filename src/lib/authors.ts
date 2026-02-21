
export const AUTHORS = [
    "Ethan Walker",
    "Madison Clark",
    "Ryan Mitchell",
    "Olivia Harper",
    "Jacob Reynolds",
    "Emily Carter",
    "Daniel Brooks"
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
