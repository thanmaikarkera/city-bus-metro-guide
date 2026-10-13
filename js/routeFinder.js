/*
  routeFinder.js - THE "BRAIN" OF THE WEBSITE
  -------------------------------------------
  This file has NO HTML/screen code. It only does calculations:
    1. buildNetwork()  : turns the raw database rows into an easy-to-search network
    2. findJourneys()  : finds every way to go from stop A to stop B
                         (direct, 1 change or 2 changes)
    3. describe()      : works out time, distance and fare for one journey
    4. bestOptions()   : picks the top 3 journeys for the chosen sort order

  Data Structures link: the network is a GRAPH.
    - Stops are the nodes (vertices).
    - Each bus route / metro line joins its stops in order (the edges).
  We search it with a depth-limited DFS (Depth First Search) using recursion.
*/

const MAX_LEGS = 3; // 3 rides = at most 2 changes


/* ---------- 1. Build the network ---------- */
function buildNetwork(data) {
  const network = {
    stops: {},       // "KSR" -> stop object
    routes: {},      // "B-101" -> route object + its ordered stop list
    stopRoutes: {},  // "KSR" -> [ {routeId, index}, ... ]  (which routes pass through this stop)
    fareSlabs: data.fare_slabs,
    concessions: data.concessions,
  };

  for (const stop of data.stops) {
    network.stops[stop.id] = stop;
    network.stopRoutes[stop.id] = [];
  }

  for (const route of data.routes) {
    network.routes[route.id] = { ...route, path: [] };
  }

  // Sort route_stops by route and seq, so every route's stops are in order
  const rows = [...data.route_stops].sort(
    (a, b) => a.route_id.localeCompare(b.route_id) || a.seq - b.seq
  );

  for (const row of rows) {
    const route = network.routes[row.route_id];
    if (!route || !network.stops[row.stop_id]) continue; // skip broken rows

    // Running totals from the first stop. Then distance between ANY two stops
    // on the route = difference of their totals (like prefix sums).
    const prev = route.path[route.path.length - 1];
    const totalKm = prev ? prev.totalKm + Number(row.km_from_prev) : 0;
    const totalMin = prev ? prev.totalMin + Number(row.min_from_prev) : 0;

    route.path.push({ stopId: row.stop_id, totalKm, totalMin });
    network.stopRoutes[row.stop_id].push({ routeId: row.route_id, index: route.path.length - 1 });
  }

  return network;
}


/* ---------- 2. Find all journeys (depth-limited DFS) ---------- */
function findJourneys(network, fromId, toId) {
  const found = [];

  // explore(): "I am standing at stopId. Which routes can I take from here?"
  function explore(stopId, legsSoFar, usedRoutes, visitedStops) {
    for (const { routeId, index } of network.stopRoutes[stopId]) {
      if (usedRoutes.includes(routeId)) continue;        // don't board the same route twice

      const path = network.routes[routeId].path;
      for (let j = 0; j < path.length; j++) {             // routes run both directions
        if (j === index) continue;
        const nextStop = path[j].stopId;
        if (visitedStops.includes(nextStop)) continue;     // avoid going in circles

        const leg = { routeId, fromIndex: index, toIndex: j };

        if (nextStop === toId) {
          found.push([...legsSoFar, leg]);                 // reached destination!
        } else if (legsSoFar.length + 1 < MAX_LEGS) {
          // Change here and keep searching (this is the recursion / DFS step)
          explore(nextStop, [...legsSoFar, leg], [...usedRoutes, routeId], [...visitedStops, nextStop]);
        }
      }
    }
  }

  explore(fromId, [], [], [fromId]);
  return found;
}


/* ---------- 3. Time, distance and fare for one journey ---------- */
function slabFare(network, mode, km) {
  // Slabs are like: up to 2 km = Rs 10, up to 4 km = Rs 15 ... (max_km null = no limit)
  const slabs = network.fareSlabs
    .filter((s) => s.mode === mode)
    .sort((a, b) => (a.max_km ?? Infinity) - (b.max_km ?? Infinity));
  for (const slab of slabs) {
    if (slab.max_km === null || km <= Number(slab.max_km)) return slab.fare;
  }
  return 0;
}

function describe(network, legs, concessionId) {
  const details = legs.map((leg) => {
    const route = network.routes[leg.routeId];
    const a = route.path[leg.fromIndex];
    const b = route.path[leg.toIndex];
    return {
      route,
      fromStop: network.stops[a.stopId],
      toStop: network.stops[b.stopId],
      // Stops passed through (for drawing on the map)
      stopIds: (leg.fromIndex < leg.toIndex
        ? route.path.slice(leg.fromIndex, leg.toIndex + 1)
        : route.path.slice(leg.toIndex, leg.fromIndex + 1).reverse()
      ).map((p) => p.stopId),
      stopCount: Math.abs(leg.toIndex - leg.fromIndex),
      km: Math.round(Math.abs(b.totalKm - a.totalKm) * 10) / 10,
      rideMin: Math.abs(b.totalMin - a.totalMin),
      waitMin: Math.round(route.frequency_min / 2), // on average you wait half the gap
    };
  });

  // FARE: every bus ride is a new ticket.
  // Metro rides one after another = ONE ticket for the total metro distance.
  let fare = 0;
  let metroKm = 0;
  details.forEach((d, i) => {
    if (d.route.mode === "bus") {
      fare += slabFare(network, "bus", d.km);
    } else {
      metroKm += d.km;
      const nextIsMetro = details[i + 1] && details[i + 1].route.mode === "metro";
      if (!nextIsMetro) {
        fare += slabFare(network, "metro", metroKm);
        metroKm = 0;
      }
    }
  });

  const concession = network.concessions.find((c) => c.id === concessionId) || { discount_pct: 0 };
  const finalFare = Math.round((fare * (100 - concession.discount_pct)) / 100);

  const rideMin = details.reduce((sum, d) => sum + d.rideMin, 0);
  const waitMin = details.reduce((sum, d) => sum + d.waitMin, 0);

  return {
    legs: details,
    changes: details.length - 1,
    km: Math.round(details.reduce((sum, d) => sum + d.km, 0) * 10) / 10,
    rideMin,
    waitMin,
    totalMin: rideMin + waitMin,
    fullFare: fare,
    fare: finalFare,
    discountPct: concession.discount_pct,
    key: details.map((d) => d.route.id).join(">"),
  };
}


/* ---------- 4. Pick the best 3 options ---------- */

// true if every item of `small` appears in `big` in the same order, e.g. [A,C] in [A,B,C]
function isSubsequence(small, big) {
  let i = 0;
  for (const item of big) if (item === small[i]) i++;
  return i === small.length;
}

const SORTERS = {
  fastest:  (a, b) => a.totalMin - b.totalMin || a.changes - b.changes || a.fare - b.fare,
  cheapest: (a, b) => a.fare - b.fare || a.totalMin - b.totalMin || a.changes - b.changes,
  changes:  (a, b) => a.changes - b.changes || a.totalMin - b.totalMin || a.fare - b.fare,
};

function bestOptions(network, fromId, toId, concessionId, sortBy = "fastest", howMany = 3) {
  const all = findJourneys(network, fromId, toId).map((legs) => describe(network, legs, concessionId));
  if (all.length === 0) return [];

  // Keep only the fastest version of each route combination (e.g. "B-102>M-GRN")
  const byKey = {};
  for (const j of all) {
    if (!byKey[j.key] || j.totalMin < byKey[j.key].totalMin) byKey[j.key] = j;
  }
  let options = Object.values(byKey);

  // Drop pointless changes: if a journey uses routes A>B>C, but A>C alone exists
  // and is not slower, the extra change to B is useless.
  options = options.filter((j) => !options.some((k) =>
    k !== j && k.legs.length < j.legs.length &&
    isSubsequence(k.key.split(">"), j.key.split(">")) && k.totalMin <= j.totalMin
  ));

  // Drop silly detours: anything much slower than the quickest journey
  const quickest = Math.min(...options.map((j) => j.totalMin));
  options = options.filter((j) => j.totalMin <= quickest * 1.5 + 10);

  return options.sort(SORTERS[sortBy]).slice(0, howMany);
}


// Lets Node.js load this file for testing. Browsers ignore this line.
if (typeof module !== "undefined") {
  module.exports = { buildNetwork, findJourneys, describe, bestOptions, slabFare };
}
