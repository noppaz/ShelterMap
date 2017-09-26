// ##############################################################
// ---------------------- Initialize stuff ----------------------
// ##############################################################

function initMap() {
	// Create the map element
	var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([18.00, 59.00]),
          zoom: 7
        })
      });

	// Add relevent controls
	addMousePosition(map);

	// Retrun the map
	return map;
}

// ##############################################################
// ---------------------- Controls ------------------------------
// ##############################################################

function addMousePosition(map) {
	var mousePosition = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4) ,
        projection: 'EPSG:4326',
        target: document.getElementById('mouseCoordinates'),
        undefinedHTML: '&nbsp;'
  });
  // Add the control to the map
  map.addControl(mousePosition);
}


// ##############################################################
// ---------------------- Database ------------------------------
// ##############################################################

function getQueryExtent(map) {
	var extent = map.getView().calculateExtent(map.getSize());
	console.log(map);
	console.log(extent);
	//console.log(map.getLayers());
	//console.log(map.getSource().getProjection());
	var markFeature = new ol.Feature({
  		geometry: new ol.geom.Point(ol.proj.transform([extent[0], extent[1]], 'EPSG:4326',     
  		'EPSG:3857'), 'Point')
	});

	map.getView().setCenter(ol.proj.transform([extent[0], extent[1]], 'EPSG:4326', 'EPSG:3857'));
	var markFeature = new ol.Feature({
  		geometry: new ol.geom.Point(ol.proj.transform([extent[2], extent[3]], 'EPSG:4326',     
  		'EPSG:3857'), 'Point')
	});

	for (var i = 0; i < extent.length; i++) {
		console.log(i);
		var markFeature = new ol.Feature({
      		geometry: new ol.geom.Point(ol.proj.transform([extent[i].long, extent[i].lat], 'EPSG:4326',     
      		'EPSG:3857')),
     		name: '1'
   		});

	}
	

}