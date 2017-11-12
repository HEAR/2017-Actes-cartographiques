mapboxgl.accessToken = 'pk.eyJ1IjoibG9oaWMiLCJhIjoiY2lpNzhvcm13MDA3NndmbTNwbGwzcWlhaiJ9.7bOyxk8_-QXHITF3KnDKKg';

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/lohic/cj9wxfo9666lh2snzramlhjag'
});


/******************** COUCHES **********************/

map.on('load', function () {

	var layers = map.getStyle().layers;
	// Find the index of the first symbol layer in the map style
	var firstSymbolId;
	for (var i = 0; i < layers.length; i++) {
		if (layers[i].type === 'symbol') {
			firstSymbolId = layers[i].id;
			break;
		}
	}
	
	// oncharge des données stockées dans un document externe
	map.addSource('informations', {
		type: 'geojson',
		data: 'assets/data/map.geojson'
	});




	// on ajoute des couches en fonction des contenus
	// ici des zones géométriques
	map.addLayer({
		"id": "zone", // c'est moi qui nomme
		"type": "fill",
		"source": "informations", // pointe vers les données chargées ligne 60
		'layout': {
			'visibility': 'visible'
		},
		"paint": {
			"fill-color": "#F00",
			"fill-opacity": 0.4
		},
		"filter": ["==", "$type", "Polygon"]
	}, firstSymbolId);




	// ici des points
	map.addLayer({
		"id": "icone", // c'est moi qui nomme
		"type": "circle",
		"source": "informations", // pointe vers les données chargées ligne 60
		'layout': {
			'visibility': 'visible'
		},
		"paint": {
			"circle-radius": {
				'base': 1.75,
				'stops': [[12, 2], [22, 180]]
			},
			"circle-color": {
				property: 'type',
				type: 'categorical',
				stops: [
					['monument', '#f00'],
					['enseignement', '#0f0']]
			}
		},
		"filter": ["==", "$type", "Point"],
	});



	// POUR AJOUTER UN CLIC SUR UNE INFORMATION
	map.on('click', 'icone', function (e) {
		new mapboxgl.Popup()
		.setLngLat(e.lngLat)
		.setHTML(e.features[0].properties.titre+'<br><a target="_blank" url="'+e.features[0].properties.url+'">'+e.features[0].properties.url+"</a>")
		.addTo(map);
	});


	// Change the cursor to a pointer when the mouse is over the states layer.
	map.on('mouseenter', 'icone', function () {
		map.getCanvas().style.cursor = 'pointer';
	});


	// Change it back to a pointer when it leaves.
	map.on('mouseleave', 'icone', function () {
		map.getCanvas().style.cursor = '';
	});

});




/******************** MENU **********************/

// pour générer le menu avec les couches
var couches_informations = [ 'zone', 'icone' ];

for (var i = 0; i < couches_informations.length; i++) {
	var id = couches_informations[i];

	var link = document.createElement('a');
	link.href = '#';
	link.className = 'active';
	link.textContent = id;

	link.onclick = function (e) {
		var clickedLayer = this.textContent;
		e.preventDefault();
		e.stopPropagation();

		var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

		if (visibility === 'visible') {
			map.setLayoutProperty(clickedLayer, 'visibility', 'none');
			this.className = '';
		} else {
			this.className = 'active';
			map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
		}
	};

	var layers = document.getElementById('menu');
	layers.appendChild(link);
}