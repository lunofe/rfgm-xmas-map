// define years
const years = {
    "2025": gipfelbach,
    "2024": lichtertal,
    "2023": tannberg
};

function map_data_switch() {
    // clear previous control and layers
    if (layer_toggle) map.removeControl(layer_toggle);
    map.eachLayer(layer => {
        // don't remove image overlays or devtool markers
        if (!(layer instanceof L.ImageOverlay) && !layer.options.isDevtool) {
            map.removeLayer(layer);
        }
    });
    // get user input
    const data = years[document.getElementById('year').value];
    // update map bounds based on mapSize
    map.setMaxBounds([[-data.mapSize, -data.mapSize], [data.mapSize, data.mapSize]]);
    bounds = new L.LatLngBounds(
        map.unproject([-data.mapSize / 2, -data.mapSize / 2], 0),
        map.unproject([data.mapSize / 2, data.mapSize / 2], 0)
    );
    map_image.setBounds(bounds);
    // add layers and control
    data.layers.forEach(layer => layer.addTo(map));
    layer_toggle = data.layers[0].addTo(map);
    // update available days dropdown
    document.getElementById('day').innerHTML = data.days.map(day =>
        `<option value="${day}">${day}</option>`
    ).join('');
    // apply
    update_map_image();
    collect_search_markers();
    document.getElementById('search_results').classList.remove('visible');
}

// update map image
function update_map_image() {
    // switch image source based on user input
    map_image.setUrl("assets/map/" + document.getElementById('year').value + "/" + document.getElementById('day').value + "webp");
}

// replay functionality
let replay_interval = null;
let replay_timeout = null;

function toggle_replay() {
    const year_select = document.getElementById('year');
    const day_select = document.getElementById('day');
    const button = document.querySelector('#replay');
    // stop if active
    if (replay_interval || replay_timeout) {
        clearInterval(replay_interval);
        clearTimeout(replay_timeout);
        replay_interval = replay_timeout = null;
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
            clearInterval(replay_interval);
            replay_interval = null;
            replay_timeout = setTimeout(() => {
                index = days.length - 1;
                replay_timeout = null;
                replay_interval = setInterval(tick, 500);
            }, 3000);
        }
    };
    tick();
    replay_interval = setInterval(tick, 500);
}
