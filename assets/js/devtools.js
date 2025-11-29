// devtools
if (window.location.href.includes("file://")) {
    map.getContainer().style.cursor = 'crosshair';
    map.on('mousemove', function (e) {
        map.attributionControl.setPrefix(Math.round(e.latlng.lat) + ',' + Math.round(e.latlng.lng));
    });
    map.on('click', function (e) {
        navigator.clipboard.writeText('[' + Math.round(e.latlng.lat) + ',' + Math.round(e.latlng.lng) + ']');
    });
    var dev_linie_handle = L.marker([0, 0], { icon: L.icon({ iconUrl: "assets/emoji/pushpin.webp", iconSize: [44, 44], iconAnchor: [3, 40] }), draggable: true, isDevtool: true }).addTo(map);
    var dev_linie_coords = [];
    var dev_linie_polygon = L.polygon(dev_linie_coords, { color: "#fff000", isDevtool: true }).addTo(map);
    dev_linie_handle.on('dragend', function (e) {
        var dev_linie_latlng = dev_linie_handle.getLatLng();
        dev_linie_coords.push([Math.round(dev_linie_latlng.lat), Math.round(dev_linie_latlng.lng)]);
        dev_linie_polygon.setLatLngs(dev_linie_coords);
        console.log(JSON.stringify(dev_linie_coords));
    });
    var dev_kurve_handle = L.marker([0, 100], { icon: L.icon({ iconUrl: "assets/emoji/alt_pushpin.webp", iconSize: [44, 44], iconAnchor: [3, 40] }), draggable: true, isDevtool: true }).addTo(map);
    var dev_kurve_coords = [];
    var dev_kurve_polygon = L.polygon(dev_kurve_coords, { color: "#ff00bb", isDevtool: true }).addTo(map);
    dev_kurve_handle.on('dragend', function (e) {
        var dev_kurve_latlng = dev_kurve_handle.getLatLng();
        dev_kurve_coords.push([Math.round(dev_kurve_latlng.lat), Math.round(dev_kurve_latlng.lng)]);
        dev_kurve_polygon.setLatLngs(turf.bezierSpline(turf.lineString(dev_kurve_coords)).geometry.coordinates);
        console.log(JSON.stringify(dev_kurve_coords));
    });
    document.querySelector('.leaflet-image-layer').style.border = '1px dashed #ffffff55';

    /*// test image with draggable corners
    var image_test = L.imageOverlay("assets/map/test.webp",
        new L.LatLngBounds([-472, -611], [450, 310]),
        { isDevtool: true }
    ).addTo(map);
    var test_handle_1 = L.marker([-500, -500], {
        icon: L.icon({ iconUrl: "assets/emoji/pin.webp", iconSize: [22, 22], iconAnchor: [11, 21] }),
        draggable: true,
        isDevtool: true
    }).addTo(map);
    var test_handle_2 = L.marker([500, 500], {
        icon: L.icon({ iconUrl: "assets/emoji/pin.webp", iconSize: [22, 22], iconAnchor: [11, 21] }),
        draggable: true,
        isDevtool: true
    }).addTo(map);
    function update_test_image() {
        var pos1 = test_handle_1.getLatLng();
        var pos2 = test_handle_2.getLatLng();
        image_test.setBounds(new L.LatLngBounds([pos1.lat, pos1.lng], [pos2.lat, pos2.lng]));
        console.log('Handle 1: [' + Math.round(pos1.lat) + ', ' + Math.round(pos1.lng) + ']');
        console.log('Handle 2: [' + Math.round(pos2.lat) + ', ' + Math.round(pos2.lng) + ']');
    }
    test_handle_1.on('drag', update_test_image);
    test_handle_2.on('drag', update_test_image);*/
}
