import AES from "crypto-js/aes.js";
import UTF8 from "crypto-js/enc-utf8.js";

const KEY_RESPONSE_BODY = "D5XCtTOObw";
const KEY_ANSWERS = "QhDZJfngdx";

// Domain configuration
const DOMAINS = {
    "loldle": "loldle.net",
    "pokedle": "pokedle.net",
    "smashdle": "smashdle.net",
    "dotadle": "dotadle.net", // dotadle.net
    "narutodle": "narutodle.net",
    "onepiecedle": "onepiecedle.net"
};

const GAMES = Object.keys(DOMAINS);
const REGIONS = ['america', 'europe'];

const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://wordsolverx.com",
    "http://wordsolverx.com"
];

function getCorsHeaders(request) {
    const origin = request.headers.get("Origin");
    const headers = {
        "Content-Type": "application/json"
    };

    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
        headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
    }

    return headers;
}

async function fetchAndStore(game, env) {
    const domain = DOMAINS[game];
    const results = [];
    const now = Date.now();

    try {
        const resp = await fetch(`https://cache.${domain}/cache.json?_${now}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.3"
            }
        });

        if (!resp.ok) {
            return { game, success: false, error: `Fetch failed: ${resp.status}` };
        }

        const encryptedBody = await resp.text();
        const decryptedBody = AES.decrypt(encryptedBody, KEY_RESPONSE_BODY).toString(UTF8);
        if (!decryptedBody) throw new Error("Decrypt body failed");

        const rawData = JSON.parse(decryptedBody);

        for (const key in rawData) {
            if (key.includes("answerName")) continue;

            let region = REGIONS.find(r => key.includes(r));
            if (!region) continue;

            // Format: "classic_america_answerEncrypted"
            let mode = key.replace(`_${region}`, "").replace("_answerEncrypted", "");

            try {
                const encryptedAnswer = rawData[key];
                const decryptedAnswerJson = AES.decrypt(encryptedAnswer, KEY_ANSWERS).toString(UTF8);

                if (!decryptedAnswerJson) {
                    results.push({ mode, region, success: false, error: "Decrypt answer failed" });
                    continue;
                }

                const answerData = JSON.parse(decryptedAnswerJson);
                let gameId = null;

                // Extract game_numero if available to be precise
                // Usually found in the answer object, top level or inside nested objects
                // Let's look for known fields based on user logs: game_numero
                // E.g. answerData.game_numero
                if (answerData.game_numero) {
                    gameId = answerData.game_numero;
                } else {
                    // Sometimes it's nested? User logs show flat structure mostly for "splash" etc.
                    // For "classic", it might be inside too.
                    // We will store it if found, else null.
                }

                // Date Calculation:
                // Game changes at 6AM UTC.
                // If current time < 6AM UTC, it's yesterday's game date? 
                // No, usually "today" in the game means the current active puzzle.
                // We want to store the date associated with this puzzle.
                // If we scrape at 6:02 AM UTC, it is "today" (new puzzle).
                // The date should be the UTC date of the scrape time, provided we scrape AFTER 6AM.
                // Since we scheduled cron for 6:02 AM, the UTC date then is the correct game date.

                const date = new Date().toISOString().split('T')[0]; // UTC date
                const jsonContent = JSON.stringify(answerData);

                // Store in D1
                await env.DB.prepare(
                    `INSERT INTO answers (game, date, mode, region, game_id, json_content, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?)
                     ON CONFLICT(game, date, mode, region) DO UPDATE SET 
                     json_content = ?, created_at = ?`
                ).bind(game, date, mode, region, gameId, jsonContent, now, jsonContent, now).run();

                results.push({ mode, region, success: true, gameId });

            } catch (e) {
                results.push({ mode, region, success: false, error: e.message });
            }
        }
        return { game, success: true, results };

    } catch (e) {
        return { game, success: false, error: e.message };
    }
}

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: getCorsHeaders(request)
            });
        }

        const url = new URL(request.url);
        const path = url.pathname;
        const corsHeaders = getCorsHeaders(request);

        // CRON TRIGGER or Manual Batch
        if (path.startsWith("/add/secret")) {
            const key = url.searchParams.get("key") || path.split("/").pop();

            const results = [];
            for (const game of GAMES) {
                const res = await fetchAndStore(game, env);
                results.push(res);
            }

            return new Response(JSON.stringify(results, null, 2), {
                headers: corsHeaders
            });
        }

        // /today?game=narutodle
        // /today?game=narutodle
        if (path === "/today") {
            const game = url.searchParams.get("game");
            const region = url.searchParams.get("region");
            const date = new Date().toISOString().split('T')[0];

            let query = `SELECT * FROM answers WHERE date = ?`;
            const params = [date];

            if (region) {
                query += ` AND region = ?`;
                params.push(region);
            }

            if (game) {
                query += ` AND game = ?`;
                params.push(game);
            }

            const results = await env.DB.prepare(query).bind(...params).all();
            return new Response(JSON.stringify(results.results), {
                headers: corsHeaders
            });
        }

        // /:game/date/:date
        const dateMatch = path.match(/^\/([^\/]+)\/date\/([^\/]+)$/);
        if (dateMatch) {
            const game = dateMatch[1];
            const date = dateMatch[2];
            const region = url.searchParams.get("region") || "america";

            const results = await env.DB.prepare(
                `SELECT * FROM answers WHERE game = ? AND date = ? AND region = ?`
            ).bind(game, date, region).all();

            return new Response(JSON.stringify(results.results), {
                headers: corsHeaders
            });
        }

        // /search/title/:query
        if (path.startsWith("/search/title/")) {
            const queryStr = path.split("/").pop();
            const decodedQuery = decodeURIComponent(queryStr);
            const game = url.searchParams.get("game");

            let sql = `SELECT * FROM answers WHERE json_content LIKE ?`
            let params = [`%${decodedQuery}%`];

            if (game) {
                sql += ` AND game = ?`;
                params.push(game);
            }

            sql += ` ORDER BY date DESC LIMIT 50`;

            const results = await env.DB.prepare(sql).bind(...params).all();
            return new Response(JSON.stringify(results.results), {
                headers: corsHeaders
            });
        }

        return new Response("Not Found", {
            status: 404,
            headers: corsHeaders
        });
    },

    async scheduled(event, env, ctx) {
        // Cron trigger logic
        // Scrapes all games
        // We can't return Response here, just wait for promises
        console.log("Cron started");
        const promises = GAMES.map(game => fetchAndStore(game, env));
        await Promise.all(promises);
        console.log("Cron finished");
    }
};
