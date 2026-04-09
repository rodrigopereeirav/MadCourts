function showSection(sectionId, event) {
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    if (sectionId === 'map-section') {
        setTimeout(() => { map.invalidateSize(); }, 100);
    }
}

function cargarCanchas(archivo, tipoCancha) {
    Papa.parse(archivo, {
        download: true, header: true, skipEmptyLines: true, delimiter: ";",
        complete: function(results) {
            results.data.forEach(function(pista) {
                let lat = superLimpieza(pista.LATITUD || pista.latitud, 'lat');
                let lon = superLimpieza(pista.LONGITUD || pista.longitud, 'lon');

                if (lat && lon && lat > 39.0 && lat < 41.5 && lon > -4.5 && lon < -3.0) {
                    let markerStyle = {
                        radius: tipoCancha === 'polis' ? 8 : 6,
                        fillColor: tipoCancha === 'polis' ? '#8c7f6b' : '#e65c00', 
                        color: "#fffdfa", weight: 2, opacity: 1, fillOpacity: 0.9
                    };
                    
                    let nombreLugar = (tipoCancha === "polis") 
                        ? (pista.NOMBRE || "Polideportivo Municipal")
                        : ((pista['CLASE-VIAL'] || "") + " " + (pista['NOMBRE-VIA'] || "Cancha Pública")).trim();
                    
                    const gmapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                    
                    L.circleMarker([lat, lon], markerStyle)
                        .addTo(tipoCancha === 'polis' ? capaPolis : capaCanchas)
                        .bindPopup(`
                            <div class="popup-header ${tipoCancha}">
                                ${tipoCancha === 'polis' ? '🏟️' : '🏀'} ${tipoCancha === 'polis' ? 'Polideportivo' : 'Cancha Calle'}
                            </div>
                            <div class="popup-body">
                                <b style="display:block; margin-bottom:10px;">${nombreLugar}</b>
                                <div style="font-size:0.9em; color:#666;">
                                    📍 ${pista.DISTRITO || "Madrid"}<br>
                                    🏘️ ${pista.BARRIO || "N/A"}
                                </div>
                                <a href="${gmapsUrl}" target="_blank" class="btn-routing">🚗 CÓMO LLEGAR</a>
                            </div>
                        `);
                }
            });
        }
    });
}

// Ejecución inicial
cargarCanchas("data/canchas_basket_madrid.csv", "calle");
cargarCanchas("data/polideportivos_aptos_saneado.csv", "polis");
