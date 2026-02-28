var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.js
var index_default = {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const corsHeaders = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }
        try {
            const isSimple = url.searchParams.get("simple") === "true";
            if (url.pathname === "/sitemap.xml") {
                const sitemap = generateMainSitemap();
                return new Response(sitemap, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            }
            if (url.pathname === "/sitemap-index.xml") {
                const sitemap = generateSitemapIndex();
                return new Response(sitemap, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            }
            if (url.pathname === "/sitemap-today.xml") {
                const sitemap = generateSitemapToday();
                return new Response(sitemap, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            }
            if (url.pathname === "/sitemap-yesterday.xml") {
                const sitemap = generateSitemapYesterday();
                return new Response(sitemap, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            }
            if (url.pathname === "/sitemap-solvers.xml") {
                const sitemap = generateSitemapSolvers();
                return new Response(sitemap, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            }
            if (url.pathname === "/sitemap-archive.xml") {
                const sitemap = generateSitemapArchive();
                return new Response(sitemap, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            }
            if (url.pathname === "/sitemap-games.xml") {
                const sitemap = generateSitemapGames();
                return new Response(sitemap, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            }
            if (url.pathname === "/newssitemap.xml") {
                const sitemap = generateSitemapNews();
                return new Response(sitemap, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            }
            if (url.pathname === "/feed.xml" || url.pathname === "/rss.xml") {
                const rss = await generateRssFeed(env);
                return new Response(rss, {
                    headers: {
                        "Content-Type": "application/xml",
                        "Cache-Control": "public, max-age=3600"
                    }
                });
            }
            if (url.pathname.startsWith("/admin/")) {
                const adminKey = request.headers.get("x-admin-key");
                if (!env.UPDATE_KEY_SECRET || adminKey !== env.UPDATE_KEY_SECRET) {
                    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
                }
                if (url.pathname === "/admin/generate" || url.pathname === "/admin/generate-today") {
                    const dateParam = url.searchParams.get("date");
                    await generateDailyContent(env, dateParam);
                    return new Response(JSON.stringify({ status: "Content generation triggered", date: dateParam || "today" }), { headers: corsHeaders });
                }
                if (url.pathname === "/admin/answer" && request.method === "POST") {
                    try {
                        const body = await request.json();
                        const { date, solution, editor, days_since_launch } = body;
                        if (!date || !solution) {
                            return new Response(JSON.stringify({ error: "Missing required fields: date, solution" }), { status: 400, headers: corsHeaders });
                        }
                        const existing = await env.DB.prepare("SELECT id FROM answers WHERE date = ?").bind(date).first();
                        if (existing) {
                            await env.DB.prepare(`
                                UPDATE answers SET solution = ?, editor = COALESCE(?, editor), days_since_launch = COALESCE(?, days_since_launch)
                                WHERE date = ?
                            `).bind(solution, editor || null, days_since_launch || null, date).run();
                        } else {
                            await env.DB.prepare(`
                                INSERT INTO answers (date, solution, editor, days_since_launch) 
                                VALUES (?, ?, ?, ?)
                            `).bind(date, solution, editor || null, days_since_launch || null).run();
                        }
                        if (url.searchParams.get("generate") === "true") {
                            ctx.waitUntil(generateDailyContent(env, date));
                        }
                        return new Response(JSON.stringify({ status: "Answer saved successfully", date, solution }), { headers: corsHeaders });
                    } catch (e) {
                        return new Response(JSON.stringify({ error: "Failed to save answer", details: e.message }), { status: 500, headers: corsHeaders });
                    }
                }
                if (url.pathname === "/admin/answer" && request.method === "DELETE") {
                    const date = url.searchParams.get("date");
                    const contentOnly = url.searchParams.get("content_only") === "true";
                    if (!date) {
                        return new Response(JSON.stringify({ error: "Missing date parameter" }), { status: 400, headers: corsHeaders });
                    }
                    if (contentOnly) {
                        await env.DB.prepare(
                            "UPDATE answers SET content_guide = NULL, social_image = NULL WHERE date = ?"
                        ).bind(date).run();
                        return new Response(JSON.stringify({ status: "Content cleared successfully", date }), { headers: corsHeaders });
                    } else {
                        await env.DB.prepare("DELETE FROM answers WHERE date = ?").bind(date).run();
                        return new Response(JSON.stringify({ status: "Answer deleted successfully", date }), { headers: corsHeaders });
                    }
                }
                // Admin endpoint to manually update YouTube video URL
                if (url.pathname === "/admin/youtube" && request.method === "POST") {
                    try {
                        const body = await request.json();
                        const { date, youtube_video_url } = body;
                        if (!date) {
                            return new Response(JSON.stringify({ error: "Missing required field: date" }), { status: 400, headers: corsHeaders });
                        }
                        const existing = await env.DB.prepare("SELECT id FROM answers WHERE date = ?").bind(date).first();
                        if (existing) {
                            await env.DB.prepare(
                                "UPDATE answers SET youtube_video_url = ? WHERE date = ?"
                            ).bind(youtube_video_url || null, date).run();
                            return new Response(JSON.stringify({ status: "YouTube URL updated successfully", date, youtube_video_url }), { headers: corsHeaders });
                        } else {
                            return new Response(JSON.stringify({ error: "No answer found for this date" }), { status: 404, headers: corsHeaders });
                        }
                    } catch (e) {
                        return new Response(JSON.stringify({ error: "Failed to update YouTube URL", details: e.message }), { status: 500, headers: corsHeaders });
                    }
                }
                // Admin endpoint to manually trigger YouTube video fetch
                if (url.pathname === "/admin/fetch-youtube") {
                    try {
                        await handleYouTubeVideoFetch(env);
                        return new Response(JSON.stringify({ status: "YouTube video fetch triggered" }), { headers: corsHeaders });
                    } catch (e) {
                        return new Response(JSON.stringify({ error: "Failed to fetch YouTube video", details: e.message }), { status: 500, headers: corsHeaders });
                    }
                }
            }
            const pathParts = url.pathname.split("/");
            const getSolution = /* @__PURE__ */ __name(async (d, s) => {
                const result = { solution: s, editor: null, days_since_launch: null };
                try {
                    const nytRes = await fetch(`https://www.nytimes.com/svc/wordle/v2/${d}.json`, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                        }
                    });
                    if (nytRes.ok) {
                        const data = await nytRes.json();
                        result.solution = data.solution;
                        result.editor = data.editor;
                        result.days_since_launch = data.days_since_launch;
                    } else {
                        console.error(`NYT fetch failed: ${nytRes.status} ${nytRes.statusText}`);
                        if (!s) return null;
                    }
                } catch (e) {
                    console.error("Failed to fetch external solution:", e);
                    if (!s) return null;
                }
                return result.solution ? result : null;
            }, "getSolution");
            const upsertAnswer = /* @__PURE__ */ __name(async (date, data) => {
                const { solution, editor, days_since_launch } = data;
                const existing = await env.DB.prepare("SELECT id FROM answers WHERE date = ?").bind(date).first();
                if (existing) {
                    await env.DB.prepare(`
                        UPDATE answers SET solution = ?, editor = COALESCE(?, editor), days_since_launch = COALESCE(?, days_since_launch)
                        WHERE date = ?
                    `).bind(solution, editor, days_since_launch, date).run();
                } else {
                    await env.DB.prepare(`
                        INSERT INTO answers (date, solution, editor, days_since_launch) 
                        VALUES (?, ?, ?, ?)
                    `).bind(date, solution, editor, days_since_launch).run();
                }
            }, "upsertAnswer");
            if (pathParts[2] === "simple-add" && pathParts.length === 5) {
                const date = pathParts[3];
                const key = pathParts[4];
                let manualSolution = url.searchParams.get("solution");
                if (!env.UPDATE_KEY_SECRET || key !== env.UPDATE_KEY_SECRET) return new Response("Unauthorized", { status: 401 });
                const data = await getSolution(date, manualSolution);
                if (!data) return new Response(`Missing solution. Failed to fetch from NYT source for ${date}.`, { status: 400 });
                await upsertAnswer(date, data);
                return new Response(JSON.stringify({ status: "Saved (Simple)", date, ...data }), { headers: corsHeaders });
            }
            if (pathParts[2] === "add" && pathParts.length === 5) {
                const date = pathParts[3];
                const key = pathParts[4];
                let manualSolution = url.searchParams.get("solution");
                if (!env.UPDATE_KEY_SECRET || key !== env.UPDATE_KEY_SECRET) return new Response("Unauthorized", { status: 401 });
                const data = await getSolution(date, manualSolution);
                if (!data) return new Response(`Missing solution. Failed to fetch from NYT source for ${date}.`, { status: 400 });
                await upsertAnswer(date, data);
                ctx.waitUntil(generateDailyContent(env, date));
                return new Response(JSON.stringify({ status: "Saved & Generating", date, ...data }), { headers: corsHeaders });
            }
            if (pathParts[2] === "today" && pathParts.length === 4) {
                const key = pathParts[3];
                let manualSolution = url.searchParams.get("solution");
                if (!env.UPDATE_KEY_SECRET || key !== env.UPDATE_KEY_SECRET) {
                    return new Response("Unauthorized", { status: 401 });
                }
                const now = /* @__PURE__ */ new Date();
                const jstOffset = 9 * 60;
                const jstTime = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 6e4);
                const today = jstTime.toISOString().split("T")[0];
                const data = await getSolution(today, manualSolution);
                if (!data) return new Response(`Missing solution. Failed to fetch from NYT source for ${today}.`, { status: 400 });
                await upsertAnswer(today, data);
                ctx.waitUntil(generateDailyContent(env, today));
                return new Response(JSON.stringify({ status: "Saved Today & Generating", date: today, ...data }), { headers: corsHeaders });
            }
            if (pathParts[2] === "delete" && pathParts.length === 5) {
                const date = pathParts[3];
                const key = pathParts[4];
                if (!env.UPDATE_KEY_SECRET || key !== env.UPDATE_KEY_SECRET) return new Response("Unauthorized", { status: 401 });
                await env.DB.prepare("DELETE FROM answers WHERE date = ?").bind(date).run();
                return new Response(`Deleted: ${date}`, { headers: corsHeaders });
            }
            // Add YouTube video URL for a specific date: /api/add/video/{date}/{key}
            if (pathParts[2] === "add" && pathParts[3] === "video" && pathParts.length === 6) {
                const date = pathParts[4];
                const key = pathParts[5];
                if (!env.UPDATE_KEY_SECRET || key !== env.UPDATE_KEY_SECRET) return new Response("Unauthorized", { status: 401 });

                try {
                    // Fetch and parse YouTube RSS feed
                    const rssXml = await fetchYouTubeRSSFeed(env);
                    const entries = parseYouTubeRSSFeed(rssXml);
                    const video = extractWordleVideoForDate(entries, date);

                    if (!video) {
                        return new Response(JSON.stringify({
                            error: "No Wordle video found for this date in RSS feed",
                            date,
                            searchedDate: date
                        }), { status: 404, headers: corsHeaders });
                    }

                    // Update database with video URL
                    const updated = await updateYouTubeVideoUrl(env, date, video.url);

                    if (!updated) {
                        return new Response(JSON.stringify({
                            error: "No answer record found for this date",
                            date
                        }), { status: 404, headers: corsHeaders });
                    }

                    return new Response(JSON.stringify({
                        status: "YouTube video URL added successfully",
                        date,
                        videoUrl: video.url,
                        videoTitle: video.title,
                        videoId: video.videoId
                    }), { headers: corsHeaders });
                } catch (e) {
                    return new Response(JSON.stringify({
                        error: "Failed to add YouTube video URL",
                        details: e.message
                    }), { status: 500, headers: corsHeaders });
                }
            }
            // Add YouTube video URL for today: /api/add/video-today/{key}
            if (pathParts[2] === "add" && pathParts[3] === "video-today" && pathParts.length === 5) {
                const key = pathParts[4];
                if (!env.UPDATE_KEY_SECRET || key !== env.UPDATE_KEY_SECRET) return new Response("Unauthorized", { status: 401 });

                try {
                    // Calculate today's date in IST
                    const now = new Date();
                    const istOffset = 5.5 * 60; // IST is UTC+5:30
                    const istTime = new Date(now.getTime() + (istOffset + now.getTimezoneOffset()) * 60000);
                    const today = istTime.toISOString().split("T")[0];

                    // Fetch and parse YouTube RSS feed
                    const rssXml = await fetchYouTubeRSSFeed(env);
                    const entries = parseYouTubeRSSFeed(rssXml);
                    const video = extractWordleVideoForDate(entries, today);

                    if (!video) {
                        return new Response(JSON.stringify({
                            error: "No Wordle video found for today in RSS feed",
                            date: today,
                            searchedDate: today
                        }), { status: 404, headers: corsHeaders });
                    }

                    // Update database with video URL
                    const updated = await updateYouTubeVideoUrl(env, today, video.url);

                    if (!updated) {
                        return new Response(JSON.stringify({
                            error: "No answer record found for today",
                            date: today
                        }), { status: 404, headers: corsHeaders });
                    }

                    return new Response(JSON.stringify({
                        status: "YouTube video URL added successfully for today",
                        date: today,
                        videoUrl: video.url,
                        videoTitle: video.title,
                        videoId: video.videoId
                    }), { headers: corsHeaders });
                } catch (e) {
                    return new Response(JSON.stringify({
                        error: "Failed to add YouTube video URL",
                        details: e.message
                    }), { status: 500, headers: corsHeaders });
                }
            }
            if (url.pathname === "/api/today") {
                const now = /* @__PURE__ */ new Date();
                const jstOffset = 9 * 60;
                const jstTime = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 6e4);
                const today = jstTime.toISOString().split("T")[0];
                const todayResult = await env.DB.prepare(
                    "SELECT * FROM answers WHERE date = ? LIMIT 1"
                ).bind(today).first();
                const last10Days = await env.DB.prepare(
                    "SELECT * FROM answers WHERE date <= ? ORDER BY date DESC LIMIT 10"
                ).bind(today).all();
                if (!todayResult) {
                    return new Response(JSON.stringify({
                        error: "No answer found for today",
                        today_jst: today,
                        recent_answers: last10Days.results || []
                    }), { status: 404, headers: corsHeaders });
                }
                // Auto-generation removed to save AI credits — content is only generated via cron or admin endpoints
                const responseData = {
                    ...todayResult,
                    today_jst: today,
                    recent_answers: last10Days.results || []
                };
                if (responseData.social_image) {
                    responseData.social_image = `${url.origin}/api/image/${responseData.date}`;
                }
                if (isSimple) {
                    delete responseData.content_guide;
                    delete responseData.social_image;
                }
                return new Response(JSON.stringify(responseData), { headers: corsHeaders });
            }
            if (url.pathname === "/api/yesterday") {
                const now = /* @__PURE__ */ new Date();
                const jstOffset = 9 * 60;
                const jstTime = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 6e4);
                jstTime.setDate(jstTime.getDate() - 1);
                const yesterdayStr = jstTime.toISOString().split("T")[0];
                const result = await env.DB.prepare(
                    "SELECT * FROM answers WHERE date = ? LIMIT 1"
                ).bind(yesterdayStr).first();
                if (!result) {
                    return new Response(JSON.stringify({ error: "No answer found for yesterday", date_jst: yesterdayStr }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }
                // Auto-generation removed to save AI credits
                const responseData = { ...result, date_jst: yesterdayStr };
                if (responseData.social_image) {
                    responseData.social_image = `${url.origin}/api/image/${responseData.date}`;
                }
                if (isSimple) {
                    delete responseData.content_guide;
                    delete responseData.social_image;
                }
                return new Response(JSON.stringify(responseData), { headers: corsHeaders });
            }
            const answerMatch = url.pathname.match(/^\/api\/answer\/(\d+)$/);
            if (answerMatch) {
                const id = parseInt(answerMatch[1]);
                const result = await env.DB.prepare("SELECT * FROM answers WHERE id = ? LIMIT 1").bind(id).first();
                if (!result) return new Response(JSON.stringify({ error: "Answer not found" }), { status: 404, headers: corsHeaders });
                // Auto-generation removed to save AI credits
                const responseData = result;
                if (responseData.social_image) {
                    responseData.social_image = `${url.origin}/api/image/${responseData.date}`;
                }
                if (isSimple) {
                    delete responseData.content_guide;
                    delete responseData.social_image;
                }
                return new Response(JSON.stringify(responseData), { headers: corsHeaders });
            }
            const dateMatch = url.pathname.match(/^\/api\/date\/(.+)$/);
            if (dateMatch) {
                const date = dateMatch[1];
                const result = await env.DB.prepare("SELECT * FROM answers WHERE date = ? LIMIT 1").bind(date).first();
                if (!result) return new Response(JSON.stringify({ error: "Answer not found for this date" }), { status: 404, headers: corsHeaders });
                // Auto-generation removed to save AI credits
                const responseData = result;
                if (responseData.social_image) {
                    responseData.social_image = `${url.origin}/api/image/${responseData.date}`;
                }
                if (isSimple) {
                    delete responseData.content_guide;
                    delete responseData.social_image;
                }
                return new Response(JSON.stringify(responseData), { headers: corsHeaders });
            }
            // Delete content_guide and social_image for a specific date: /api/delete-content/{date}/{key}
            if (pathParts[2] === "delete-content" && pathParts.length === 5) {
                const date = pathParts[3];
                const key = pathParts[4];
                if (!env.UPDATE_KEY_SECRET || key !== env.UPDATE_KEY_SECRET) return new Response("Unauthorized", { status: 401 });
                const existing = await env.DB.prepare("SELECT id FROM answers WHERE date = ?").bind(date).first();
                if (!existing) {
                    return new Response(JSON.stringify({ error: "No answer found for this date", date }), { status: 404, headers: corsHeaders });
                }
                await env.DB.prepare(
                    "UPDATE answers SET content_guide = NULL, social_image = NULL WHERE date = ?"
                ).bind(date).run();
                return new Response(JSON.stringify({ status: "Content deleted successfully", date }), { headers: corsHeaders });
            }
            const imageMatch = url.pathname.match(/^\/api\/image\/(.+)$/);
            if (imageMatch) {
                const date = imageMatch[1];
                const result = await env.DB.prepare("SELECT social_image FROM answers WHERE date = ? LIMIT 1").bind(date).first();
                if (!result || !result.social_image) {
                    return new Response("Image not found", { status: 404 });
                }

                // Check if it's a Cloudinary URL (new format)
                if (result.social_image.startsWith('https://res.cloudinary.com/')) {
                    // Redirect to Cloudinary URL
                    return Response.redirect(result.social_image, 301);
                }

                // Legacy Base64 SVG handling
                let contentType = "image/svg+xml";
                if (result.social_image.startsWith("data:image/svg+xml;base64,")) {
                    const base64Data = result.social_image.split(",")[1];
                    const svgString = atob(base64Data);
                    return new Response(svgString, {
                        headers: {
                            "Content-Type": contentType,
                            "Cache-Control": "public, max-age=604800, immutable",
                            "Access-Control-Allow-Origin": "*"
                        }
                    });
                } else if (result.social_image.startsWith("<svg")) {
                    return new Response(result.social_image, {
                        headers: {
                            "Content-Type": contentType,
                            "Cache-Control": "public, max-age=604800, immutable",
                            "Access-Control-Allow-Origin": "*"
                        }
                    });
                }
                return new Response("Invalid image format", { status: 500 });
            }
            const latestMatch = url.pathname.match(/^\/api\/latest\/(\d+)$/);
            if (latestMatch) {
                const count = parseInt(latestMatch[1]);
                const results = await env.DB.prepare(
                    "SELECT id, date, days_since_launch, editor FROM answers ORDER BY date DESC LIMIT ?"
                ).bind(count).all();
                return new Response(JSON.stringify({ results: results.results || [] }), { headers: corsHeaders });
            }
            const searchMatch = url.pathname.match(/^\/api\/search\/(.+)$/);
            if (searchMatch) {
                const query = decodeURIComponent(searchMatch[1]).toUpperCase();
                const now = /* @__PURE__ */ new Date();
                const jstOffset = 9 * 60;
                const jstTime = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 6e4);
                const today = jstTime.toISOString().split("T")[0];
                const results = await env.DB.prepare(
                    "SELECT id, date, solution, days_since_launch, editor FROM answers WHERE solution LIKE ? AND date <= ? ORDER BY date DESC LIMIT 50"
                ).bind(`%${query}%`, today).all();
                return new Response(JSON.stringify({ results: results.results || [] }), { headers: corsHeaders });
            }
            if (url.pathname === "/api/random") {
                const result = await env.DB.prepare("SELECT * FROM answers ORDER BY RANDOM() LIMIT 1").first();
                if (!result) return new Response(JSON.stringify({ error: "No answers available" }), { status: 404, headers: corsHeaders });
                return new Response(JSON.stringify(result), { headers: corsHeaders });
            }
            if (url.pathname === "/api/answer") {
                const result = await env.DB.prepare(
                    "SELECT id, date, days_since_launch, editor FROM answers ORDER BY date DESC LIMIT 1"
                ).first();
                if (!result) return new Response(JSON.stringify({ error: "No answer found" }), { status: 404, headers: corsHeaders });
                return new Response(JSON.stringify(result), { headers: corsHeaders });
            }
            return new Response(JSON.stringify({ error: "Endpoint not found" }), { status: 404, headers: corsHeaders });
        } catch (error) {
            console.error("Error processing request:", error);
            return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
                status: 500,
                headers: corsHeaders
            });
        }
    },
    async scheduled(event, env, ctx) {
        console.log("Running scheduled job at:", (new Date()).toISOString());

        // Determine which cron job triggered this
        const cron = event.cron;
        console.log(`Cron trigger: ${cron}`);

        if (cron === "30 18 * * *") {
            // 18:30 UTC (12:00 AM IST) - Fetch NYT answer and generate content
            await handleDailyAnswerFetch(env);
        } else if (cron === "50 18 * * *") {
            // 18:50 UTC (12:20 AM IST) - Fetch YouTube video
            await handleYouTubeVideoFetch(env);
        } else if (cron === "2 15 * * *") {
            // 15:02 UTC (12:02 AM JST) - Purge Cloudflare cache for wordle-answer-today
            await handleCloudflareCachePurge(env);
        } else {
            // Fallback: run both for manual triggers or unknown cron
            console.log("Unknown cron or manual trigger, running default NYT fetch...");
            await handleDailyAnswerFetch(env);
        }
    }
};
async function generateDailyContent(env, specificDate = null) {
    try {
        let targetDate = specificDate;
        if (!targetDate) {
            const now = /* @__PURE__ */ new Date();
            const jstOffset = 9 * 60;
            const jstTime = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 6e4);
            targetDate = jstTime.toISOString().split("T")[0];
        }
        console.log(`Generating content for date: ${targetDate}`);
        const result = await env.DB.prepare("SELECT * FROM answers WHERE date = ? LIMIT 1").bind(targetDate).first();
        if (!result) {
            console.error(`No answer found for ${targetDate}.`);
            return;
        }
        console.log(`Found answer: ${result.solution} for ${targetDate}`);
        const recentResults = await env.DB.prepare(
            "SELECT solution FROM answers WHERE date < ? ORDER BY date DESC LIMIT 3"
        ).bind(targetDate).all();
        const recentAnswers = recentResults.results.map((r) => r.solution).join(", ");
        console.log(`Calling generateSEOGuide for ${result.solution}...`);
        let contentGuide = await generateSEOGuide(env, result.solution, targetDate, recentAnswers);
        console.log(`Calling generateSocialImage for ${result.solution}...`);
        let socialImage = await generateSocialImage(result.solution, targetDate, env);
        if (contentGuide || socialImage) {
            await env.DB.prepare(
                "UPDATE answers SET content_guide = ?, social_image = ? WHERE date = ?"
            ).bind(contentGuide, socialImage, targetDate).run();
            console.log(`\u2705 Successfully saved content for: ${targetDate}`);
        } else {
            console.error(`\u274C Failed to generate content for ${targetDate} - both contentGuide and socialImage are null`);
        }
    } catch (error) {
        console.error(`\u274C Error in generateDaily Content:`, error.message, error.stack);
    }
}
__name(generateDailyContent, "generateDailyContent");
async function generateSEOGuide(env, solution, date, recentAnswers) {
    // Multi-key support: env.SAMBANOVA_API_KEYS should be comma-separated list
    // Fallback to single key env.SAMBANOVA_API_KEY if multiple keys not provided
    const apiKeysEnv = env.SAMBANOVA_API_KEYS || env.SAMBANOVA_API_KEY;
    if (!apiKeysEnv) {
        console.error("\u274C Missing SAMBANOVA_API_KEYS or SAMBANOVA_API_KEY");
        return null;
    }

    // Split by comma and clean up whitespace
    const apiKeys = apiKeysEnv.split(',').map(k => k.trim()).filter(k => k);

    if (apiKeys.length === 0) {
        console.error("\u274C No valid API keys found");
        return null;
    }

    console.log(`\u{1F4CB} Loaded ${apiKeys.length} Sambanova API key(s)`);

    const prompt = `You are a passionate Wordle enthusiast and word expert who plays the game every single day. You just solved today's Wordle and you're writing about it for your blog. Write a 1500+ word article about today's Wordle answer "${solution}" (Date: ${date}).

YOUR PERSONA:
- You are a real person who played today's Wordle puzzle
- You love words, language, and etymology
- You write like a blogger, not a corporation — short punchy paragraphs, 2-3 sentences max per paragraph
- Mix casual tone with genuine word expertise
- NO clich\xE9s (delve, unleash, comprehensive, testament, embark, landscape, realm, dive into, navigate)
- NO generic intros like "In this guide..." or "Welcome to..." or "Let's explore..."
- NO reasoning, meta-commentary, or descriptions of what you're about to write
- Output ONLY raw semantic HTML (no markdown, no code blocks, just HTML tags)

HTML STRUCTURE (STRICT ORDER — follow this EXACTLY):

<h2>5 Hints for Today's Wordle</h2>
<ul class="hints-list">
  <li><strong>Hint 1:</strong> [What part of speech is it? Give category/context clue]</li>
  <li><strong>Hint 2:</strong> [How many vowels? Any double letters? Unusual letter combos?]</li>
  <li><strong>Hint 3:</strong> [A synonym or conceptual clue — do NOT reveal the word]</li>
  <li><strong>Hint 4:</strong> [What does it rhyme with or sound like?]</li>
  <li><strong>Hint 5:</strong> [Give away the first letter as a final lifeline]</li>
</ul>

<h2>Today's Wordle Answer Revealed</h2>
<p class="answer-reveal">The Wordle answer for ${date} is <strong>${solution.toUpperCase()}</strong>.</p>

<h2>Word of the Day: "${solution.toUpperCase()}" — Complete Dictionary Breakdown</h2>
<p><strong>Pronunciation:</strong> [phonetic transcription, e.g. /wɜːrd/]</p>
<p><strong>Part of Speech:</strong> [noun/verb/adjective etc. — list all applicable]</p>
<p><strong>Definition(s):</strong></p>
<ol>
  <li>[Primary definition — write 2 sentences explaining the meaning clearly]</li>
  <li>[Secondary definition if applicable — write 2 sentences]</li>
  <li>[Any informal, slang, or less common meaning — write 1-2 sentences]</li>
</ol>
<p><strong>Synonyms:</strong> [list 5-8 synonyms with brief context for each, e.g. "flee (to escape danger)"]</p>
<p><strong>Antonyms:</strong> [list 3-5 antonyms with brief context, or explain why no direct antonyms exist]</p>
<p><strong>Example Sentences:</strong></p>
<ul>
  <li>[Natural everyday sentence using the word]</li>
  <li>[Sentence showing a different meaning or context]</li>
  <li>[A literary or formal usage example]</li>
  <li>[A sentence showing the word in a Wordle-related context, e.g. "I couldn't believe ____ was today's Wordle answer"]</li>
</ul>
<p><strong>Etymology:</strong> [Write 3-4 sentences tracing the word's origin — what language it came from, how the meaning evolved over centuries, any interesting historical usage]</p>
<p><strong>Grammar Notes:</strong> [Write 2-3 sentences covering plural form, verb tenses, related word forms (noun→adjective→adverb), any irregular forms or common mistakes]</p>
<p>[THIS ENTIRE SECTION MUST BE AT LEAST 200 WORDS. Be thorough like a real dictionary entry.]</p>

<h2>How I Solved Today's Wordle</h2>
<p>[Write a detailed first-person account of solving this specific puzzle. This section must be AT LEAST 200 WORDS. Describe each attempt in its own paragraph:]</p>
<p>[Attempt 1: Pick a common opener like CRANE, SLATE, ADIEU, or STARE. Describe exactly which letters turned green, yellow, or gray based on the actual answer "${solution}". Explain your reasoning for choosing this opener.]</p>
<p>[Attempt 2: Based on the clues from attempt 1, describe your second guess. Explain your thought process — what letters you kept, what you tried to eliminate, what positions you were testing.]</p>
<p>[Attempt 3: Describe how you narrowed it down further. Did you consider multiple possibilities? What made you pick this specific guess?]</p>
<p>[Attempt 4 (if needed): The final guess or the aha moment. Describe the satisfaction of cracking it.]</p>
<p>[Final reaction paragraph: Was it easy? Tricky? What threw you off? Rate your solve: "Got it in X/6 today." Share how you felt — relieved, proud, frustrated it took so long, etc.]</p>

<h2>Best Starting Words for Today's Wordle</h2>
<p>[AT LEAST 150 WORDS. Suggest 4 starting words that would have cracked "${solution}" faster. For each word:]</p>
<p>[Word 1: Name the word, explain exactly which letters of "${solution}" it shares, whether they'd be green (correct position) or yellow (wrong position). Explain why this opener is strong.]</p>
<p>[Word 2: Same detailed breakdown.]</p>
<p>[Word 3: Same detailed breakdown.]</p>
<p>[Word 4: Same detailed breakdown. DO NOT suggest "${solution}" itself.]</p>

<h2>Recent Wordle History & Patterns</h2>
<p>[AT LEAST 150 WORDS comparing "${solution}" to recent answers: ${recentAnswers}. Write 3-4 paragraphs covering:]</p>
<p>[Paragraph 1: List the recent answers and comment on the difficulty trend — is NYT getting harder or easier?]</p>
<p>[Paragraph 2: Any shared letters between recent answers? Any letter that keeps showing up?]</p>
<p>[Paragraph 3: How does "${solution}" compare in difficulty to the recent batch? Any patterns in word types (nouns vs verbs, common vs obscure)?]</p>

<h2>Expert Tips to Keep Your Streak Alive</h2>
<p>[AT LEAST 200 WORDS with practical, actionable advice across 4-5 paragraphs:]</p>
<p>[Tip 1: Best opening word strategy — explain why vowel-heavy starters work and name 2-3 specific openers.]</p>
<p>[Tip 2: The elimination approach — how to use gray letters effectively and narrow down possibilities.]</p>
<p>[Tip 3: When you're stuck on guess 4 or 5 — what to do, how to think differently.]</p>
<p>[Tip 4: Hard mode tips — how it changes your strategy.]</p>
<p>[Include this naturally: "If you're really stuck, you can always use our <a href="https://wordsolverx.com/wordle-solver">Wordle Solver tool</a> to narrow down possibilities — just enter your green, yellow, and gray letters and it instantly shows all matching words."]</p>

<h2>Play Unlimited Wordle</h2>
<p>[AT LEAST 100 WORDS across 2-3 paragraphs. Write naturally, like recommending something to a friend:]</p>
<p>[Paragraph 1: "Done with today's puzzle? I know the feeling of wanting more." Introduce <a href="https://wordsolverx.com/multidle">WordSolverX Multidle</a>.]</p>
<p>[Paragraph 2: Describe what's available — unlimited daily games, weekly challenges, custom puzzles from 4 to 12 letters. Great practice for building vocabulary and improving speed.]</p>

<h2>Frequently Asked Questions</h2>

<h3>Is "${solution.toUpperCase()}" a hard Wordle answer?</h3>
<p>[100-120 words. Rate the difficulty, explain why — letter rarity, common confusion words, tricky patterns. Compare to average Wordle difficulty.]</p>

<h3>What does "${solution.toLowerCase()}" mean?</h3>
<p>[80-100 words. Give a clear, accessible definition. Include an example of how the word is commonly used in everyday speech.]</p>

<h3>What are the best starting words for Wordle?</h3>
<p>[100-120 words. Recommend top 3 starters (CRANE, SLATE, STARE or similar) and explain the statistical reasoning — vowel coverage, consonant frequency.]</p>

<h3>Can I play Wordle more than once a day?</h3>
<p>[80-100 words. Yes — mention WordSolverX Multidle for unlimited games with different word lengths and difficulty modes.]</p>

<h3>Does Wordle ever repeat answers?</h3>
<p>[80-100 words. Explain NYT's curated answer list, the original ~2300 word pool, and their policy on repeats.]</p>

<h3>How many possible Wordle answers are there?</h3>
<p>[80-100 words. Original pool was ~2300 common 5-letter words, NYT has modified and curated the list. Explain why not all 5-letter English words are eligible.]</p>

<h3>What happens if I miss a day in Wordle?</h3>
<p>[80-100 words. Streak resets but the game continues. Mention checking our archive at WordSolverX for any answers they missed.]</p>

ABSOLUTE MINIMUM WORD COUNTS BY SECTION (these are non-negotiable):
- Dictionary Breakdown: 200+ words
- How I Solved It: 200+ words  
- Best Starting Words: 150+ words
- Recent History: 150+ words
- Expert Tips: 200+ words
- Play Unlimited: 100+ words
- Each FAQ answer: 80-120 words (7 answers = ~600 words)
- GRAND TOTAL: MUST exceed 1000 words. Aim for 1200-1500.

CRITICAL RULES:
- Keep paragraphs SHORT (2-3 sentences max) but write MORE paragraphs per section
- Write like a real human blogger, not AI
- The "How I Solved It" section must use realistic attempt sequences based on the actual answer "${solution}"
- All links must use proper <a> tags with full URLs
- Output raw HTML only, no markdown
- If your output is under 1000 words, YOU HAVE FAILED. Write more content per section.`;

    // Try each API key until one works
    for (let i = 0; i < apiKeys.length; i++) {
        const apiKey = apiKeys[i];
        console.log(`\u{1F4E1} Attempt ${i + 1}/${apiKeys.length}: Calling Sambanova API for ${solution}...`);

        try {
            const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "DeepSeek-R1-Distill-Llama-70B",
                    messages: [
                        { "role": "system", "content": "You are a passionate Wordle player and word nerd writing for your blog. Output raw semantic HTML only. No markdown. No code blocks. No explanations. No <think> tags. No meta-commentary. Just the HTML content, starting directly with the first <h2> tag." },
                        { "role": "user", "content": prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 5000
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`\u{26A0} API key ${i + 1} failed: ${response.status} ${response.statusText}`, errorText);
                continue; // Try next key
            }

            const data = await response.json();

            if (data.error) {
                console.warn(`\u{26A0} API key ${i + 1} returned error:`, JSON.stringify(data.error));
                continue;
            }

            console.log(`\u{1F4CA} Sambanova response received`);
            let content = data.choices && data.choices[0] ? data.choices[0].message.content : null;

            if (!content) {
                console.warn(`\u{26A0} API key ${i + 1} returned no content`);
                continue; // Try next key
            }

            // Clean up reasoning traces (DeepSeek-R1 specific)
            content = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

            // Clean up markdown artifacts if any
            content = content.replace(/```html/g, "").replace(/```/g, "").trim();

            const wordCount = content.split(/\s+/).length;
            console.log(`\u2705 Success with API key ${i + 1}: Generated ${wordCount} words for ${solution}`);

            return content;

        } catch (e) {
            console.warn(`\u{26A0} API key ${i + 1} error: ${e.message}`);
            continue; // Try next key
        }
    }

    // All keys failed
    console.error("\u274C All Sambanova API keys failed");
    return null;
}
__name(generateSEOGuide, "generateSEOGuide");

// Helper function to format date for social image (e.g., "Feb 20, 2026")
function formatDateForImage(dateString) {
    const date = new Date(dateString + 'T00:00:00Z'); // Parse as UTC
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
}
__name(formatDateForImage, "formatDateForImage");

// Helper function to format date for URL slug (e.g., "February-20-2026")
function formatDateForSlug(dateString) {
    const date = new Date(dateString + 'T00:00:00Z'); // Parse as UTC
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${month}-${day}-${year}`;
}
__name(formatDateForSlug, "formatDateForSlug");

async function generateSocialImage(solution, date, env) {
    const width = 1200;
    const height = 630;
    const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- Premium Background Gradient -->
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#1e293b;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
            </linearGradient>
            
            <!-- Vibrant Accent Gradient -->
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#34d399;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#6ee7b7;stop-opacity:1" />
            </linearGradient>
            
            <!-- Gold Accent for Premium Feel -->
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
            </linearGradient>
            
            <!-- Radial Gradient for Spotlight Effect -->
            <radialGradient id="spotlightGradient" cx="50%" cy="50%">
                <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.2" />
                <stop offset="100%" style="stop-color:#0f172a;stop-opacity:0" />
            </radialGradient>
            
            <!-- Text Glow Effects -->
            <filter id="textGlow">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            
            <filter id="strongGlow">
                <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            
            <!-- Drop Shadow for Depth -->
            <filter id="dropShadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="0" dy="4" result="offsetblur"/>
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5"/>
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#bgGradient)"/>
        
        <!-- Spotlight Effect in Center -->
        <ellipse cx="600" cy="315" rx="500" ry="250" fill="url(#spotlightGradient)"/>
        
        <!-- Decorative Geometric Shapes -->
        <!-- Large circles with opacity for visual interest -->
        <circle cx="100" cy="100" r="120" fill="#10b981" opacity="0.08"/>
        <circle cx="1100" cy="530" r="100" fill="#34d399" opacity="0.08"/>
        <circle cx="200" cy="500" r="80" fill="#6ee7b7" opacity="0.06"/>
        <circle cx="1000" cy="150" r="90" fill="#fbbf24" opacity="0.05"/>
        
        <!-- Decorative lines with gradient -->
        <rect x="0" y="0" width="8" height="630" fill="url(#accentGradient)" opacity="0.4"/>
        <rect x="1192" y="0" width="8" height="630" fill="url(#accentGradient)" opacity="0.4"/>
        
        <!-- Abstract geometric patterns -->
        <path d="M 50 30 L 150 30 L 100 100 Z" fill="#10b981" opacity="0.1"/>
        <path d="M 1050 500 L 1150 500 L 1150 600 L 1050 600 Z" fill="#34d399" opacity="0.08"/>
        
        <!-- Main Content Container -->
        <g transform="translate(600, 315)">
            <!-- Top decorative accent bar -->
            <rect x="-400" y="-180" width="800" height="6" fill="url(#accentGradient)" opacity="0.8" rx="3"/>
            
            <!-- Background card with subtle border -->
            <rect x="-450" y="-200" width="900" height="400" fill="#1e293b" opacity="0.4" rx="20" filter="url(#dropShadow)"/>
            <rect x="-450" y="-200" width="900" height="400" fill="none" stroke="url(#accentGradient)" stroke-width="2" opacity="0.3" rx="20"/>
            
            <!-- Icon/Badge Design - Wordle Tile Grid Representation -->
            <g transform="translate(0, -120)">
                <!-- Mini Wordle tiles as decoration -->
                <rect x="-75" y="-35" width="25" height="25" fill="#6aaa64" rx="3" opacity="0.9"/>
                <rect x="-45" y="-35" width="25" height="25" fill="#c9b458" rx="3" opacity="0.9"/>
                <rect x="-15" y="-35" width="25" height="25" fill="#6aaa64" rx="3" opacity="0.9"/>
                <rect x="15" y="-35" width="25" height="25" fill="#6aaa64" rx="3" opacity="0.9"/>
                <rect x="45" y="-35" width="25" height="25" fill="#10b981" rx="3" opacity="0.9"/>
            </g>
            
            <!-- Main Title with Premium Typography -->
            <text x="0" y="-40" text-anchor="middle" 
                  font-family="'SF Pro Display', 'Inter', 'Segoe UI', Arial, sans-serif" 
                  font-weight="900" 
                  font-size="72" 
                  fill="url(#accentGradient)" 
                  letter-spacing="3">
                WORDLE ANSWER
            </text>
            
            <!-- "FOR" text -->
            <text x="0" y="30" text-anchor="middle" 
                  font-family="'SF Pro Display', 'Inter', 'Segoe UI', Arial, sans-serif" 
                  font-weight="600" 
                  font-size="42" 
                  fill="#94a3b8" 
                  letter-spacing="2">
                FOR
            </text>
            
            <!-- Date with Gold Accent -->
            <text x="0" y="90" text-anchor="middle" 
                  font-family="'SF Pro Display', 'Inter', 'Segoe UI', Arial, sans-serif" 
                  font-weight="700" 
                  font-size="52" 
                  fill="#ffffff" 
                  letter-spacing="2">
                ${formatDateForImage(date)}
            </text>
            
            <!-- Bottom decorative accent bar -->
            <rect x="-400" y="100" width="800" height="6" fill="url(#accentGradient)" opacity="0.8" rx="3"/>
            
            <!-- Call to Action Badge -->
            <g transform="translate(0, 145)">
                <rect x="-150" y="-20" width="300" height="45" fill="url(#goldGradient)" rx="25" opacity="0.2"/>
                <rect x="-150" y="-20" width="300" height="45" fill="none" stroke="url(#goldGradient)" stroke-width="2" rx="25" opacity="0.6"/>
                <text x="0" y="8" text-anchor="middle" 
                      font-family="'SF Pro Display', 'Inter', 'Segoe UI', Arial, sans-serif" 
                      font-weight="700" 
                      font-size="22" 
                      fill="#fbbf24" 
                      letter-spacing="2">
                    GET HINTS &amp; STRATEGY
                </text>
            </g>
        </g>
        
        <!-- Branding Footer with Premium Style -->
        <g transform="translate(600, 570)">
            <!-- Brand background -->
            <rect x="-180" y="-18" width="360" height="40" fill="#0f172a" opacity="0.6" rx="20"/>
            
            <!-- Brand text -->
            <text x="0" y="8" text-anchor="middle" 
                  font-family="'SF Pro Display', 'Inter', 'Segoe UI', Arial, sans-serif" 
                  font-weight="800" 
                  font-size="32" 
                  fill="#94a3b8" 
                  letter-spacing="3">
                WordSolverX.com
            </text>
            
            <!-- Small decorative dots -->
            <circle cx="-200" cy="0" r="4" fill="#10b981" opacity="0.6"/>
            <circle cx="200" cy="0" r="4" fill="#10b981" opacity="0.6"/>
        </g>
        
        <!-- Corner Accents for Premium Look -->
        <path d="M 0 0 L 80 0 L 0 80 Z" fill="url(#accentGradient)" opacity="0.15"/>
        <path d="M 1200 0 L 1120 0 L 1200 80 Z" fill="url(#accentGradient)" opacity="0.15"/>
        <path d="M 0 630 L 80 630 L 0 550 Z" fill="url(#accentGradient)" opacity="0.15"/>
        <path d="M 1200 630 L 1120 630 L 1200 550 Z" fill="url(#accentGradient)" opacity="0.15"/>
    </svg>
    `;

    // Upload SVG to Cloudinary and get WebP URL
    try {
        const cloudName = env.CLOUDINARY_CLOUD_NAME;
        const apiKey = env.CLOUDINARY_API_KEY;
        const apiSecret = env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            console.error('❌ Missing Cloudinary credentials');
            // Fallback to Base64 if Cloudinary is not configured
            const base64 = btoa(svg);
            return `data:image/svg+xml;base64,${base64}`;
        }

        // Create unique public_id using SEO-friendly date format
        const dateSlug = formatDateForSlug(date);
        const publicId = `wordle-answers-for-${dateSlug}`;

        // Format date for metadata
        const formattedDate = formatDateForImage(date);

        // Prepare metadata for Cloudinary
        const contextMetadata = {
            caption: `Wordle Answer for ${formattedDate}`,
            alt: `Wordle Answer ${formattedDate} - Daily Puzzle Solution`
        };
        const contextString = `caption=${contextMetadata.caption}|alt=${contextMetadata.alt}`;
        const tags = `wordle,wordle-answer,${date},daily-puzzle`;

        // Generate timestamp for signature
        const timestamp = Math.floor(Date.now() / 1000);

        // Create signature for authenticated upload (must include all signed parameters)
        const stringToSign = `context=${contextString}&public_id=${publicId}&tags=${tags}&timestamp=${timestamp}${apiSecret}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(stringToSign);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Upload SVG to Cloudinary with metadata
        const formData = new FormData();
        formData.append('file', `data:image/svg+xml;base64,${btoa(svg)}`);
        formData.append('public_id', publicId);
        formData.append('context', contextString);
        formData.append('tags', tags);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey);
        formData.append('signature', signature);

        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('❌ Cloudinary upload failed:', uploadResponse.status, errorText);
            // Fallback to Base64
            const base64 = btoa(svg);
            return `data:image/svg+xml;base64,${base64}`;
        }

        const uploadResult = await uploadResponse.json();
        console.log('✅ SVG uploaded to Cloudinary:', uploadResult.public_id);

        // Return WebP transformation URL
        const webpUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_webp,q_auto/${publicId}`;
        console.log('✅ WebP URL:', webpUrl);

        return webpUrl;
    } catch (error) {
        console.error('❌ Error uploading to Cloudinary:', error.message);
        // Fallback to Base64
        const base64 = btoa(svg);
        return `data:image/svg+xml;base64,${base64}`;
    }
}
__name(generateSocialImage, "generateSocialImage");

// ==================== YouTube RSS Feed Functions ====================

/**
 * Fetches the YouTube RSS feed from the configured URL
 * Uses RSSHub as a workaround for YouTube's blocking of Cloudflare Workers
 */
async function fetchYouTubeRSSFeed(env) {
    const channelId = 'UC5fgkyGR7Ti6hArR5NjaCSA'; // Wordle Answers daily channel

    console.log(`📺 Fetching YouTube RSS for channel: ${channelId}`);

    // YouTube blocks requests from Cloudflare Workers IPs
    // Use RSSHub (open-source RSS aggregator) as a workaround
    // RSSHub provides YouTube channel RSS feeds without blocking
    const rsshubUrls = [
        `https://rsshub.app/youtube/channel/${channelId}`,
        `https://rsshub.rssforever.com/youtube/channel/${channelId}`,
        `https://rsshub.liumingye.cn/youtube/channel/${channelId}`
    ];

    let lastError = null;

    for (const rsshubUrl of rsshubUrls) {
        try {
            console.log(`📺 Trying RSSHub instance: ${rsshubUrl}`);

            const response = await fetch(rsshubUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; WordleAnswersBot/1.0)',
                    'Accept': 'application/xml, text/xml, application/rss+xml, */*'
                }
            });

            if (response.ok) {
                const text = await response.text();
                // Verify it's valid XML with entries
                if (text.includes('<item') || text.includes('<entry')) {
                    console.log(`✅ Successfully fetched RSS from RSSHub`);
                    return text;
                }
            }

            lastError = new Error(`RSSHub returned ${response.status}`);
        } catch (e) {
            console.log(`❌ RSSHub instance failed: ${e.message}`);
            lastError = e;
        }
    }

    // If all RSSHub instances fail, try the original YouTube RSS URL
    // (might work if Cloudflare's IP reputation improves)
    const originalRssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    try {
        console.log(`📺 Trying original YouTube RSS: ${originalRssUrl}`);
        const response = await fetch(originalRssUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (response.ok) {
            const text = await response.text();
            if (text.includes('<entry')) {
                console.log(`✅ Successfully fetched RSS from YouTube directly`);
                return text;
            }
        }
    } catch (e) {
        console.log(`❌ Direct YouTube RSS failed: ${e.message}`);
    }

    throw new Error(`Failed to fetch YouTube RSS from all sources. Last error: ${lastError?.message}`);
}
__name(fetchYouTubeRSSFeed, "fetchYouTubeRSSFeed");

/**
 * Parses the YouTube RSS XML and extracts video entries
 * Supports both Atom format (YouTube native) and RSS 2.0 format (RSSHub)
 */
function parseYouTubeRSSFeed(xmlString) {
    const entries = [];

    // Check if it's RSS 2.0 format (RSSHub uses <item>) or Atom format (YouTube uses <entry>)
    const isRssFormat = xmlString.includes('<item>') && !xmlString.includes('<entry>');

    if (isRssFormat) {
        // RSS 2.0 format (RSSHub)
        const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
        let match;

        while ((match = itemRegex.exec(xmlString)) !== null) {
            const itemXml = match[1];

            // Extract video ID from link or guid
            let videoId = null;
            const linkMatch = itemXml.match(/<link>([^<]+)<\/link>/);
            const link = linkMatch ? linkMatch[1] : null;

            if (link) {
                const videoIdMatch = link.match(/[?&]v=([^&]+)/);
                videoId = videoIdMatch ? videoIdMatch[1] : null;
            }

            // If no videoId from link, try guid
            if (!videoId) {
                const guidMatch = itemXml.match(/<guid[^>]*>([^<]+)<\/guid>/);
                if (guidMatch) {
                    const guidVideoIdMatch = guidMatch[1].match(/yt:video:([^<]+)/);
                    videoId = guidVideoIdMatch ? guidVideoIdMatch[1] : null;
                }
            }

            // Extract title
            const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
            const title = titleMatch ? titleMatch[1] : null;

            // Extract published date
            const pubDateMatch = itemXml.match(/<pubDate>([^<]+)<\/pubDate>/);
            const published = pubDateMatch ? pubDateMatch[1] : null;

            // Extract thumbnail from media:thumbnail or enclosure
            let thumbnail = null;
            const mediaThumbnailMatch = itemXml.match(/<media:thumbnail[^>]*url="([^"]+)"/);
            if (mediaThumbnailMatch) {
                thumbnail = mediaThumbnailMatch[1];
            } else {
                const enclosureMatch = itemXml.match(/<enclosure[^>]*url="([^"]+)"/);
                thumbnail = enclosureMatch ? enclosureMatch[1] : null;
            }

            if (videoId && title) {
                entries.push({
                    videoId,
                    title,
                    published,
                    link: link || `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnail
                });
            }
        }
    } else {
        // Atom format (YouTube native)
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
        let match;

        while ((match = entryRegex.exec(xmlString)) !== null) {
            const entryXml = match[1];

            // Extract video ID
            const videoIdMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            // Extract title
            const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/);
            const title = titleMatch ? titleMatch[1] : null;

            // Extract published date
            const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/);
            const published = publishedMatch ? publishedMatch[1] : null;

            // Extract link
            const linkMatch = entryXml.match(/<link rel="alternate" href="([^"]+)"/);
            const link = linkMatch ? linkMatch[1] : null;

            // Extract thumbnail
            const thumbnailMatch = entryXml.match(/<media:thumbnail url="([^"]+)"/);
            const thumbnail = thumbnailMatch ? thumbnailMatch[1] : null;

            if (videoId && title) {
                entries.push({
                    videoId,
                    title,
                    published,
                    link: link || `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnail
                });
            }
        }
    }

    return entries;
}
__name(parseYouTubeRSSFeed, "parseYouTubeRSSFeed");

/**
 * Finds the Wordle video for a specific date from the parsed entries
 * Only matches videos that start with "Wordle" (filters out Quordle, etc.)
 */
function extractWordleVideoForDate(entries, targetDate) {
    // Parse target date (format: YYYY-MM-DD)
    const [year, month, day] = targetDate.split('-');

    // Month names for matching
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[parseInt(month) - 1];

    // Create date patterns to match in title
    // Pattern 1: "February 12, 2026" (with comma)
    const datePattern1 = `${monthName} ${parseInt(day)}, ${year}`;
    // Pattern 2: "February 12 2026" (without comma)
    const datePattern2 = `${monthName} ${parseInt(day)} ${year}`;

    console.log(`🔍 Looking for video with date patterns: "${datePattern1}" or "${datePattern2}"`);

    for (const entry of entries) {
        const title = entry.title;

        // Skip non-Wordle videos (like Quordle, etc.)
        if (!title.toLowerCase().startsWith('wordle')) {
            continue;
        }

        // Check if title contains the target date
        if (title.includes(datePattern1) || title.includes(datePattern2)) {
            console.log(`✅ Found matching Wordle video: ${title}`);
            return {
                videoId: entry.videoId,
                title: entry.title,
                url: entry.link,
                thumbnail: entry.thumbnail,
                published: entry.published
            };
        }
    }

    return null; // No matching video found
}
__name(extractWordleVideoForDate, "extractWordleVideoForDate");

/**
 * Updates the database with the YouTube video URL for a specific date
 */
async function updateYouTubeVideoUrl(env, date, videoUrl) {
    // Check if answer exists for this date
    const existing = await env.DB.prepare(
        "SELECT id FROM answers WHERE date = ?"
    ).bind(date).first();

    if (existing) {
        // Update existing record
        await env.DB.prepare(
            "UPDATE answers SET youtube_video_url = ? WHERE date = ?"
        ).bind(videoUrl, date).run();
        console.log(`✅ Updated YouTube URL for ${date}: ${videoUrl}`);
        return true;
    } else {
        console.log(`⚠️ No answer found for ${date}, skipping YouTube URL update`);
        return false;
    }
}
__name(updateYouTubeVideoUrl, "updateYouTubeVideoUrl");

/**
 * Handles the daily NYT answer fetch (original scheduled job logic)
 */
async function handleDailyAnswerFetch(env) {
    console.log("📰 Starting daily NYT answer fetch job...");

    // Calculate today's date in JST
    const now = new Date();
    const jstOffset = 9 * 60;
    const jstTime = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 60000);
    const today = jstTime.toISOString().split("T")[0];

    console.log(`Fetching answer for ${today} from NYT...`);

    // Fetch solution from NYT
    try {
        const nytRes = await fetch(`https://www.nytimes.com/svc/wordle/v2/${today}.json`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        if (nytRes.ok) {
            const data = await nytRes.json();
            const { solution, editor, days_since_launch } = data;

            console.log(`NYT Solution found: ${solution}`);

            // Check if answer already exists
            const existing = await env.DB.prepare("SELECT id FROM answers WHERE date = ?").bind(today).first();

            if (existing) {
                // Update existing answer
                await env.DB.prepare(`
                    UPDATE answers SET solution = ?, editor = COALESCE(?, editor), days_since_launch = COALESCE(?, days_since_launch)
                    WHERE date = ?
                `).bind(solution, editor, days_since_launch, today).run();
                console.log(`✅ Updated answer for ${today}`);
            } else {
                // Insert new answer
                await env.DB.prepare(`
                    INSERT INTO answers (date, solution, editor, days_since_launch) 
                    VALUES (?, ?, ?, ?)
                `).bind(today, solution, editor, days_since_launch).run();
                console.log(`✅ Inserted new answer for ${today}`);
            }

            // Generate content (image + guide)
            await generateDailyContent(env, today);
        } else {
            console.error(`❌ NYT fetch failed: ${nytRes.status} ${nytRes.statusText}`);
        }
    } catch (error) {
        console.error(`❌ Error in daily answer fetch:`, error.message, error.stack);
    }
}
__name(handleDailyAnswerFetch, "handleDailyAnswerFetch");

/**
 * Purge Cloudflare edge cache for wordle-answer-today page
 * Runs at 15:02 UTC = 12:02 AM JST
 */
async function handleCloudflareCachePurge(env) {
    try {
        const zoneId = env.CF_ZONE_ID;
        const apiToken = env.CF_API_TOKEN;

        if (!zoneId || !apiToken) {
            console.error("❌ Missing CF_ZONE_ID or CF_API_TOKEN secrets");
            return;
        }

        const urlsToPurge = [
            "https://wordsolverx.com/wordle-answer-today",
            "https://www.wordsolverx.com/wordle-answer-today"
        ];

        console.log(`🧹 Purging Cloudflare cache for: ${urlsToPurge.join(", ")}`);

        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiToken}`
            },
            body: JSON.stringify({ files: urlsToPurge })
        });

        const result = await response.json();

        if (result.success) {
            console.log("✅ Cloudflare cache purge successful");
        } else {
            console.error("❌ Cloudflare cache purge failed:", JSON.stringify(result.errors));
        }
    } catch (error) {
        console.error("❌ Error purging Cloudflare cache:", error.message);
    }
}
__name(handleCloudflareCachePurge, "handleCloudflareCachePurge");

/**
 * Handles the YouTube video URL fetch (new scheduled job)
 * Runs at 19:00 UTC = 12:30 AM IST (next day)
 */
async function handleYouTubeVideoFetch(env) {
    console.log("🎬 Starting YouTube video fetch job...");

    // Calculate today's date in IST (since cron runs at 19:00 UTC = 00:30 IST next day)
    const now = new Date();
    const istOffset = 5.5 * 60; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + (istOffset + now.getTimezoneOffset()) * 60000);
    const today = istTime.toISOString().split("T")[0];

    console.log(`📅 Looking for Wordle video for date: ${today}`);

    try {
        // Fetch RSS feed
        const rssXml = await fetchYouTubeRSSFeed(env);
        console.log("✅ Fetched YouTube RSS feed");

        // Parse entries
        const entries = parseYouTubeRSSFeed(rssXml);
        console.log(`✅ Parsed ${entries.length} video entries`);

        // Find Wordle video for today
        const video = extractWordleVideoForDate(entries, today);

        if (video) {
            console.log(`🎬 Found matching video: ${video.title}`);
            console.log(`📺 Video URL: ${video.url}`);
            await updateYouTubeVideoUrl(env, today, video.url);
        } else {
            console.log(`⚠️ No Wordle video found for ${today}`);
        }
    } catch (error) {
        console.error("❌ Error in YouTube video fetch:", error.message, error.stack);
    }
}
__name(handleYouTubeVideoFetch, "handleYouTubeVideoFetch");

// ==================== End YouTube RSS Feed Functions ====================

async function generateRssFeed(env) {
    const baseUrl = "https://wordsolverx.com";
    const title = "WordSolverX";
    const description = "Daily Wordle Answers";
    const now = /* @__PURE__ */ new Date();
    const jstOffset = 9 * 60;
    const jstNow = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 6e4);
    const lastBuildDate = jstNow.toUTCString();
    let items = "";
    const games = [
        { name: "Wordle", slugKey: "wordle", pattern: "wordle-answer-for-{slug}", linkToday: "wordle-answer-today", padDay: false },
        { name: "Quordle", slugKey: "quordle", pattern: "quordle-answer-for-{slug}", linkToday: "quordle-answer-today", padDay: true },
        { name: "Phoodle", slugKey: "phoodle", pattern: "phoodle-answer-for-{slug}", linkToday: "phoodle-answer-today", padDay: true },
        { name: "Semantle", slugKey: "semantle", pattern: "semantle-answer-for-{slug}", linkToday: "semantle-answer-today", padDay: false },
        { name: "Colordle", slugKey: "colordle", pattern: "colordle-answer-for-{slug}", linkToday: "colordle-answer-today", padDay: true }
    ];
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const dates = [];
    for (let i = 0; i < 14; i++) {
        const d = new Date(jstNow);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        dates.push(d);
    }
    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();
        const day = date.getDate();
        const dateReadable = date.toISOString().split("T")[0];
        const pubDate = date.toUTCString();
        for (const game of games) {
            const dayStr = game.padDay ? day.toString().padStart(2, "0") : day.toString();
            const slug = `${monthName}-${dayStr}-${year}`;
            const answerUrl = `${baseUrl}/${game.pattern.replace("{slug}", slug)}`;
            items += `<item><title>${game.name} Answer for ${dateReadable}</title><link>${answerUrl}</link><guid isPermaLink="true">${answerUrl}</guid><pubDate>${pubDate}</pubDate><description>Answer for ${dateReadable}</description></item>`;
            if (i === 0) {
                const todayUrl = `${baseUrl}/${game.linkToday}`;
                items += `<item><title>${game.name} Answer Today</title><link>${todayUrl}</link><guid isPermaLink="false">${todayUrl}#${dateReadable}</guid><pubDate>${pubDate}</pubDate><description>Today's answer</description></item>`;
            }
        }
    }
    return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${title}</title><link>${baseUrl}</link><description>${description}</description><lastBuildDate>${lastBuildDate}</lastBuildDate>${items}</channel></rss>`;
}
__name(generateRssFeed, "generateRssFeed");

// ==================== Sitemap Functions ====================

function getJstDate() {
    const now = new Date();
    const jstOffset = 9 * 60;
    const jstNow = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 6e4);
    return jstNow;
}

function getFormattedDate(date) {
    return date.toISOString().split("T")[0];
}

const DATED_ANSWER_SITEMAP_DAYS = 5;
const MAIN_STATIC_PAGES = [
    "https://wordsolverx.com",
    "https://wordsolverx.com/about",
    "https://wordsolverx.com/archive",
    "https://wordsolverx.com/solver",
    "https://wordsolverx.com/today",
    "https://wordsolverx.com/guides",
    "https://wordsolverx.com/contact",
    "https://wordsolverx.com/privacy-policy",
    "https://wordsolverx.com/terms-of-service",
    "https://wordsolverx.com/multidle",
    "https://wordsolverx.com/create-custom-wordle",
    "https://wordsolverx.com/wordle-solver",
    "https://wordsolverx.com/all-wordle-solver",
    "https://wordsolverx.com/quordle-solver",
    "https://wordsolverx.com/phoodle-solver",
    "https://wordsolverx.com/waffle-solver",
    "https://wordsolverx.com/colordle-solver",
    "https://wordsolverx.com/lewdle-solver",
    "https://wordsolverx.com/weaver-solver",
    "https://wordsolverx.com/wordle-answer-today",
    "https://wordsolverx.com/quordle-answer-today",
    "https://wordsolverx.com/phoodle-answer-today",
    "https://wordsolverx.com/semantle-answer-today",
    "https://wordsolverx.com/colordle-answer-today",
    "https://wordsolverx.com/waffle-answer-today",
    "https://wordsolverx.com/globle-answer-today",
    "https://wordsolverx.com/dotadle-answer-today",
    "https://wordsolverx.com/loldle-answer-today",
    "https://wordsolverx.com/narutodle-answer-today",
    "https://wordsolverx.com/onepiecedle-answer-today",
    "https://wordsolverx.com/pokedle-answer-today",
    "https://wordsolverx.com/smashdle-answer-today",
    "https://wordsolverx.com/wordle-answer-archive",
    "https://wordsolverx.com/quordle-archive",
    "https://wordsolverx.com/phoodle-archive",
    "https://wordsolverx.com/semantle-archive",
    "https://wordsolverx.com/colordle-archive",
    "https://wordsolverx.com/waffle-archive",
    "https://wordsolverx.com/globle-archive",
    "https://wordsolverx.com/3-letter-wordle",
    "https://wordsolverx.com/4-letter-wordle",
    "https://wordsolverx.com/5-letter-wordle",
    "https://wordsolverx.com/6-letter-wordle",
    "https://wordsolverx.com/7-letter-wordle",
    "https://wordsolverx.com/8-letter-wordle",
    "https://wordsolverx.com/9-letter-wordle",
    "https://wordsolverx.com/10-letter-wordle",
    "https://wordsolverx.com/11-letter-wordle",
    "https://wordsolverx.com/12-letter-wordle"
];

const DATED_ANSWER_GAMES = [
    { name: "Wordle", slugKey: "wordle", pattern: "wordle-answer-for-{slug}", padDay: false },
    { name: "Quordle", slugKey: "quordle", pattern: "quordle-answer-for-{slug}", padDay: true },
    { name: "Phoodle", slugKey: "phoodle", pattern: "phoodle-answer-for-{slug}", padDay: true },
    { name: "Semantle", slugKey: "semantle", pattern: "semantle-answer-for-{slug}", padDay: false },
    { name: "Colordle", slugKey: "colordle", pattern: "colordle-answer-for-{slug}", padDay: true },
    { name: "Waffle", slugKey: "waffle", pattern: "waffle-answer-for-{slug}", padDay: true },
    { name: "Globle", slugKey: "globle", pattern: "globle-answer-for-{slug}", padDay: true }
];

function generateSitemapIndex() {
    const baseUrl = "https://wordsolverx.com";
    const today = getFormattedDate(getJstDate());

    const sitemaps = [
        "sitemap-today.xml",
        "sitemap-solvers.xml",
        "sitemap-archive.xml",
        "sitemap-games.xml",
        "newssitemap.xml"
    ];

    let xml = `<?xml version="10.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const sm of sitemaps) {
        xml += `<sitemap><loc>${baseUrl}/${sm}</loc><lastmod>${today}</lastmod></sitemap>`;
    }

    xml += `</sitemapindex>`;
    return xml;
}
__name(generateSitemapIndex, "generateSitemapIndex");

function generateMainSitemap() {
    const todayDate = getFormattedDate(getJstDate());
    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const p of MAIN_STATIC_PAGES) {
        const isRoot = p === "https://wordsolverx.com";
        const isTodayPage = p.endsWith("-answer-today") || p.endsWith("/today");
        const priority = isRoot ? "1.0" : (isTodayPage ? "0.95" : "0.85");
        const changefreq = isTodayPage ? "daily" : "weekly";
        xml += `<url><loc>${p}</loc><lastmod>${todayDate}</lastmod><priority>${priority}</priority><changefreq>${changefreq}</changefreq></url>`;
    }

    xml += `</urlset>`;
    return xml;
}
__name(generateMainSitemap, "generateMainSitemap");

function generateSitemapToday() {
    const todayDate = getFormattedDate(getJstDate());
    // pages updated daily
    const pages = [
        "https://wordsolverx.com",
        "https://wordsolverx.com/today",
        "https://wordsolverx.com/wordle-answer-today",
        "https://wordsolverx.com/quordle-answer-today",
        "https://wordsolverx.com/phoodle-answer-today",
        "https://wordsolverx.com/semantle-answer-today",
        "https://wordsolverx.com/colordle-answer-today",
        "https://wordsolverx.com/dotadle-answer-today",
        "https://wordsolverx.com/loldle-answer-today",
        "https://wordsolverx.com/narutodle-answer-today",
        "https://wordsolverx.com/onepiecedle-answer-today",
        "https://wordsolverx.com/pokedle-answer-today",
        "https://wordsolverx.com/smashdle-answer-today",
        "https://wordsolverx.com/waffle-answer-today",
        "https://wordsolverx.com/globle-answer-today"
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const p of pages) {
        // High priority for today pages
        xml += `<url><loc>${p}</loc><lastmod>${todayDate}</lastmod><priority>1.0</priority><changefreq>daily</changefreq></url>`;
    }

    xml += `</urlset>`;
    return xml;
}
__name(generateSitemapToday, "generateSitemapToday");

function generateSitemapYesterday() {
    // Yesterday pages are intentionally excluded from indexing strategy.
    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    xml += `</urlset>`;
    return xml;
}
__name(generateSitemapYesterday, "generateSitemapYesterday");

function generateSitemapSolvers() {
    // Solvers are important tools, effectively static but high value
    const todayDate = getFormattedDate(getJstDate());
    const pages = [
        "https://wordsolverx.com/solver",
        "https://wordsolverx.com/colordle-solver",
        "https://wordsolverx.com/all-wordle-solver",
        "https://wordsolverx.com/lewdle-solver",
        "https://wordsolverx.com/phoodle-solver",
        "https://wordsolverx.com/quordle-solver",
        "https://wordsolverx.com/weaver-solver",
        "https://wordsolverx.com/wordle-solver",
        "https://wordsolverx.com/waffle-solver"
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const p of pages) {
        xml += `<url><loc>${p}</loc><lastmod>${todayDate}</lastmod><priority>0.9</priority><changefreq>weekly</changefreq></url>`;
    }

    xml += `</urlset>`;
    return xml;
}
__name(generateSitemapSolvers, "generateSitemapSolvers");

function generateSitemapArchive() {
    const todayDate = getFormattedDate(getJstDate());
    const pages = [
        "https://wordsolverx.com/about",
        "https://wordsolverx.com/archive",
        "https://wordsolverx.com/colordle-archive",
        "https://wordsolverx.com/contact",
        "https://wordsolverx.com/guides",
        "https://wordsolverx.com/multidle",
        "https://wordsolverx.com/phoodle-archive",
        "https://wordsolverx.com/privacy-policy",
        "https://wordsolverx.com/quordle-archive",
        "https://wordsolverx.com/semantle-archive",
        "https://wordsolverx.com/wordle-answer-archive",
        "https://wordsolverx.com/waffle-archive",
        "https://wordsolverx.com/globle-archive"
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const p of pages) {
        xml += `<url><loc>${p}</loc><lastmod>${todayDate}</lastmod><priority>0.7</priority><changefreq>weekly</changefreq></url>`;
    }

    xml += `</urlset>`;
    return xml;
}
__name(generateSitemapArchive, "generateSitemapArchive");

function generateSitemapGames() {
    const baseUrl = "https://wordsolverx.com";
    const jstNow = getJstDate();

    const games = DATED_ANSWER_GAMES;

    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    // Generate dates for the last 5 days to match noindex strategy for older dated pages.
    const dates = [];
    for (let i = 0; i < DATED_ANSWER_SITEMAP_DAYS; i++) {
        const d = new Date(jstNow);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        dates.push(d);
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const date of dates) {
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();
        const day = date.getDate();
        const dateStr = getFormattedDate(date);

        for (const game of games) {
            const dayStr = game.padDay ? day.toString().padStart(2, "0") : day.toString();
            const slug = `${monthName}-${dayStr}-${year}`;
            const answerUrl = `${baseUrl}/${game.pattern.replace("{slug}", slug)}`;

            xml += `<url><loc>${answerUrl}</loc><lastmod>${dateStr}</lastmod><priority>0.6</priority><changefreq>monthly</changefreq></url>`;
        }
    }

    xml += `</urlset>`;
    return xml;
}
__name(generateSitemapGames, "generateSitemapGames");

function generateSitemapNews() {
    const baseUrl = "https://wordsolverx.com";
    const now = new Date();
    const jstOffset = 9 * 60; // JST is UTC+9
    const jstNow = new Date(now.getTime() + (jstOffset + now.getTimezoneOffset()) * 60000);

    const games = DATED_ANSWER_GAMES;

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthsSlug = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    let urls = [];

    // Loop for last 2 days (Today and Yesterday)
    for (let i = 0; i < 2; i++) {
        const date = new Date(jstNow);
        date.setDate(date.getDate() - i);

        // Format date for title: "February 16, 2026"
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        const monthSlug = monthsSlug[monthIndex];
        const day = date.getDate();
        const year = date.getFullYear();

        const formattedDate = `${monthName} ${day}, ${year}`;

        // Format date for news:publication_date (ISO 8601 format: YYYY-MM-DDThh:mm:ssTZD)
        const dateStr = date.toISOString().split("T")[0];
        const pubDate = new Date(dateStr + "T00:00:00+09:00").toISOString();

        games.forEach(game => {
            // Generate slug: e.g., "february-16-2026" or "february-06-2026"
            const dayStr = game.padDay ? day.toString().padStart(2, "0") : day.toString();
            const slug = `${monthSlug}-${dayStr}-${year}`;

            // Generate URL using game specific pattern
            const urlPath = game.pattern.replace("{slug}", slug);
            const url = `${baseUrl}/${urlPath}`;

            const title = `${game.name} Answer for ${formattedDate}`;

            urls.push(`
  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>WordSolverX</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`);
        });
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join("")}
</urlset>`;
}
__name(generateSitemapNews, "generateSitemapNews");

export {
    index_default as default
};
//# sourceMappingURL=index.js.map
