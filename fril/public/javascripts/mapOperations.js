// ##############################################################
// ---------------------- GLOBALS -------------------------------
// ##############################################################

var LAYERS = [
  770,              // Kåta
  775,              // Vindskydd
  778,              // Campingplats
  780,              // Vindskydd, ej i anslutning till Vägkarteleder
  788,              // Rastplats, ej i anslutning till allmän väg
  9931,             // Fjällstation, hotell, pensionat
  9932,             // Turiststuga, övernattningsstuga
  9934,             // Rastskydd, raststuga
  9935,             // Stugby
  ];

var LAYER_COLORS = [
'255, 255, 255',    // Kåta
'255, 0, 255',      // Vindskydd
'45, 255, 0',       // Campingplats
'255, 255, 255',    // Vindskydd, ej i anslutning till Vägkarteleder
'255, 124, 123',    // Rastplats, ej i anslutning till allmän väg
'0, 255, 255',      // Fjällstation, hotell, pensionat
'78, 45, 34',       // Turiststuga, övernattningsstuga
'12, 255, 0',       // Rastskydd, raststuga
'56, 0, 255'        // Stugby
];

var LAYER_LIST = [];

// ##############################################################
// ---------------------- Initialize stuff ----------------------
// ##############################################################
var map;

function initMap() {
	// Create the map element
	map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          //"url" : "http://tile2.opencyclemap.org/transport/{z}/{x}/{y}.png"
        })
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([18.00, 59.00]),
      zoom: 7
    })
  });

  // Load data
  for (i = 0; i < LAYERS.length; i++) {
    initLayer(LAYERS[i], LAYER_COLORS[i]);
  }
  
	// Add relevent controls
	addMousePosition(map);
  map.on('singleclick', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        //you can add a condition on layer to restrict the listener
        return feature;
        });
    if (feature) {
      console.log(feature);
        //here you can add you code to display the coordinates or whatever you want to do
    }
  });

	// Retrun the map
	return map;
}

function initLayer(kkod, color) {
   var request = $.ajax({
        url: "/api/getFeature",
        method: "POST",
        data: {kkod:kkod},
        cache: false
    });

  request.done(function(res) {
    var vectorSource = new ol.source.Vector({});
    colorString1 = 'rgba(' + color + ', 0.5)';
    colorString2 = 'rgba(' + color + ', 0.8)';

    var vectorStyle = new ol.style.Style ({
      image: new ol.style.Circle({
        radius: 3,
        fill: new ol.style.Fill({
          color: colorString1
        }),
        stroke: new ol.style.Stroke({
          color: colorString2,
          width: 1
        })
      })
    });
    var layerID = kkod;

    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: vectorStyle
    });


    for (i = 0; i < res.length; i++) {
      // Location/geometry
      var wktGeometry = Terraformer.WKT.parse(res[i].geometry);
      var geometry = new ol.geom.Point(ol.proj.transform(wktGeometry.coordinates, 'EPSG:4326', 'EPSG:3857'));

      var feature = new ol.Feature({});
      //feature.setStyle(vectorStyle);
      feature.setGeometry(geometry);
      // Attributes
      feature.set('kategori', res[i].kategori);
      feature.set('rating', res[i].rating);
      feature.set('kkod', res[i].kkod);
      // add the feature to the source
      vectorSource.addFeature(feature);
    }
    map.addLayer(vectorLayer);
    LAYER_LIST[layerID] = vectorLayer;
    console.log(LAYER_LIST);

  });
}

function initUI() {
  initFilterDiv();
  var filterContainter = document.getElementById("filterContainer");
  var optionsContainter = document.getElementById("optionsContainer");
  var filterButton = document.createElement("button");
  filterButton.innerHTML = "X";
  filterButton.setAttribute("id", "filterButton");
  optionsContainter.appendChild(filterButton);

  filterButton.addEventListener ("click", function() {
    if (filterContainer.style.display == 'none') {
      filterContainer.style.display = 'block';
    } else {
      filterContainer.style.display = 'none';
    }
    
  });
}

// ##############################################################
// ---------------------------- UI ------------------------------
// ##############################################################

function initFilterDiv() {
  var optionsContainter = document.getElementById("optionsContainer");
  var filterContainer = document.createElement("div");
  filterContainer.id = "filterContainer";
  filterContainer.className = "container";
  optionsContainter.appendChild(filterContainer);
  filterContainer.style.display = 'none';

  // Create one checkbox for each layer
  for (i = 0; i < LAYERS.length; i++) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "name";
    checkbox.value = "value";
    checkbox.checked = true;
    checkbox.id = LAYERS[i].toString();

    // Display or hide layer associated with the checkbox
    checkbox.addEventListener( 'change', function() {
      layer = getLayerByID(this.id);
      if(this.checked) {
        layer.setVisible(true);
      } else {
        layer.setVisible(false);
      }
    });

    // Add a label next to the checkbox 
    var label = document.createElement('label')
    label.htmlFor = LAYERS[i].toString();
    label.appendChild(document.createTextNode("id" + LAYERS[i].toString()));

    filterContainer.appendChild(checkbox);
    filterContainer.appendChild(label);
  }
  return filterContainer;
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

function getLayerByID(id) {
  return LAYER_LIST[id];
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