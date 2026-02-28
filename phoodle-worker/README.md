# Phoodle Worker

A Cloudflare Worker that automatically scrapes Phoodle daily answers and provides API endpoints for the frontend.

## Features

- **Daily Scraper**: Runs at 05:00 AM UTC every day to fetch the next day's answer.
- **Admin API**: Secure endpoints to manually add, delete, or trigger scrapes.
- **Frontend API**: Easy access to today's, yesterday's, or any specific date's answer.
- **D1 Database**: Stores all answers for fast retrieval.

## Setup Instructions

### 1. Create a D1 Database
If you haven't already created a database, run the following command in your terminal:
```bash
npx wrangler d1 create wordle_challenge_db
```
*Note: If you already have this database, skip this step.*

### 2. Configure `wrangler.toml`
Ensure the `database_id` in `wrangler.toml` matches your database. You can find your database IDs by running:
```bash
npx wrangler d1 list
```

Update your `wrangler.toml` with the correct ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "wordle_challenge_db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 3. Set Secret Key
The worker uses a `SECRET_KEY` variable for admin endpoints. **Ensure you have removed `SECRET_KEY` from the `[vars]` section of `wrangler.toml`** and set it as a secret instead:
```bash
npx wrangler secret put SECRET_KEY
```
*Note: Using secrets is safer than plain text in the configuration file.*

### 4. Deploy
Deploy the worker to Cloudflare:
```bash
npx wrangler deploy
```

### 5. Initialize Database
After deployment, call the setup endpoint to create the necessary table:
`https://your-worker-url.workers.dev/setup/YOUR_SECRET_KEY`

---

## API Endpoints

### Public Endpoints
- **Get Today's Answer**: `GET /today`
- **Get Yesterday's Answer**: `GET /yesterday`
- **Get Specific Date**: `GET /show/date/YYYY-MM-DD`
- **Get Paginated List**: `GET /list/page/:page` (returns dates only, 20 per page)

### Admin Endpoints (Requires Secret Key)
- **Initialize DB**: `GET /setup/:secretkey`
- **Manual Add**: `GET /add/date/YYYY-MM-DD/:secretkey`
- **Trigger Next Day Scrape**: `GET /crop-trigger/:secretkey`
- **Delete Entry**: `GET /delete/date/YYYY-MM-DD/:secretkey`

## Daily Automation
The worker is scheduled to run at **05:00 AM UTC** daily.
At this time, it fetches data for the **next calendar day** (e.g., on Jan 9, it fetches Jan 10 data) to ensure availability across all timezones.
