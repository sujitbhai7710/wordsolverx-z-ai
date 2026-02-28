# Wordle Answers Worker

This Cloudflare Worker provides an API for Wordle answers, history, and generated SEO content. It also handles RSS feeds and sitemaps.

## Endpoints

### Daily Content

- **`GET /api/today`**
  - Returns the Wordle answer for today (JST).
  - Includes generated `content_guide` (Markdown), `social_image` (Base64 SVG), and `youtube_video_url`.
  - **Query Params**: `?simple=true` (removes guide and image for smaller payload).

- **`GET /api/yesterday`**
  - Returns the Wordle answer for yesterday (JST).
  - Includes content guide, image, and YouTube video URL.
  - **Query Params**: `?simple=true`.

- **`GET /api/date/{date}`**
  - Returns the answer for a specific date (YYYY-MM-DD).
  - Includes YouTube video URL.
  - **Query Params**: `?simple=true`.

- **`GET /api/answer/{id}`**
  - Returns the answer for a specific Wordle Puzzle ID.
  - **Query Params**: `?simple=true`.

- **`GET /api/latest/{count}`**
  - Returns the last `{count}` answers (metadata only, no solution for security/spoiler reasons usually, check implementation).
  - *Note: This implementation typically returns basic info.*

### Search & Random

- **`GET /api/search/{query}`**
  - Search for past answers by solution word.

- **`GET /api/random`**
  - Returns a random past answer.

### Content Generation (Admin)

- **`GET /admin/generate-today`**
  - Manually triggers content generation for today's answer using Puter.js (DeepSeek-R1).

### Easy Access Admin Endpoints (URL Auth)

These endpoints use the API key (`UPDATE_KEY_SECRET`) in the URL path. If `solution` is omitted, the worker will attempt to fetch it from the official source.

- **`GET /api/simple-add/{date}/{secret_key}`**
  - Adds/Updates answer (fetches if missing). No generation.

- **`GET /api/add/{date}/{secret_key}`**
  - Adds/Updates answer (fetches if missing) AND triggers generation.

- **`GET /api/today/{secret_key}`**
  - Adds/Updates answer for today (fetches if missing) AND triggers generation.

- **`GET /api/delete/{date}/{secret_key}`**
  - Deletes answer for the specified date.

- **`GET /api/add/video/{date}/{secret_key}`**
  - Fetches YouTube RSS feed and adds video URL for a specific date.
  - Only matches Wordle videos (ignores Quordle and other games).
  - Returns 404 if no matching video found in RSS feed.
  - Returns 404 if no answer record exists for the date.

- **`GET /api/add/video-today/{secret_key}`**
  - Fetches YouTube RSS feed and adds video URL for today (IST timezone).
  - Only matches Wordle videos (ignores Quordle and other games).
  - Returns 404 if no matching video found in RSS feed.
  - Returns 404 if no answer record exists for today.

### Admin Endpoints (Protected Header)

Requires header: `x-admin-key: <YOUR_UPDATE_KEY_SECRET>`

- **`POST /admin/answer`**
  - Add or update an answer.
  - Body: `{ "date": "YYYY-MM-DD", "solution": "word", "editor": "Name", "days_since_launch": 1234 }`
  - Query: `?generate=true` (optional) to trigger AI content generation immediately.

- **`DELETE /admin/answer`**
  - Delete an answer.
  - Query: `?date=YYYY-MM-DD` (required).
  - Query: `?content_only=true` (optional) to delete only the generated AI content/image, keeping the answer row.

- **`POST /admin/generate`**
  - Trigger content generation manually.
  - Query: `?date=YYYY-MM-DD` (optional, defaults to today).

- **`POST /admin/youtube`**
  - Manually update the YouTube video URL for a specific date.
  - Body: `{ "date": "YYYY-MM-DD", "youtube_video_url": "https://youtube.com/watch?v=..." }`

- **`GET /admin/fetch-youtube`**
  - Manually trigger the YouTube video fetch job.
  - Fetches the RSS feed and updates today's Wordle video URL.

### Feeds

- **`GET /sitemap.xml`**
  - Generates a dynamic sitemap including static pages and answer history.
- **`GET /feed.xml`** or **`GET /rss.xml`**
  - Returns an RSS feed for Google Publisher Center.

## Cron Jobs

- **Daily at 12:00 PM IST (UTC+5:30 -> 06:30 UTC)**:
  - Fetches today's Wordle answer from NYT.
  - Checks if today's answer has content.
  - If not, uses DeepSeek-R1-Distill-Llama-70B via Puter.js to generate an SEO guide.
  - Generates a branded SVG social image.
  - Saves both to the D1 database.

- **Daily at 12:30 AM IST (UTC+5:30 -> 19:00 UTC previous day)**:
  - Fetches the YouTube RSS feed for the Wordle Answers Daily channel.
  - Parses video entries to find today's Wordle video.
  - Matches video title to the current date (e.g., "Wordle February 12, 2026 Answer").
  - Only processes Wordle videos (ignores Quordle and other games).
  - Updates the `youtube_video_url` field in the database for the matching date.

## Database Schema

Table `answers`:
- `id` (INT)
- `date` (TEXT YYYY-MM-DD)
- `solution` (TEXT)
- `days_since_launch` (INT)
- `editor` (TEXT)
- `content_guide` (TEXT) - AI generated guide
- `social_image` (TEXT) - Base64 SVG or Cloudinary URL
- `youtube_video_url` (TEXT) - YouTube video URL for the daily Wordle solution

## Environment Variables

- `UPDATE_KEY_SECRET` - Secret key for admin operations
- `PUTER_AUTH_TOKEN` - Authentication token for Puter.js AI services
- `SAMBANOVA_API_KEY` or `SAMBANOVA_API_KEYS` - API keys for SambaNova (alternative AI provider)
- `YOUTUBE_RSS_URL` (optional) - Custom YouTube RSS feed URL (defaults to Wordle Answers Daily channel)

## Setup

1. **Deploy**: `npx wrangler deploy`
2. **Secrets**: Set `PUTER_AUTH_TOKEN` using `npx wrangler secret put PUTER_AUTH_TOKEN`.
3. **Database Migration**: Run `npx wrangler d1 migrations apply wordle_answers` to apply schema changes.
