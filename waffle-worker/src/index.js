
import { format, subDays } from 'date-fns';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname.split("/").filter(Boolean);

        // CORS headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // GET Endpoints
            if (request.method === "GET") {
                if (path[0] === "today") {
                    return getTodayPuzzle(env, corsHeaders);
                }
                if (path[0] === "yesterday") {
                    return getYesterdayPuzzle(env, corsHeaders);
                }
                if (path[0] === "date" && path[1]) {
                    return getPuzzleByDate(path[1], env, corsHeaders);
                }
                if (path[0] === "number" && path[1]) {
                    return getPuzzleByNumber(path[1], env, corsHeaders);
                }

                // Backward compatibility or alternate /puzzle?date=...
                if (path[0] === "puzzle") {
                    const date = url.searchParams.get("date");
                    const number = url.searchParams.get("number");
                    if (date) return getPuzzleByDate(date, env, corsHeaders);
                    if (number) return getPuzzleByNumber(number, env, corsHeaders);
                }
            }

            // ADD Endpoints: /add/today/:key or /add/date/:date/:key or /add/number/:num/:key
            if (path[0] === "add" && path[1]) {
                const type = path[1]; // today, date, or number
                const val = path[2];   // the date/number OR the key if type is today
                const key = type === "today" ? path[2] : path[3];

                if (!key || key !== env.SECRET_KEY) {
                    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
                }

                if (type === "today") {
                    return handleManualAdd("today", null, env, corsHeaders);
                }
                if (type === "date" && val) {
                    return handleManualAdd("date", val, env, corsHeaders);
                }
                if (type === "number" && val) {
                    return handleManualAdd("number", val, env, corsHeaders);
                }
            }

            return new Response("Not Found", { status: 404, headers: corsHeaders });
        } catch (err) {
            return new Response(err.message, { status: 500, headers: corsHeaders });
        }
    },

    async scheduled(event, env, ctx) {
        console.log("Cron job running...");
        await fetchAndStoreDaily(env);
    }
};

async function getTodayPuzzle(env, headers) {
    const result = await env.DB.prepare(
        "SELECT * FROM waffle_puzzles ORDER BY puzzle_number DESC LIMIT 1"
    ).first();

    if (!result) {
        return new Response(JSON.stringify({ error: "No puzzles found in database" }), {
            status: 404,
            headers: { ...headers, "Content-Type": "application/json" }
        });
    }
    return formatResult(result, headers);
}

async function getYesterdayPuzzle(env, headers) {
    const result = await env.DB.prepare(
        "SELECT * FROM waffle_puzzles ORDER BY puzzle_number DESC LIMIT 1 OFFSET 1"
    ).first();

    if (!result) {
        return new Response(JSON.stringify({ error: "No historical puzzles found in database" }), {
            status: 404,
            headers: { ...headers, "Content-Type": "application/json" }
        });
    }
    return formatResult(result, headers);
}

async function getPuzzleByDate(date, env, headers) {
    const result = await env.DB.prepare(
        "SELECT * FROM waffle_puzzles WHERE date = ?"
    ).bind(date).first();

    if (!result) {
        return new Response(JSON.stringify({ error: `Puzzle not found for date ${date}` }), {
            status: 404,
            headers: { ...headers, "Content-Type": "application/json" }
        });
    }
    return formatResult(result, headers);
}

async function getPuzzleByNumber(number, env, headers) {
    const result = await env.DB.prepare(
        "SELECT * FROM waffle_puzzles WHERE puzzle_number = ?"
    ).bind(number).first();

    if (!result) {
        return new Response(JSON.stringify({ error: `Puzzle #${number} not found` }), {
            status: 404,
            headers: { ...headers, "Content-Type": "application/json" }
        });
    }
    return formatResult(result, headers);
}

async function handleManualAdd(type, val, env, headers) {
    // For now, Waffle only exposes the "current" puzzle via daily1.txt
    // So adding by date/number just triggers the same fetch logic, 
    // but checks if the resulting data matches what the user expects.

    const data = await fetchWaffleData();
    if (!data) return new Response("Failed to fetch from source", { status: 500, headers });

    const puzzleNumber = data.number;
    const dateStr = data.solution.date ? data.solution.date.split('T')[0] : format(new Date(), 'yyyy-MM-dd');

    // Verify if it's the one requested (optional but safer)
    if (type === "date" && val !== dateStr) {
        return new Response(`Source currently providing puzzle for ${dateStr}, not ${val}`, { status: 400, headers });
    }
    if (type === "number" && parseInt(val) !== puzzleNumber) {
        return new Response(`Source currently providing puzzle #${puzzleNumber}, not #${val}`, { status: 400, headers });
    }

    const result = await storePuzzle(data, env);
    return new Response(JSON.stringify({ message: result, data: { number: puzzleNumber, date: dateStr } }), {
        headers: { ...headers, "Content-Type": "application/json" }
    });
}

function formatResult(result, headers) {
    const data = {
        number: result.puzzle_number,
        date: result.date,
        puzzle: result.puzzle,
        solution: result.solution,
        words: JSON.parse(result.words),
        definitions: JSON.parse(result.definitions)
    };
    return new Response(JSON.stringify(data), {
        headers: { ...headers, "Content-Type": "application/json" }
    });
}

async function fetchWaffleData() {
    try {
        const res = await fetch("https://wafflegame.net/daily1.txt", {
            headers: { "User-Agent": "WaffleBot/1.0" }
        });
        if (!res.ok) return null;
        const rawText = await res.text();
        return await decodeWaffleData(rawText);
    } catch (e) {
        return null;
    }
}

async function storePuzzle(data, env) {
    const puzzleNumber = data.number;
    const dateStr = data.solution.date ? data.solution.date.split('T')[0] : format(new Date(), 'yyyy-MM-dd');

    const existing = await env.DB.prepare(
        "SELECT id FROM waffle_puzzles WHERE puzzle_number = ?"
    ).bind(puzzleNumber).first();

    if (existing) {
        return "Puzzle already exists in database";
    }

    await env.DB.prepare(
        "INSERT INTO waffle_puzzles (puzzle_number, date, puzzle, solution, words, definitions) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(
        puzzleNumber,
        dateStr,
        data.puzzle,
        data.solution,
        JSON.stringify(data.words),
        JSON.stringify(data.definitions || [])
    ).run();

    return "Success";
}

async function fetchAndStoreDaily(env) {
    const data = await fetchWaffleData();
    if (data) await storePuzzle(data, env);
}

async function decodeWaffleData(base64) {
    try {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const jsonString = new TextDecoder("utf-16le").decode(bytes.buffer);
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
}
