// define dates
const years = {
    "2024": {
        days: [
            "31.12.",
            "30.12.",
            "29.12.",
            "28.12.",
            "27.12.",
            "26.12.",
            "25.12.",
            "24.12.",
            "23.12.",
            "22.12.",
            "21.12.",
            "20.12.",
            "19.12.",
            "18.12.",
            "17.12.",
            "16.12.",
            "15.12.",
            "14.12.",
            "13.12.",
            "12.12.",
            "11.12.",
            "10.12.",
            "09.12.",
            "08.12.",
            "07.12.",
            "06.12.",
            "05.12.",
            "04.12.",
            "03.12.",
            "02.12.",
            "01.12.",
            "30.11.",
            "29.11.",
            "28.11."
        ],
        layers: lichtertal_layers()
    },
    "2023": {
        days: [
            "31.12.",
            "23.12.",
            "19.12.",
            "17.12.",
            "14.12.",
            "09.12.",
            "07.12.",
            "06.12.",
            "05.12.",
            "04.12.",
            "03.12."
        ],
        layers: tannberg_layers()
    }
};

// search functionality
const search = {
    markers: [],
    collect_markers() {
        this.markers = [];
        const layers = years[document.getElementById('year').value].layers;
        layers.forEach((layer_group, i) => {
            if (i === 0) return; // Skip control layer
            // Get category name from control layer
            let category = 'Unbekannt';
            if (layers[0]._layers) {
                for (let key in layers[0]._layers) {
                    if (layers[0]._layers[key].layer === layer_group) {
                        category = layers[0]._layers[key].name || 'Unbekannt';
                        break;
                    }
                }
            }
            layer_group.eachLayer(layer => {
                if (layer instanceof L.Marker && layer.getPopup()) {
                    this.markers.push({
                        name: layer.getPopup().getContent(),
                        layer: layer,
                        position: layer.getLatLng(),
                        category: category
                    });
                }
            });
        });
    },
    perform_search(query) {
        const results = document.getElementById('search_results');
        const filtered = query.trim()
            ? this.markers.filter(m => m.name.toLowerCase().replace(/<[^>]*>/g, ' ').includes(query.toLowerCase()))
            : this.markers;
        results.innerHTML = filtered.length ? filtered.map(r => `
            <div class="search_result_item" data-lat="${r.position.lat}" data-lng="${r.position.lng}">
                <div class="search_result_name">${r.name.replace(/<br>/g, ' ')}</div>
                <div class="search_result_category">${r.category}</div>
            </div>
        `).join('') : '<div class="search_no_results">Keine Ergebnisse gefunden</div>';
        results.classList.add('visible');
        results.querySelectorAll('.search_result_item').forEach(item => {
            item.onclick = () => {
                map.flyTo([item.dataset.lat, item.dataset.lng], 2, { duration: 1 });
                const marker = this.markers.find(m =>
                    m.position.lat == item.dataset.lat && m.position.lng == item.dataset.lng
                );
                if (marker) setTimeout(() => marker.layer.openPopup(), 1000);
                results.classList.remove('visible');
                document.getElementById('search_input').value = '';
            };
        });
    },
    init() {
        const input = document.getElementById('search_input');
        const update_width = () => requestAnimationFrame(() => {
            const w = document.querySelector('#control > :first-child').offsetWidth + 'px';
            input.style.width = w;
            document.getElementById('search_results').style.width = w;
        });
        update_width();
        input.addEventListener('input', e => this.perform_search(e.target.value));
        input.addEventListener('focus', () => this.perform_search(input.value));
        document.addEventListener('click', e => {
            if (!document.getElementById('control').contains(e.target)) {
                document.getElementById('search_results').classList.remove('visible');
            }
        });
        this.collect_markers();
    }
};
search.init();

function map_data_switch() {
    // clear previous control and layers
    if (layer_toggle) map.removeControl(layer_toggle);
    map.eachLayer(layer => { if (layer !== map_image) map.removeLayer(layer); });
    // get user input
    const data = years[document.getElementById('year').value];
    // add layers and control
    data.layers.forEach(layer => layer.addTo(map));
    layer_toggle = data.layers[0].addTo(map);
    // update available days dropdown
    document.getElementById('day').innerHTML = data.days.map(day =>
        `<option value="${day}">${day}</option>`
    ).join('');
    // apply
    update_map_image();
    search.collect_markers();
    document.getElementById('search_results').classList.remove('visible');
}

// update map image
function update_map_image() {
    // switch image source based on user input
    map_image.setUrl("assets/map/" + document.getElementById('year').value + "/" + document.getElementById('day').value + "webp");
}

// map setup
var map = L.map("map", {
    crs: L.CRS.Simple,
    wheelPxPerZoomLevel: 100,
    minZoom: -2,
    maxZoom: 2,
    maxBounds: [[-1500, -1500], [1500, 1500]],
    zoomControl: false
}).setView([0, 0], -1);
var bounds = new L.LatLngBounds(
    map.unproject([-896, -896], 0),
    map.unproject([896, 896], 0)
);
map.attributionControl.setPrefix("<a href='https://github.com/lunofe/rfgm-xmas-map'>Quelloffen auf GitHub</a>");
var map_image = L.imageOverlay("", bounds).addTo(map);
var layer_toggle;

// easy leaflet helpers
function marker(coords, name, icon = "pin") {
    return L.marker(coords, { icon: L.icon({ iconUrl: "assets/fluentui-emoji/" + icon + ".webp", iconSize: [44, 44], iconAnchor: [22, 42], popupAnchor: [0, -40] }) }).bindPopup(name);
}
function linie(color, coords, dashes, weight = 4) {
    return L.polyline(coords, { color: color, dashArray: dashes, weight: weight });
}
function kurve(color, coords, dashes, weight = 4) {
    return L.polyline(turf.bezierSpline(turf.lineString(coords)).geometry.coordinates, { color: color, dashArray: dashes, weight: weight });
}

// first run
map_data_switch();

// replay functionality
const replay = {
    interval: null,
    timeout: null,
    toggle() {
        const year_select = document.getElementById('year');
        const day_select = document.getElementById('day');
        const button = document.querySelector('#replay');
        // stop if active
        if (this.interval || this.timeout) {
            clearInterval(this.interval);
            clearTimeout(this.timeout);
            this.interval = this.timeout = null;
            day_select.disabled = year_select.disabled = false;
            button.textContent = '🔁';
            day_select.selectedIndex = 0;
            update_map_image();
            return;
        }
        // start replay
        button.textContent = '⏹️';
        day_select.disabled = year_select.disabled = true;
        const days = years[year_select.value].days;
        let index = days.length - 1;
        const tick = () => {
            if (index >= 0) {
                day_select.selectedIndex = index--;
                update_map_image();
            } else {
                clearInterval(this.interval);
                this.interval = null;
                this.timeout = setTimeout(() => {
                    index = days.length - 1;
                    this.timeout = null;
                    this.interval = setInterval(tick, 500);
                }, 3000);
            }
        };
        tick();
        this.interval = setInterval(tick, 500);
    }
};
function toggle_replay() { replay.toggle(); }

// devtools
if (window.location.href.includes("file://")) {
    map.getContainer().style.cursor = 'crosshair';
    map.on('mousemove', function (e) {
        map.attributionControl.setPrefix(Math.round(e.latlng.lat) + ',' + Math.round(e.latlng.lng));
    });
    map.on('click', function (e) {
        navigator.clipboard.writeText('[' + Math.round(e.latlng.lat) + ',' + Math.round(e.latlng.lng) + ']');
    });
    var dev_linie_handle = L.marker([0, 0], { icon: L.icon({ iconUrl: "assets/fluentui-emoji/pushpin.webp", iconSize: [44, 44], iconAnchor: [3, 40] }), draggable: true }).addTo(map);
    var dev_linie_coords = [];
    var dev_linie_polygon = L.polygon(dev_linie_coords, { color: "#fff000" }).addTo(map);
    dev_linie_handle.on('dragend', function (e) {
        var dev_linie_latlng = dev_linie_handle.getLatLng();
        dev_linie_coords.push([Math.round(dev_linie_latlng.lat), Math.round(dev_linie_latlng.lng)]);
        dev_linie_polygon.setLatLngs(dev_linie_coords);
        console.log(JSON.stringify(dev_linie_coords));
    });
    var dev_kurve_handle = L.marker([0, 100], { icon: L.icon({ iconUrl: "assets/fluentui-emoji/alt_pushpin.webp", iconSize: [44, 44], iconAnchor: [3, 40] }), draggable: true }).addTo(map);
    var dev_kurve_coords = [];
    var dev_kurve_polygon = L.polygon(dev_kurve_coords, { color: "#ff00bb" }).addTo(map);
    dev_kurve_handle.on('dragend', function (e) {
        var dev_kurve_latlng = dev_kurve_handle.getLatLng();
        dev_kurve_coords.push([Math.round(dev_kurve_latlng.lat), Math.round(dev_kurve_latlng.lng)]);
        dev_kurve_polygon.setLatLngs(turf.bezierSpline(turf.lineString(dev_kurve_coords)).geometry.coordinates);
        console.log(JSON.stringify(dev_kurve_coords));
    });
    document.querySelector('.leaflet-image-layer').style.border = '1px dashed #ffffff55';
    /*// map size
    map.setMaxBounds([[-1500, -1500], [1500, 1500]]);
    map_image.setBounds(new L.LatLngBounds(
        map.unproject([-736, -696], 0),
        map.unproject([736, 696], 0)
    ));*/
}
