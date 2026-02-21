
export const XOR_KEY = "MULTIDLE_SECURE_KEY";

export const encodeWord = (word: string): string => {
    let xor = "";
    for (let i = 0; i < word.length; i++) {
        xor += String.fromCharCode(word.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length));
    }
    return btoa(xor);
};

export const decodeWord = (encoded: string): string => {
    try {
        const decodedRaw = atob(encoded);
        let decoded = "";
        for (let i = 0; i < decodedRaw.length; i++) {
            decoded += String.fromCharCode(decodedRaw.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length));
        }
        return decoded;
    } catch (e) {
        console.error("Failed to decode word", e);
        return "";
    }
};
