# City Bus and Metro Guide (Mandya)

A public transport information website. Choose a **source** and **destination** and it shows up to
3 route options with **route steps, fare, travel time and accessibility information**.

> ⚠️ All data is **SAMPLE data** for a college project. The places are real Mandya places and their
> map positions are approximate (from OpenStreetMap), but the bus routes, fares and timings are
> made up. **The 2 metro lines are imaginary**, because Mandya has no metro.

## 🌐 Live now

| | |
|---|---|
| **Live website** | https://city-bus-metro-guide.pages.dev |
| **Code** | https://github.com/thanmaikarkera/city-bus-metro-guide |
| **Database** | Supabase. The 5 tables (`stops`, `routes`, `route_stops`, `fare_slabs`, `concessions`) are in the project **"thanmaikarkera@gmail.com's Project"**, next to the Outfit Calendar tables, because the free plan allows only 2 projects. |

Parts 1–3 below are **already done**. They're kept so you can explain or repeat the setup in your viva.

**Built with:** HTML · CSS · JavaScript (no frameworks) · Supabase (database) · Cloudflare Pages (hosting)
· Leaflet + OpenStreetMap (free map)

---

## 📁 What is in this folder

| File | What it does |
|---|---|
| `index.html` | The **structure** of the page: header, form, results area, map box |
| `css/style.css` | The **look**: colours, layout, high-contrast mode, phone layout |
| `js/config.js` | **Your Supabase URL and key** go here |
| `js/data.js` | A **backup copy** of the sample data (used if Supabase is not set up or fails) |
| `js/i18n.js` | All text in **English and Kannada** |
| `js/routeFinder.js` | The **brain**: finds routes (graph + DFS), works out time and fare |
| `js/app.js` | Connects everything: loads data, handles buttons, shows results and the map |
| `supabase/schema.sql` | Creates the 5 database **tables** + read-only security |
| `supabase/seed.sql` | Fills the tables with the **sample Mandya data** |

---

## ▶️ Part 0: See it working right now (2 minutes)

1. Open this folder in File Explorer.
2. **Double-click `index.html`**. It opens in your browser.
3. Pick **From: Kothathi** and **To: Ummadahalli**, then click **Find routes**. You'll see a trip with 2 changes.

The badge at the top right says **"Data: built-in sample"**. That means it is using `data.js`.
After Part 1 it will say **"Data: Supabase"**.

---

## 🗄️ Part 1: Supabase (the database)

### 1.1 Create a project
1. Go to **https://supabase.com/dashboard** and sign in.
2. Click **New project**.
3. **Name:** `city-bus-metro-guide`. **Database password:** click **Generate a password** and save it somewhere.
   **Region:** pick **South Asia (Mumbai)** if it's offered (it's closest to you).
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
5. Save the file. Double-click `index.html` again. The badge should now say **"Data: Supabase"** ✅

**Why is it safe to put this key in a public website?** The publishable/anon key is *meant* to be
public. In `schema.sql` we turned on **Row Level Security** and only allowed **select** (read).
So visitors can read routes but can't change anything.

**Try it live:** in **Table Editor → routes**, change the `frequency_min` of `B-101` from 10 to 40,
then refresh the website. The waiting time changes. That's a great thing to show in your demo.

---

## 🐙 Part 2: Put the code on GitHub

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

## ☁️ Part 3: Deploy on Cloudflare Pages

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
10. Your live link appears, something like **`https://city-bus-metro-guide.pages.dev`** 🎉

**Updating later:** every time you change a file on GitHub (edit, or upload a new version),
Cloudflare redeploys automatically within about a minute.

---

## ✅ Demo checklist (for your presentation)

1. **Direct trip:** PES College of Engineering → Mandya Railway Station (Green Line)
2. **1 change:** Keragodu → PES College of Engineering (Purple Line → Green Line, one metro ticket)
3. **2 changes:** Kothathi → Ummadahalli (Bus 102 → Green Line → Bus 103)
4. Change **Sort by** to **Cheapest**. A different (all-bus) option comes first.
5. Change **Passenger type** to **Student**. The fare drops 25%.
6. Click **ಕನ್ನಡ**. The whole page, including stop names and the map, switches to Kannada.
7. Click **High contrast**. You get a black/yellow theme for low-vision users.
8. Press **Tab** on the keyboard. You can use the whole site without a mouse.
9. Show the **Data: Supabase** badge and edit a value live in Supabase (see Part 1).

---

## 🧠 How the route search works (for viva)

- The network is a **graph**: stops = **nodes**, each bus route/metro line = a chain of **edges**.
- `findJourneys()` does a **depth-limited DFS** (recursion): from the start stop, try every route,
  get off at every possible stop, and from there try another route. The limit is **3 rides (2 changes)**.
- **Travel time** = ride time (sum of the stored stop-to-stop minutes) + waiting
  (on average **half the frequency**: a bus every 20 min means about 10 min waiting).
- **Fare** = distance slabs. Each **bus ride** is a new ticket. Back-to-back **metro rides** are one
  ticket for the total metro distance. The concession % is applied at the end.
- `bestOptions()` removes duplicates, pointless changes and slow detours, then sorts by
  fastest / cheapest / fewest changes and keeps the **top 3**.
- Distances between any two stops on a route use **running totals** (like prefix sums), so it's a
  single subtraction instead of a loop.

---

## 🔧 Small things you may want to check

- **Kannada spellings:** please read through the Kannada stop names in `supabase/seed.sql`
  (and `js/data.js`) and the text in `js/i18n.js`, and fix anything that looks off.
- **Editing data:** change stops, routes and fares in **Supabase → Table Editor**. `data.js` is only a
  backup copy and won't update by itself.
- **Map tiles** come from OpenStreetMap's free server, which is fine for a small student project.
