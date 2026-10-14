# Setting up your own copy

This guide sets up your own database and hosting for the City Bus and Metro Guide. Everything here is free.
You don't need any of it just to try the site: open `index.html` and it runs on the built-in sample data.

## Part 1: Supabase (the database)

### 1.1 Create a project
1. Go to **https://supabase.com/dashboard** and sign in.
2. Click **New project**.
3. **Name:** `city-bus-metro-guide`. **Database password:** click **Generate a password** and save it somewhere.
   **Region:** pick **South Asia (Mumbai)** if it's offered.
4. Click **Create new project** and wait 1–2 minutes until it's ready.

### 1.2 Create the tables
1. In the left sidebar, click **SQL Editor**.
2. Click **New query** (or the **+** button).
3. Open `supabase/schema.sql` in Notepad or VS Code, **select all (Ctrl+A)**, **copy (Ctrl+C)**,
   and **paste** it into the Supabase editor.
4. Click **Run** (or press Ctrl+Enter).
   - Supabase may show a warning that the query has **destructive operations** (the `drop table` lines).
     This is expected: those lines only delete *these* tables if they already exist. Click **Run this query**.
5. You should see **"Success. No rows returned."**

### 1.3 Add the sample data
1. Click **New query** again.
2. Copy and paste everything from `supabase/seed.sql`.
3. Click **Run** → **"Success. No rows returned."**
4. Check it: click **Table Editor** in the sidebar. You should see 5 tables:
   `stops` (23 rows), `routes` (8), `route_stops` (44), `fare_slabs` (9), `concessions` (4).

### 1.4 Connect the website to Supabase
1. At the top of the dashboard, click the **Connect** button
   (or go to **Project Settings → API Keys**).
2. Copy the **Project URL**. It looks like `https://abcdefgh.supabase.co`.
3. Copy the **publishable key** (starts with `sb_publishable_`). If your project only shows
   **Legacy API keys**, copy the **anon public** key (starts with `eyJ`). Either works.
   ❌ Do **not** copy the **secret** / **service_role** key.
4. Open `js/config.js` and paste them in between the quotes:
   ```js
   const SUPABASE_URL = "https://abcdefgh.supabase.co";
   const SUPABASE_ANON_KEY = "sb_publishable_xxxxxxxxxxxx";
   ```
5. Save the file. Double-click `index.html` again. The badge should now say **"Data: Supabase"**

**Why is it safe to put this key in a public website?** The publishable/anon key is *meant* to be
public. In `schema.sql` we turned on **Row Level Security** and only allowed **select** (read).
So visitors can read routes but can't change anything.

**Try it live:** in **Table Editor → routes**, change the `frequency_min` of `B-101` from 10 to 40,
then refresh the website. The waiting time changes. It shows the site reads live data.

---

## Part 2: Put the code on GitHub

Easiest way, using only the website (no Git commands):

1. Go to **https://github.com/new**.
2. **Repository name:** `city-bus-metro-guide`. Choose **Public**. Do **not** tick "Add a README".
3. Click **Create repository**.
4. On the next page, click the link **"uploading an existing file"**.
5. Open this project folder in File Explorer, **select everything inside it** (`index.html`, `README.md`,
   and the `css`, `js` and `supabase` folders), and **drag it all** into the browser window.
   - Folders must keep their structure. If dragging folders doesn't work in your browser, try Chrome or Edge.
6. Scroll down and click **Commit changes**.
7. Check that the repo shows `index.html` at the **top level**, next to the `css`, `js` and `supabase` folders.

> If you already use **Git** or **GitHub Desktop**, you can commit and push the folder normally instead.

---

## Part 3: Deploy on Cloudflare Pages

1. Go to **https://dash.cloudflare.com** and sign in.
2. In the left sidebar, open **Workers & Pages** (it may be under **Compute**).
3. Click **Create application** (or **Create**).
4. Choose the **Pages** tab. If you only see Workers options, click the small link
   **"Looking to deploy Pages? Get started"**.
5. Click **Import an existing Git repository** (or **Connect to Git**).
6. Click **Connect GitHub**, authorise Cloudflare, and allow access to the `city-bus-metro-guide` repo.
7. Select the repo and click **Begin setup**.
8. Fill in:
   | Setting | Value |
   |---|---|
   | Project name | `city-bus-metro-guide` (this becomes your link) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | `exit 0` (this means "nothing to build") |
   | Build output directory | leave it **empty**, because `index.html` is at the top of the repo. If it insists on a value, type `/` |
9. Click **Save and Deploy**. Wait about 1 minute.
10. Your live link appears, something like **`https://city-bus-metro-guide.pages.dev`**

**Updating later:** every time you change a file on GitHub (edit, or upload a new version),
Cloudflare redeploys automatically within about a minute.

---
