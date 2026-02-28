# Narutodle Solver Worker

This Cloudflare Worker automates the process of scraping the daily answer from `narutodle.net` and storing it in a D1 database. It supports **Classic**, **Jutsu**, **Quote**, and **Eye** modes.

## Features

- **Automated Scraping**: Uses Cloudflare Browser Rendering to visit `narutodle.net` pages.
- **Multi-Mode Support**: Scrapes answers for all 4 game modes.
- **D1 Storage**: Stores answers history with mode separation.
- **Secure Endpoint**: Protected scraping trigger.
- **Public API**: Get today's answer for any mode or all modes.

...

## Deployment

```bash
npx wrangler deploy
```

## API Endpoints

### 1. Trigger Scraper

**Endpoint:** `GET /add/today/:mode/:key`

**Parameters:**
- `:mode`: One of `classic`, `jutsu`, `quote`, `eye`.
- `:key`: Your `SECRET_KEY`.

**Example:**
```
https://narutodle-worker.[subdomain].workers.dev/add/today/jutsu/BloggingIo@7
```

**Response:**
```json
{
  "success": true,
  "date": "2024-01-01",
  "mode": "jutsu",
  "answer": "..."
}
```

### 2. Trigger All Scrapers (Batch)

**Endpoint:** `GET /add/all/:key`

**Usage:** Triggers scraping for all 4 modes sequentially. Returns a summary of success/failure for each.

**Example:**
```
https://narutodle-worker.[subdomain].workers.dev/add/all/BloggingIo@7
```

**Response:**
```json
{
  "summary": "Batch scrape completed",
  "results": [
    { "success": true, "mode": "classic", "date": "...", "answer": "..." },
    { "success": false, "mode": "jutsu", "error": "Timeout..." },
    ...
  ]
}

### 3. Get Today's Answer

**Endpoint:** `GET /today`

**Query Parameters:**
- `mode` (optional): Filter by mode (e.g., `?mode=eye`). If omitted, returns all answers for the latest date.

**Response (Specific Mode):**
```json
{
  "date": "2024-01-01",
  "mode": "eye",
  "answer": "...",
  "created_at": ...
}
```

**Response (All Modes):**
```json
[
  { "date": "...", "mode": "classic", "answer": "..." },
  { "date": "...", "mode": "jutsu", "answer": "..." },
  ...
]
```
