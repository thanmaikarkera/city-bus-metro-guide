/*
  app.js - WHAT THE PAGE DOES
  ---------------------------
  Flow:
    1. loadData()      -> get stops/routes/fares from Supabase (or the backup in data.js)
    2. fillDropdowns() -> put the stops into the "From" / "To" lists
    3. user presses "Find routes" -> runSearch() asks routeFinder.js for options
    4. showOptions()   -> draws the option cards
    5. user clicks a card -> showDetails() + drawJourneyOnMap()
  Plus: language switch (English/Kannada) and high-contrast mode.
*/

let currentLang = "en";   // "en" or "kn"
let network = null;       // built by buildNetwork() in routeFinder.js
let lastResults = [];     // the options currently shown
let selectedIndex = 0;    // which option card is selected
let map = null;           // the Leaflet map
let journeyLayer = null;  // map layer for the selected journey
let messageKey = "resultsHint"; // which message is showing above the results

// Shortcut: $("from") = document.getElementById("from")
const $ = (id) => document.getElementById(id);

// Name of a stop / route / concession in the current language
const nameOf = (item) => (currentLang === "kn" ? item.name_kn : item.name_en);


/* ========== 1. LOAD DATA ========== */
async function loadData() {
  const configured = SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase;

  if (configured) {
    try {
      const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      // Ask for all 5 tables at the same time (Promise.all = run in parallel)
      const [stops, routes, routeStops, fareSlabs, concessions] = await Promise.all([
        db.from("stops").select("*"),
        db.from("routes").select("*"),
        db.from("route_stops").select("*").order("route_id").order("seq"),
        db.from("fare_slabs").select("*"),
        db.from("concessions").select("*").order("discount_pct"),
      ]);

      const failed = [stops, routes, routeStops, fareSlabs, concessions].find((r) => r.error);
      if (failed) throw failed.error;
      if (stops.data.length === 0) throw new Error("Supabase tables are empty - run seed.sql");

      return {
        source: "supabase",
        data: {
          stops: stops.data,
          routes: routes.data,
          route_stops: routeStops.data,
          fare_slabs: fareSlabs.data,
          concessions: concessions.data,
        },
      };
    } catch (error) {
      console.warn("Supabase failed, using built-in sample data instead:", error);
    }
  }
  return { source: "local", data: SAMPLE_DATA };
}


/* ========== 2. DROPDOWNS ========== */
function fillDropdowns() {
  const keep = { from: $("from").value, to: $("to").value, passenger: $("passenger").value };

  // Sort stops alphabetically in the current language
  const stops = Object.values(network.stops).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));

  for (const id of ["from", "to"]) {
    const select = $(id);
    select.innerHTML = "";
    select.append(new Option(t("selectStop"), ""));
    for (const stop of stops) {
      // Show which modes stop here, e.g. "Sanjay Circle  (Bus, Metro)"
      const modes = [...new Set(network.stopRoutes[stop.id].map((r) => network.routes[r.routeId].mode))];
      select.append(new Option(`${nameOf(stop)}  (${modes.map((m) => t(m)).join(", ")})`, stop.id));
    }
    select.value = keep[id];
  }

  const passenger = $("passenger");
  passenger.innerHTML = "";
  for (const c of network.concessions) {
    passenger.append(new Option(c.discount_pct ? `${nameOf(c)} (−${c.discount_pct}%)` : nameOf(c), c.id));
  }
  passenger.value = keep.passenger || "general";
}


/* ========== 3. SEARCH ========== */
function runSearch() {
  const from = $("from").value;
  const to = $("to").value;

  $("options").innerHTML = "";
  $("details").hidden = true;
  clearJourneyFromMap();

  if (!from || !to) return showMessage("pickBoth");
  if (from === to) return showMessage("sameStop");

  lastResults = bestOptions(network, from, to, $("passenger").value, $("sort").value);
  if (lastResults.length === 0) return showMessage("noRoute");

  showMessage(null);
  selectedIndex = 0;
  showOptions();
}

// key = which text to show (from i18n.js), or null to show nothing
function showMessage(key) {
  messageKey = key;
  $("message").textContent = key ? t(key) : "";
}


/* ========== 4. OPTION CARDS ========== */
function routeChip(route) {
  return `<span class="chip" style="background:${route.color}">${nameOf(route)}</span>`;
}

function showOptions() {
  const list = $("options");
  list.innerHTML = "";

  lastResults.forEach((j, i) => {
    const chips = j.legs.map((leg) => routeChip(leg.route)).join('<span class="arrow" aria-hidden="true">→</span>');
    const changesText = j.changes === 0 ? t("direct") : j.changes === 1 ? t("oneChange") : t("nChanges", { n: j.changes });

    const li = document.createElement("li");
    li.innerHTML = `
      <button type="button" class="option-card" aria-pressed="${i === selectedIndex}">
        <span class="visually-hidden">${t("option", { n: i + 1 })}:</span>
        <div class="option-head">
          <span class="option-time">${j.totalMin} ${t("min")}</span>
          <span class="option-fare">₹${j.fare}</span>
        </div>
        <div class="option-meta">${changesText} · ${j.km} ${t("km")}</div>
        <div class="chips">${chips}</div>
      </button>`;

    li.querySelector("button").addEventListener("click", () => {
      selectedIndex = i;
      showOptions();
    });
    list.append(li);
  });

  showDetails(lastResults[selectedIndex]);
  drawJourneyOnMap(lastResults[selectedIndex]);
}


/* ========== 5. DETAILS: steps, fare, accessibility ========== */
function showDetails(j) {
  const box = $("details");

  // --- Step-by-step timeline ---
  const steps = j.legs.map((leg) => `
    <li class="step" style="--line:${leg.route.color}">
      <div class="step-title">${t("board", { route: routeChip(leg.route), stop: nameOf(leg.fromStop) })}</div>
      <div class="step-meta">
        ${t("ride", { min: leg.rideMin, km: leg.km, stops: leg.stopCount === 1 ? t("oneStop") : t("stops", { n: leg.stopCount }) })}
        · ${t("every", { n: leg.route.frequency_min })}
      </div>
      <div class="step-meta">${t("getOff", { stop: nameOf(leg.toStop) })}</div>
    </li>`).join("");

  // --- Stops the passenger actually uses: start, every change point, end ---
  const usedStops = [j.legs[0].fromStop, ...j.legs.map((leg) => leg.toStop)];
  const metroStops = new Set(
    j.legs.filter((l) => l.route.mode === "metro").flatMap((l) => [l.fromStop.id, l.toStop.id])
  );
  const notStepFree = usedStops.filter((s) => !s.has_lift && !s.has_ramp);

  const yesNo = (v) => (v ? `<span class="yes">✓<span class="visually-hidden">${t("yes")}</span></span>`
                          : `<span class="no">–<span class="visually-hidden">${t("no")}</span></span>`);
  const facilityRows = usedStops.map((s) => `
    <tr>
      <td>${nameOf(s)}</td>
      <td>${yesNo(s.has_lift)}</td><td>${yesNo(s.has_escalator)}</td><td>${yesNo(s.has_ramp)}</td>
      <td>${yesNo(s.has_tactile_path)}</td><td>${yesNo(s.has_accessible_toilet)}</td>
    </tr>`).join("");

  const vehicles = j.legs.map((leg) => {
    const route = nameOf(leg.route);
    if (leg.route.mode === "metro") return `<li>${t("metroLevel", { route })}</li>`;
    return `<li>${t(leg.route.low_floor ? "lowFloorYes" : "lowFloorNo", { route })}</li>`;
  });

  const usesBus = j.legs.some((l) => l.route.mode === "bus");
  const usesMetro = metroStops.size > 0;
  const concession = network.concessions.find((c) => c.id === $("passenger").value);

  box.innerHTML = `
    <div>
      <h2>${t("option", { n: selectedIndex + 1 })}: ${j.totalMin} ${t("min")} · ₹${j.fare}</h2>
      <p class="small">${t("totalNote", { ride: j.rideMin, wait: j.waitMin })}</p>
      ${j.discountPct ? `<p class="small">${t("discount", { name: nameOf(concession), p: j.discountPct, full: j.fullFare })}</p>` : ""}
    </div>

    <ol class="steps">${steps}</ol>
    <p class="small">${t("fareNote")}</p>

    <div>
      <h2>${t("accessHeading")}</h2>
      <p class="status ${notStepFree.length ? "warn" : "good"}">
        ${notStepFree.length ? t("stepFreeNo", { list: notStepFree.map(nameOf).join(", ") }) : t("stepFreeYes")}
      </p>
    </div>

    <div>
      <h3>${t("facilitiesHeading")}</h3>
      <div class="table-wrap"><table>
        <thead><tr>
          <th scope="col">${t("stopCol")}</th><th scope="col">${t("lift")}</th><th scope="col">${t("escalator")}</th>
          <th scope="col">${t("ramp")}</th><th scope="col">${t("tactile")}</th><th scope="col">${t("toilet")}</th>
        </tr></thead>
        <tbody>${facilityRows}</tbody>
      </table></div>
    </div>

    <div>
      <h3>${t("vehiclesHeading")}</h3>
      <ul class="plain">${vehicles.join("")}</ul>
    </div>

    <div>
      <h3>${t("seatsHeading")}</h3>
      <ul class="plain">
        ${usesBus ? `<li>${t("seatsBus")}</li>` : ""}
        ${usesMetro ? `<li>${t("seatsMetro")}</li>` : ""}
        <li>${t("concessionList")}</li>
      </ul>
    </div>`;

  box.hidden = false;
}


/* ========== 6. MAP (Leaflet + OpenStreetMap) ========== */
function setUpMap() {
  if (typeof L === "undefined") {           // Leaflet did not load (offline?)
    $("map").textContent = t("mapOff");
    return;
  }

  map = L.map("map").setView([12.535, 76.885], 12);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Draw the whole network faintly: every route as a thin line
  for (const route of Object.values(network.routes)) {
    const points = route.path.map((p) => [network.stops[p.stopId].lat, network.stops[p.stopId].lng]);
    L.polyline(points, {
      color: route.color,
      weight: route.mode === "metro" ? 5 : 3,
      opacity: 0.35,
      dashArray: route.mode === "bus" ? "6 6" : null,  // bus = dashed, metro = solid
    }).addTo(map).bindTooltip(nameOf(route));
  }

  // Every stop as a small circle
  for (const stop of Object.values(network.stops)) {
    L.circleMarker([stop.lat, stop.lng], { radius: 4, color: "#444", weight: 1, fillColor: "#fff", fillOpacity: 1 })
      .addTo(map)
      .bindTooltip(nameOf(stop));
  }
}

function clearJourneyFromMap() {
  if (journeyLayer) journeyLayer.remove();
  journeyLayer = null;
}

function drawJourneyOnMap(j) {
  if (!map) return;
  clearJourneyFromMap();
  journeyLayer = L.layerGroup().addTo(map);

  const allPoints = [];
  j.legs.forEach((leg, i) => {
    const points = leg.stopIds.map((id) => [network.stops[id].lat, network.stops[id].lng]);
    allPoints.push(...points);
    L.polyline(points, { color: leg.route.color, weight: 7, opacity: 0.95 }).addTo(journeyLayer);

    // Marker where you get on (green = start, orange = change)
    L.circleMarker(points[0], {
      radius: 8, weight: 3, color: i === 0 ? "#1b7a3d" : "#e67700", fillColor: "#fff", fillOpacity: 1,
    }).addTo(journeyLayer).bindTooltip(nameOf(leg.fromStop), { permanent: true, direction: "top" });
  });

  // Marker at the destination (red)
  const last = j.legs[j.legs.length - 1].toStop;
  L.circleMarker([last.lat, last.lng], { radius: 8, weight: 3, color: "#c92a2a", fillColor: "#fff", fillOpacity: 1 })
    .addTo(journeyLayer).bindTooltip(nameOf(last), { permanent: true, direction: "top" });

  map.fitBounds(allPoints, { padding: [50, 50] });
}


/* ========== 7. LANGUAGE + HIGH CONTRAST ========== */
function applyLanguage() {
  document.documentElement.lang = currentLang;

  // Every element with data-i18n="key" gets the text for that key
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  $("lang-btn").textContent = t("langBtn");
  $("lang-btn").lang = currentLang === "en" ? "kn" : "en";
  showMessage(messageKey);
  if (network) {
    $("data-source").textContent = t(network.source === "supabase" ? "dataSupabase" : "dataLocal");
    fillDropdowns();
    if (map) {                               // rebuild map so its labels change language
      map.remove();
      map = null;
      journeyLayer = null;
      setUpMap();
    }
    if (lastResults.length) showOptions();   // redraw results in the new language
  }
}

// Remember choices in this browser (wrapped in try/catch: storage can be blocked)
function save(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }


/* ========== 8. START EVERYTHING ========== */
async function start() {
  currentLang = load("lang") === "kn" ? "kn" : "en";
  if (load("contrast") === "on") {
    document.body.classList.add("high-contrast");
    $("contrast-btn").setAttribute("aria-pressed", "true");
  }
  applyLanguage();

  const { source, data } = await loadData();
  network = buildNetwork(data);
  network.source = source;

  applyLanguage();     // fills dropdowns + data badge
  setUpMap();

  // --- Button / form events ---
  $("search").addEventListener("submit", (event) => {
    event.preventDefault();          // stop the page from reloading
    runSearch();
  });

  $("sort").addEventListener("change", () => { if (lastResults.length) runSearch(); });
  $("passenger").addEventListener("change", () => { if (lastResults.length) runSearch(); });

  $("swap-btn").addEventListener("click", () => {
    [$("from").value, $("to").value] = [$("to").value, $("from").value];
    if (lastResults.length) runSearch();
  });

  $("lang-btn").addEventListener("click", () => {
    currentLang = currentLang === "en" ? "kn" : "en";
    save("lang", currentLang);
    applyLanguage();
  });

  $("contrast-btn").addEventListener("click", () => {
    const on = document.body.classList.toggle("high-contrast");
    $("contrast-btn").setAttribute("aria-pressed", String(on));
    save("contrast", on ? "on" : "off");
  });
}

start();
