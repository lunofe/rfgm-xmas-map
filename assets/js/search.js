// search functionality
let search_markers = [];

function collect_search_markers() {
    search_markers = [];
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
                search_markers.push({
                    name: layer.getPopup().getContent(),
                    layer: layer,
                    position: layer.getLatLng(),
                    category: category,
                    icon: layer.options.icon.options.iconUrl
                });
            }
        });
    });
}

function perform_search(query) {
    const results = document.getElementById('search_results');
    const filtered = query.trim()
        ? search_markers.filter(m => m.name.toLowerCase().replace(/<[^>]*>/g, ' ').includes(query.toLowerCase()))
        : search_markers;
    results.innerHTML = filtered.length ? filtered.map(r => `
        <div class="search_result_item" data-lat="${r.position.lat}" data-lng="${r.position.lng}">
            <img src="${r.icon}" class="search_result_icon" />
            <div class="search_result_text">
                <div class="search_result_name">${r.name.replace(/<br>/g, ' ')}</div>
                <div class="search_result_category">${r.category}</div>
            </div>
        </div>
    `).join('') : '<div class="search_no_results">Keine Ergebnisse gefunden</div>';
    results.classList.add('visible');
    results.querySelectorAll('.search_result_item').forEach(item => {
        item.onclick = () => {
            map.flyTo([item.dataset.lat, item.dataset.lng], 2, { duration: 1 });
            const marker = search_markers.find(m =>
                m.position.lat == item.dataset.lat && m.position.lng == item.dataset.lng
            );
            if (marker) setTimeout(() => marker.layer.openPopup(), 1000);
            results.classList.remove('visible');
            document.getElementById('search_input').value = '';
        };
    });
}

// setup search input handlers
const search_input = document.getElementById('search_input');
const update_search_width = () => requestAnimationFrame(() => {
    const w = document.querySelector('#control > :first-child').offsetWidth + 'px';
    search_input.style.width = w;
    document.getElementById('search_results').style.width = w;
});
update_search_width();
search_input.addEventListener('input', e => perform_search(e.target.value));
search_input.addEventListener('focus', () => perform_search(search_input.value));
search_input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const first_result = document.querySelector('.search_result_item');
        if (first_result) first_result.click();
    }
});
document.addEventListener('click', e => {
    if (!document.getElementById('control').contains(e.target)) {
        document.getElementById('search_results').classList.remove('visible');
    }
});
