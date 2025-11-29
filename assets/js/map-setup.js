// map setup
var map = L.map("map", {
    crs: L.CRS.Simple,
    wheelPxPerZoomLevel: 100,
    minZoom: -2,
    maxZoom: 2,
    maxBounds: [[0, 0], [0, 0]], // map_data_switch
    zoomControl: false
}).setView([0, 0], -1);
var bounds; // map_data_switch
map.attributionControl.setPrefix("<a href='https://github.com/lunofe/rfgm-xmas-map'>Quelloffen auf GitHub</a>");
var map_image = L.imageOverlay("", [[0, 0], [0, 0]]).addTo(map); // map_data_switch
var layer_toggle;
