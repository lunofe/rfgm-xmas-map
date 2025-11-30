// live data config
const liveConfig = {
    proxyUrl: 'https://cdn.lunofe.com/rfgm/proxy.php',
    mapData: gipfelbach,
    markerLayers: {
        'tram': gipfelbach_tram,
        'zug': gipfelbach_regionalbahn,
        'zahnradbahn': gipfelbach_zahnradbahn
    }
};

// layer for live data
const live_players = L.layerGroup();
let liveMarkerMap = new Map();
let livePlayerMap = new Map();

// animate marker movement
function animateMarkerMove(markerObj, from, to, duration = 1000) {
    const start = performance.now();
    function step(now) {
        const t = Math.min((now - start) / duration, 1);
        markerObj.setLatLng([
            from[0] + (to[0] - from[0]) * t,
            from[1] + (to[1] - from[1]) * t
        ]);
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// fetch live data via proxy
async function fetchLiveData() {
    try {
        return await Promise.all([
            fetch(`${liveConfig.proxyUrl}?type=markers`).then(r => r.json()),
            fetch(`${liveConfig.proxyUrl}?type=players`).then(r => r.json())
        ]);
    } catch (error) {
        console.error('Error fetching live data:', error);
    }
}

// update vehicles
function updateMarkers(markersData) {
    const newMarkers = new Map();
    const typeIndices = {};
    markersData[4].markers.forEach(m => {
        const iconLower = m.tooltip.toLowerCase();
        const targetLayer = liveConfig.markerLayers[iconLower];
        if (targetLayer) {
            if (!typeIndices[iconLower]) typeIndices[iconLower] = 0;
            newMarkers.set(m.id || `${m.tooltip}_${typeIndices[iconLower]++}`, { m, iconLower, targetLayer });
        }
    });
    for (const [markerId, data] of liveMarkerMap.entries()) {
        if (!newMarkers.has(markerId)) {
            data.layer.removeLayer(data.markerObj);
            liveMarkerMap.delete(markerId);
        }
    }
    for (const [markerId, { m, iconLower, targetLayer }] of newMarkers.entries()) {
        const newPos = [-m.point.z, m.point.x];
        const existing = liveMarkerMap.get(markerId);
        if (existing) {
            const oldPos = existing.markerObj.getLatLng();
            if (oldPos.lat !== newPos[0] || oldPos.lng !== newPos[1]) {
                animateMarkerMove(existing.markerObj, [oldPos.lat, oldPos.lng], newPos);
            }
            if (existing.layer !== targetLayer) {
                existing.layer.removeLayer(existing.markerObj);
                existing.markerObj.addTo(targetLayer);
                existing.layer = targetLayer;
            }
        } else {
            const markerObj = marker(newPos, m.tooltip, iconLower);
            markerObj.addTo(targetLayer);
            liveMarkerMap.set(markerId, { layer: targetLayer, markerObj });
        }
    }
}

// update players
function updatePlayers(playersData) {
    const newPlayers = new Map();
    playersData.players.forEach(p => newPlayers.set(p.id || p.name, p));
    for (const [playerId, markerObj] of livePlayerMap.entries()) {
        if (!newPlayers.has(playerId)) {
            live_players.removeLayer(markerObj);
            livePlayerMap.delete(playerId);
        }
    }
    for (const [playerId, p] of newPlayers.entries()) {
        const newPos = [-p.z, p.x];
        const existing = livePlayerMap.get(playerId);

        if (existing) {
            const oldPos = existing.getLatLng();
            animateMarkerMove(existing, [oldPos.lat, oldPos.lng], newPos);
        } else {
            const markerObj = marker(newPos, p.name, 'spieler');
            markerObj.addTo(live_players);
            livePlayerMap.set(playerId, markerObj);
        }
    }
}

// update search with live data
function updateLiveSearch() {
    search_markers = search_markers.filter(m => !m.isLive);
    for (const { markerObj } of liveMarkerMap.values()) {
        if (markerObj.getPopup()) {
            search_markers.push({
                name: markerObj.getPopup().getContent(),
                layer: markerObj,
                position: markerObj.getLatLng(),
                category: '(Live) Fahrzeuge',
                icon: markerObj.options.icon.options.iconUrl,
                isLive: true
            });
        }
    }
    for (const markerObj of livePlayerMap.values()) {
        if (markerObj.getPopup()) {
            search_markers.push({
                name: markerObj.getPopup().getContent(),
                layer: markerObj,
                position: markerObj.getLatLng(),
                category: '(Live) Spieler',
                icon: markerObj.options.icon.options.iconUrl,
                isLive: true
            });
        }
    }
}

// fetch and update all live data
async function update() {
    const data = await fetchLiveData();
    if (data) {
        updateMarkers(data[0]);
        updatePlayers(data[1]);
        updateLiveSearch();
    }
}

// initial fetch and auto-update
update();
setInterval(update, 1000);

// add live players layer to map and layer control
liveConfig.mapData.layers[0].addOverlay(live_players, '(Live) Spieler');
liveConfig.mapData.layers.push(live_players); // layers array
live_players.addTo(map); // enable by default
