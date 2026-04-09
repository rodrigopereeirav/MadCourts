let userMarker = null;
let canchasFavoritas = []

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
                                <div style="font-size:0.9em; color:#666; margin-bottom:12px;">
                                    📍 ${pista.DISTRITO || "Madrid"}<br>
                                    🏘️ ${pista.BARRIO || "N/A"}
                                </div>
                                <a href="${gmapsUrl}" target="_blank" class="btn-routing">🚗 CÓMO LLEGAR</a>
                                <button class="btn-fav" onclick="toggleFavorito('${nombreLugar.replace(/'/g, "\\'")}', this)"> 
                                ${canchasFavoritas.includes(nombreLugar) ? '⭐ Quitar Favorito' : '⭐ Marcar favorito'} 
                                </button>
                            </div>
                        `);
                }
            });
        }
    });
}

function buscarUbicacionUser() {
    if (!navigator.geolocation) {
        alert("Lo siento, tu navegador no soporta geolocalización");
              return;
        }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude; 

            map.flyTo([lat, lon], 16);

            map.once('moveend', () => {
            if (userMarker) {
                userMarker.setLatLng([lat,lon]);
            }
            else {
                userMarker = L.circleMarker([lat, lon], {
                    radius: 10,
                    fillColor: "#007bff",
                    color: "#fff",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map);
            }
           });
        },
        (error) => {
            console.warn("Error de ubicación:", error);
            alert("No hemos podido acceder a tu ubicación. Asegúrate de dar permiso en el navegador.");
        },
        { enableHighAccuracy: true }
        );
    }

// Funciones para el Modal de Perfil
function abrirEditor() {
    const modal = document.getElementById('modal-editor');
    modal.style.display = 'flex';

    // Rellenar el formulario con lo que ya hay en la tarjeta
    document.getElementById('input-name').value = document.getElementById('user-display-name').innerText;
    document.getElementById('input-username').value = document.getElementById('user-handle').innerText;
    document.getElementById('input-bio').value = document.getElementById('user-bio').innerText;
    document.getElementById('input-distrito').value = document.getElementById('val-distrito').innerText;
    document.getElementById('input-barrio').value = document.getElementById('val-barrio').innerText;
    document.getElementById('input-altura').value = parseInt(document.getElementById('val-altura').innerText) || "";
    document.getElementById('input-peso').value = parseInt(document.getElementById('val-peso').innerText) || "";
    document.getElementById('input-posicion').value = document.getElementById('val-posicion').innerText;
    document.getElementById('input-nivel').value = document.getElementById('val-nivel').innerText;
}

function cerrarEditor() {
    document.getElementById('modal-editor').style.display = 'none';
}

function guardarPerfil() {
    // 1. Capturar los nuevos valores
    const nuevoNombre = document.getElementById('input-name').value;
    const nuevoUser = document.getElementById('input-username').value;
    const nuevaBio = document.getElementById('input-bio').value;
    const nuevoDistrito = document.getElementById('input-distrito').value;
    const nuevoBarrio = document.getElementById('input-barrio').value;
    const nuevaAlt = document.getElementById('input-altura').value;
    const nuevoPeso = document.getElementById('input-peso').value;
    const nuevaPos = document.getElementById('input-posicion').value;
    const nuevoNivel = document.getElementById('input-nivel').value;

    // 2. Actualizar la tarjeta visualmente
    document.getElementById('user-display-name').innerText = nuevoNombre;
    document.getElementById('user-handle').innerText = nuevoUser.startsWith('@') ? nuevoUser : '@' + nuevoUser;
    document.getElementById('user-bio').innerText = `"${nuevaBio}"`;
    document.getElementById('val-distrito').innerText = nuevoDistrito || "Distrito";
    document.getElementById('val-barrio').innerText = nuevoBarrio || "Barrio";
    document.getElementById('val-altura').innerText = nuevaAlt + " cm";
    document.getElementById('val-peso').innerText = nuevoPeso + " kg";
    document.getElementById('val-posicion').innerText = nuevaPos;
    document.getElementById('val-nivel').innerText = nuevoNivel;


    // 3. Cerrar y avisar
    cerrarEditor();
    console.log("Perfil actualizado localmente");
}

function toggleFavorito(nombreCancha, elementoBoton) {
    console.log("Has marcado como favorita: " + nombreCancha);
    if (canchasFavoritas.includes(nombreCancha)) {
        canchasFavoritas.splice(canchasFavoritas.indexOf(nombreCancha), 1);
        alert("⭐ Cancha quitada de favoritos: " + nombreCancha);
        elementoBoton.innerText = "⭐ Marcar Favorito";
        }
    else {
        canchasFavoritas.push(nombreCancha);
        alert("⭐ Cancha añadida a favoritos: " + nombreCancha);
        elementoBoton.innerText = "⭐ Quitar Favorito";
    }    
    document.getElementById('cont-favoritos').innerText = canchasFavoritas.length;
}
        

// Ejecución inicial
cargarCanchas("data/canchas_basket_madrid.csv", "calle");
cargarCanchas("data/polideportivos_aptos_saneado.csv", "polis");
