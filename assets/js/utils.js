// easy leaflet helpers
function marker(coords, name, icon = "pin") {
    return L.marker(coords, { icon: L.icon({ iconUrl: "assets/emoji/" + icon + ".webp", iconSize: [44, 44], iconAnchor: [22, 42], popupAnchor: [0, -40] }) }).bindPopup(name);
}
function linie(color, coords, dashes, weight = 4) {
    return L.polyline(coords, { color: color, dashArray: dashes, weight: weight });
}
function kurve(color, coords, dashes, weight = 4) {
    return L.polyline(turf.bezierSpline(turf.lineString(coords)).geometry.coordinates, { color: color, dashArray: dashes, weight: weight });
}
function blob(color, coords) {
    return L.polygon(turf.bezierSpline(turf.lineString(coords)).geometry.coordinates, { stroke: true, fill: true, fillColor: color, fillOpacity: 0.1 });
}
