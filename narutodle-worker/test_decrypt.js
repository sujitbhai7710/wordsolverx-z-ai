import AES from "crypto-js/aes.js";
import UTF8 from "crypto-js/enc-utf8.js";

const KEY_RESPONSE_BODY = "D5XCtTOObw";
const KEY_ANSWERS = "QhDZJfngdx";

(async () => {
    try {
        console.log("Fetching cache...");
        const resp = await fetch(`https://cache.narutodle.net/cache.json?_${Date.now()}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.3"
            }
        });

        if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);

        const text = await resp.text();
        console.log("Fetched length:", text.length);

        const decryptedOuter = AES.decrypt(text, KEY_RESPONSE_BODY).toString(UTF8);

        if (!decryptedOuter) {
            console.error("Outer decryption failed (empty result). Key might be wrong.");
            return;
        }

        const rawAnswers = JSON.parse(decryptedOuter);
        console.log("Keys found:", Object.keys(rawAnswers));

        const result = { america: {}, europe: {} };

        Object.entries(rawAnswers).forEach(([k, v]) => {
            if (k.includes("answerName")) return;

            // Expected format e.g. "classic_europe_answerEncrypted"
            let region = 'unknown';
            if (k.includes('america')) region = 'america';
            else if (k.includes('europe')) region = 'europe';

            if (region === 'unknown') return;

            // Remove region and suffix to get mode
            const mode = k.replace(`_${region}`, "").replace("_answerEncrypted", "");

            try {
                const decryptedAnswer = AES.decrypt(v, KEY_ANSWERS).toString(UTF8);
                result[region][mode] = JSON.parse(decryptedAnswer);
            } catch (e) {
                console.error("Failed to decrypt answer for", k);
            }
        });

        console.log(JSON.stringify(result, null, 2));

    } catch (e) {
        console.error(e);
    }
})();
