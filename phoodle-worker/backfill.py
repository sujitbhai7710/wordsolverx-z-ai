import requests
from datetime import datetime, timedelta
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration
API_BASE_URL = "https://phoodle-worker.pinpoints.workers.dev"
SECRET_KEY = "BloggingIo@7"  # Replace with your secret key if different
START_DATE = "2023-02-01"
END_DATE = datetime.now().strftime("%Y-%m-%d")
CONCURRENT_REQUESTS = 10
RATE_LIMIT_SLEEP = 60  # Seconds to wait when rate limited

def process_date(date_str):
    url = f"{API_BASE_URL}/add/date/{date_str}/{SECRET_KEY}"
    
    while True:
        try:
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    return (date_str, True, "Success")
                else:
                    return (date_str, False, data.get("error"))
            elif response.status_code == 429:
                print(f"\n⚠️ Rate limited on {date_str}. Waiting {RATE_LIMIT_SLEEP}s...")
                time.sleep(RATE_LIMIT_SLEEP)
                continue # Retry
            else:
                return (date_str, False, f"HTTP Error {response.status_code}")
                
        except Exception as e:
            return (date_str, False, str(e))

def backfill():
    current_date = datetime.strptime(START_DATE, "%Y-%m-%d")
    end_date_obj = datetime.strptime(END_DATE, "%Y-%m-%d")
    
    dates_to_process = []
    while current_date <= end_date_obj:
        dates_to_process.append(current_date.strftime("%Y-%m-%d"))
        current_date += timedelta(days=1)

    print(f"Starting optimized backfill from {START_DATE} to {END_DATE}...")
    print(f"Concurrency: {CONCURRENT_REQUESTS} | Total dates: {len(dates_to_process)}")
    
    success_count = 0
    fail_count = 0
    
    with ThreadPoolExecutor(max_workers=CONCURRENT_REQUESTS) as executor:
        future_to_date = {executor.submit(process_date, d): d for d in dates_to_process}
        
        for i, future in enumerate(as_completed(future_to_date)):
            date_str, success, message = future.result()
            
            if success:
                success_count += 1
                status = "✅"
            else:
                fail_count += 1
                status = f"❌ ({message})"
            
            # Print progress every 10 dates or on failure
            if (i + 1) % 10 == 0 or not success:
                print(f"Progress: {i+1}/{len(dates_to_process)} | Current: {date_str} {status}")
        
    print("\n" + "="*30)
    print(f"Backfill Complete!")
    print(f"Successfully added: {success_count}")
    print(f"Failed: {fail_count}")
    print("="*30)

if __name__ == "__main__":
    backfill()
