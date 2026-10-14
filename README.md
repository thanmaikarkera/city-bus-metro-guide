# City Bus and Metro Guide · Mandya

A trip planner for Mandya. Choose where you're starting and where you're going, and it shows up to
**3 route options** with the steps, fare, travel time and accessibility information for each one.
The whole site works in **English and Kannada**.

**Live site:** https://city-bus-metro-guide.pages.dev

> **Sample data.** The stops are real places in Mandya, with approximate positions from OpenStreetMap.
> The bus routes, fares and timings are made up, and the 2 metro lines are imaginary because Mandya has no metro.
> This was built as a college project.

## Features

- Up to 3 journeys with up to 2 changes between buses and metro lines
- Sort by **fastest**, **cheapest** or **fewest changes**
- Fares by distance, with concessions for students, senior citizens and people with disabilities
- Full Kannada mode, including stop names and the map
- Accessibility: high-contrast mode, full keyboard use and a "Skip to search" link
- A map of the journey (Leaflet + OpenStreetMap)
- Falls back to built-in sample data if the database can't be reached

## Try it

On the [live site](https://city-bus-metro-guide.pages.dev):

1. **Direct trip:** PES College of Engineering → Mandya Railway Station
2. **One change:** Keragodu → PES College of Engineering (Purple Line → Green Line on one metro ticket)
3. **Two changes:** Kothathi → Ummadahalli (Bus 102 → Green Line → Bus 103)
4. Switch **Sort by** to **Cheapest** and an all-bus option comes first
5. Set **Passenger type** to **Student** and the fare drops 25%
6. Click **ಕನ್ನಡ** and the whole page switches to Kannada

## How the route search works

- The network is a **graph**: stops are nodes, and each bus route or metro line is a chain of edges.
- `findJourneys()` runs a **depth-limited DFS** (recursion): from the start stop it tries every route,
  gets off at every possible stop, and tries another route from there. The limit is 3 rides (2 changes).
- **Travel time** = ride time (sum of the stop-to-stop minutes) + waiting time
  (on average half the frequency: a bus every 20 minutes means about 10 minutes of waiting).
- **Fare** uses distance slabs. Each bus ride is a new ticket; back-to-back metro rides are one ticket
  for the total metro distance. The concession is applied at the end.
- `bestOptions()` removes duplicates, pointless changes and slow detours, sorts what's left and keeps the top 3.
- Distances between two stops on a route use **running totals** (like prefix sums), so each one is a single
  subtraction instead of a loop.

## Built with

HTML, CSS and plain JavaScript (no framework) · Supabase (Postgres, read-only row-level security) ·
Cloudflare Pages · Leaflet + OpenStreetMap

## Project structure

| File | What it does |
|---|---|
| `index.html` | Page structure: header, search form, results and map |
| `css/style.css` | Layout, colours, high-contrast mode and phone layout |
| `js/routeFinder.js` | Route search (graph + DFS), travel time and fares |
| `js/app.js` | Loads the data, handles the form, shows results and the map |
| `js/i18n.js` | All text in English and Kannada |
| `js/data.js` | Built-in copy of the sample data, used if the database is unavailable |
| `js/config.js` | Supabase URL and publishable key |
| `supabase/schema.sql` | The 5 tables (`stops`, `routes`, `route_stops`, `fare_slabs`, `concessions`) and read-only security |
| `supabase/seed.sql` | The sample Mandya data |

## Run it locally

Download or clone the repo and open `index.html` in a browser. It runs on the built-in sample data.
To connect your own database and host it, follow [docs/SETUP.md](docs/SETUP.md).

The key in `js/config.js` is Supabase's **publishable** key, which is meant to be public:
row-level security only allows reading, so visitors can't change any data.
