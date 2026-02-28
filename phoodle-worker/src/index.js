/**
 * Phoodle Worker
 * Daily scraping and API for Phoodle answers.
 */

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export default {
    async fetch(request, env, ctx) {
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: CORS_HEADERS });
        }

        const url = new URL(request.url);
        const path = url.pathname.slice(1).split("/");

        // Internal Setup: /setup/:secretkey
        if (path[0] === "setup" && path[1] === env.SECRET_KEY) {
            return await setupDatabase(env);
        }

        // Admin Endpoints
        // /add/date/(date)/(secretkey)
        if (path[0] === "add" && path[1] === "date" && path[2] && path[3] === env.SECRET_KEY) {
            return await manualAdd(path[2], env);
        }

        // /crop-trigger/(secretkey)
        if (path[0] === "crop-trigger" && path[1] === env.SECRET_KEY) {
            return await triggerScrape(env);
        }

        // /delete/date/(date)/(secretkey)
        if (path[0] === "delete" && path[1] === "date" && path[2] && path[3] === env.SECRET_KEY) {
            return await deleteDate(path[2], env);
        }

        // Frontend Endpoints
        // /list/page/(page)
        if (path[0] === "list" && path[1] === "page" && path[2]) {
            return await listDates(path[2], env);
        }

        // /show/date/(date)
        if (path[0] === "show" && path[1] === "date" && path[2]) {
            return await getDateAnswer(path[2], env, true); // true = hide recipes
        }

        // /today
        if (path[0] === "today") {
            const today = new Date().toISOString().split('T')[0];
            return await getDateAnswer(today, env, true);
        }

        // /yesterday
        if (path[0] === "yesterday") {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            return await getDateAnswer(yesterday, env, true);
        }

        return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
    },

    async scheduled(event, env, ctx) {
        // Cron trigger runs at 05:00 AM UTC
        // Logic: at 05:00 AM UTC on Jan 9, update 10th Jan data.
        const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        await scrapeAndSave(nextDay, env);
    },
};

/**
 * Setup Phoodle table
 */
async function setupDatabase(env) {
    try {
        await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS phoodle_answers (
        id TEXT PRIMARY KEY,
        word TEXT NOT NULL,
        description TEXT,
        recipe_name TEXT,
        recipe_link TEXT,
        recipe_image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
        return new Response(JSON.stringify({ success: true, message: "Phoodle table ready" }), {
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
    }
}

/**
 * Scrape Phoodle data for a specific date and save to D1
 */
async function scrapeAndSave(date, env) {
    const apiUrl = `https://phoodlebackend.com/daily-word/rest/${date}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Failed to fetch from Phoodle: ${response.statusText}`);

        const data = await response.json();
        if (!data || !data.word) throw new Error("Invalid data received from Phoodle");

        await env.DB.prepare(`
      INSERT OR REPLACE INTO phoodle_answers (id, word, description, recipe_name, recipe_link, recipe_image)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
            data._id, // date
            data.word,
            data.description?.trim(),
            data.recipeName,
            data.recipeLink,
            data.recipeImage
        ).run();

        return { success: true, data };
    } catch (error) {
        console.error(`Scrape error for ${date}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Endpoint Handlers
 */

async function manualAdd(date, env) {
    const result = await scrapeAndSave(date, env);
    return new Response(JSON.stringify(result), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
}

async function triggerScrape(env) {
    // Manual trigger typically for "next day" as per cron logic
    const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const result = await scrapeAndSave(nextDay, env);
    return new Response(JSON.stringify({ message: "Triggered scrape for next day", result }), {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
}

async function deleteDate(date, env) {
    try {
        await env.DB.prepare("DELETE FROM phoodle_answers WHERE id = ?").bind(date).run();
        return new Response(JSON.stringify({ success: true, message: `Deleted ${date}` }), {
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
    }
}

async function listDates(page, env) {
    try {
        const pageSize = 20;
        const offset = (parseInt(page) - 1) * pageSize;
        if (isNaN(offset) || offset < 0) throw new Error("Invalid page number");

        const { results } = await env.DB.prepare(
            "SELECT id FROM phoodle_answers ORDER BY id DESC LIMIT ? OFFSET ?"
        ).bind(pageSize, offset).all();

        return new Response(JSON.stringify({ success: true, page: parseInt(page), data: results.map(r => r.id) }), {
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
    }
}

async function getDateAnswer(date, env, hideRecipes = false) {
    try {
        let query = "SELECT * FROM phoodle_answers WHERE id = ?";
        if (hideRecipes) {
            query = "SELECT id, word, description, recipe_name, created_at FROM phoodle_answers WHERE id = ?";
        }

        const answer = await env.DB.prepare(query).bind(date).first();
        if (!answer) {
            return new Response(JSON.stringify({ success: false, error: "No data for this date" }), {
                status: 404,
                headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
            });
        }
        return new Response(JSON.stringify({ success: true, data: answer }), {
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        });
    }
}
