// Inicialización del mapa
var map = L.map('map', { 
    minZoom: 10, maxZoom: 18, closePopupOnClick: true, zoomControl: false 
}).setView([40.4167, -3.7037], 12);

L.control.zoom({ position: 'topleft' }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CARTO'
}).addTo(map);

// Capas de datos
var capaCanchas = L.layerGroup().addTo(map);
var capaPolis = L.layerGroup().addTo(map);
var capaFavoritos = L.layerGroup();

// Selector de capas
var selectores = {
    "<span style='color: #e65c00; font-weight: bold;'>🏀 Canchas Calle</span>": capaCanchas,
    "<span style='color: #8c7f6b; font-weight: bold;'>🏟️ Polideportivos</span>": capaPolis,
    "<span style='color: #FFB300; font-weight: bold;'>⭐ Favoritas</span>": capaFavoritos
};

L.control.layers(null, selectores, { collapsed: true }).addTo(map);
