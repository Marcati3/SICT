#!/usr/bin/env python3
"""
STMicroelectronics Job Listings Scraper
=======================================
Scrapes all open positions from ST's Eightfold AI careers portal.
Run this on your local machine (not in the sandbox).

Usage:
    pip install requests
    python scrape_st_jobs.py

Output: st_jobs_full.jsonl (one JSON object per job, all fields preserved)
"""

import requests
import json
import time
import sys
from datetime import datetime

# ─── CONFIG ───────────────────────────────────────────────────────────────────
BASE_URL = "https://stmicroelectronics.eightfold.ai/api/apply/v2/jobs"
DOMAIN = "stmicroelectronics.com"
PAGE_SIZE = 100  # Eightfold typically allows up to 100 per page
OUTPUT_FILE = "st_jobs_full.jsonl"
DELAY = 1.5  # seconds between requests to be polite

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Origin": "https://stmicroelectronics.eightfold.ai",
    "Referer": "https://stmicroelectronics.eightfold.ai/careers",
}


def fetch_page(start=0, num=PAGE_SIZE):
    """Fetch a page of jobs from the Eightfold API."""
    payload = {
        "applied": False,
        "domain": [DOMAIN],
        "num_fetch": num,
        "start": start,
        "query": "",
        "location": "",
        "department": "",
        "skill": [],
        "sort_by": "relevance",
    }

    resp = requests.post(BASE_URL, json=payload, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    return resp.json()


def try_alternate_endpoints():
    """Try different Eightfold API URL patterns if the primary one fails."""
    alternates = [
        "https://stmicroelectronics.eightfold.ai/api/apply/v2/jobs",
        "https://stmicroelectronics.eightfold.ai/api/apply/jobs",
        "https://stmicroelectronics.eightfold.ai/api/careers/jobs",
        "https://stmicroelectronics.eightfold.ai/api/apply/v2/positions",
    ]

    for url in alternates:
        try:
            payload = {
                "applied": False,
                "domain": [DOMAIN],
                "num_fetch": 5,
                "start": 0,
                "query": "",
            }
            print(f"  Trying: {url}")
            resp = requests.post(url, json=payload, headers=HEADERS, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, dict) and ("positions" in data or "results" in data or "jobs" in data):
                    print(f"  ✓ Found working endpoint: {url}")
                    return url, data
                else:
                    print(f"  ✓ Got 200 but unexpected structure: {list(data.keys()) if isinstance(data, dict) else type(data)}")
                    return url, data
            else:
                print(f"  ✗ Status {resp.status_code}")
        except Exception as e:
            print(f"  ✗ Error: {e}")

    return None, None


def main():
    print(f"STMicroelectronics Job Scraper")
    print(f"{'='*50}")
    print(f"Target: {BASE_URL}")
    print(f"Domain: {DOMAIN}")
    print()

    # First, try to get the first page to understand the response structure
    print("Step 1: Probing API structure...")
    try:
        data = fetch_page(start=0, num=5)
    except requests.exceptions.HTTPError as e:
        print(f"Primary endpoint failed ({e}). Trying alternates...")
        working_url, data = try_alternate_endpoints()
        if working_url:
            global BASE_URL
            BASE_URL = working_url
        else:
            print("\nAll endpoints failed. Try the browser-based approach instead.")
            print("See instructions below.")
            print_browser_instructions()
            sys.exit(1)
    except Exception as e:
        print(f"Connection error: {e}")
        print("\nTrying alternate endpoints...")
        working_url, data = try_alternate_endpoints()
        if not working_url:
            print_browser_instructions()
            sys.exit(1)
        BASE_URL = working_url

    # Analyze response structure
    print(f"\nResponse keys: {list(data.keys()) if isinstance(data, dict) else type(data)}")

    # Eightfold typically returns: {"count": N, "positions": [...]} or {"results": [...]}
    total = 0
    jobs_key = None

    if isinstance(data, dict):
        for key in ["positions", "results", "jobs", "data"]:
            if key in data and isinstance(data[key], list):
                jobs_key = key
                break

        if "count" in data:
            total = data["count"]
        elif "total" in data:
            total = data["total"]
        elif jobs_key:
            # Need to estimate - fetch with larger page
            total = 5000  # will stop when empty

    if not jobs_key:
        print(f"\nUnexpected response structure. Full response (truncated):")
        print(json.dumps(data, indent=2)[:2000])
        print("\n\nSaving raw response for debugging...")
        with open("st_api_response_debug.json", "w") as f:
            json.dump(data, f, indent=2)
        print("Saved to st_api_response_debug.json")
        print_browser_instructions()
        sys.exit(1)

    # Show sample record
    sample = data[jobs_key][0] if data[jobs_key] else {}
    print(f"\nTotal positions reported: {total}")
    print(f"Jobs key: '{jobs_key}'")
    print(f"Sample record keys: {list(sample.keys()) if isinstance(sample, dict) else 'N/A'}")

    if isinstance(sample, dict):
        for k, v in sample.items():
            if isinstance(v, str) and len(v) > 100:
                print(f"  {k}: {v[:80]}...")
            elif isinstance(v, (dict, list)):
                print(f"  {k}: {type(v).__name__} ({len(v)} items)")
            else:
                print(f"  {k}: {v}")

    # Now paginate through all jobs
    print(f"\nStep 2: Fetching all positions (page size={PAGE_SIZE})...")
    all_jobs = []
    start = 0
    page_num = 0

    while True:
        page_num += 1
        try:
            data = fetch_page(start=start, num=PAGE_SIZE)
            jobs = data.get(jobs_key, [])

            if not jobs:
                print(f"  Page {page_num}: empty — done.")
                break

            all_jobs.extend(jobs)
            print(f"  Page {page_num}: fetched {len(jobs)} jobs (total so far: {len(all_jobs)})")

            if len(jobs) < PAGE_SIZE:
                print(f"  Last page (fewer than {PAGE_SIZE} results).")
                break

            start += PAGE_SIZE
            time.sleep(DELAY)

        except Exception as e:
            print(f"  Page {page_num}: ERROR — {e}")
            if page_num > 1:
                print(f"  Continuing with {len(all_jobs)} jobs collected so far.")
                break
            else:
                raise

    # Write output
    print(f"\nStep 3: Writing {len(all_jobs)} jobs to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for job in all_jobs:
            f.write(json.dumps(job, ensure_ascii=False) + "\n")

    print(f"\n{'='*50}")
    print(f"DONE: {len(all_jobs)} jobs saved to {OUTPUT_FILE}")
    print(f"File size: {round(os.path.getsize(OUTPUT_FILE) / 1024, 1)} KB")
    print(f"\nUpload this file to the Cowork session for analysis.")


def print_browser_instructions():
    """Print fallback instructions for browser-based extraction."""
    print(f"""
{'='*60}
FALLBACK: Browser-Based Extraction
{'='*60}

If the API scraper doesn't work, use this browser console method:

1. Open: https://stmicroelectronics.eightfold.ai/careers
2. Open browser DevTools (F12) → Network tab
3. Search for any job to trigger API calls
4. Look for POST requests to /api/apply/v2/jobs
5. Right-click → Copy as cURL
6. Note the exact URL, headers, and payload structure

OR use this console script (paste into DevTools Console):

// Scroll-based extraction
async function extractAllJobs() {{
    const jobs = [];
    const cards = document.querySelectorAll('[data-test-id="position-card"], .position-card, [class*="job-card"], [class*="position"]');
    cards.forEach(card => {{
        const title = card.querySelector('h3, h4, [class*="title"]')?.textContent?.trim();
        const location = card.querySelector('[class*="location"]')?.textContent?.trim();
        const dept = card.querySelector('[class*="department"], [class*="category"]')?.textContent?.trim();
        const link = card.querySelector('a')?.href;
        if (title) jobs.push({{ title, location, dept, link }});
    }});
    return jobs;
}}

// Then run: copy(JSON.stringify(await extractAllJobs(), null, 2))
// This copies the data to your clipboard

Alternatively, use the Eightfold page's built-in pagination
and capture each page of results.
""")


import os

if __name__ == "__main__":
    main()
