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

var LAYER_NAMES = [
  'Kåta',
  'Vindskydd',
  'Campingplats',
  'Vindskydd, fjällen',
  'Rastplats, avlägsen',
  'Fjällstation',
  'Övernattningsstuga',
  'Rastskydd',
  'Stugby'
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
var CURRENT_SELECTED_FEATURE;

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

    controls : ol.control.defaults({
        attribution : false
    }),

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
      handlePointClicked(feature);
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
      feature.set('n_rev', res[i].n_rev);
      feature.set('kkod', res[i].kkod);
      // add the feature to the source
      vectorSource.addFeature(feature);
    }
    map.addLayer(vectorLayer);
    LAYER_LIST[layerID] = vectorLayer;
  });
}

function initUI() {
  initFilterDiv();
  initFeatureInfoContainer();
}

window.onresize = function() {
  setTimeout( function() { map.updateSize();}, 200);
}

// ##############################################################
// ---------------------- Interaction ---------------------------
// ##############################################################

function handlePointClicked(feature) {
  var featureInfoContainer = document.getElementById("featureInfoContainer");
  CURRENT_SELECTED_FEATURE = feature;
  
  if (featureInfoContainer.style.display = 'none') {
    featureInfoContainer.style.display = 'block';
  }

  clearRating();

  var heading = featureInfoContainer.childNodes[0];
  var rating = featureInfoContainer.childNodes[1];
  // var desc = featureInfoContainer.childNodes[2];

  heading.innerHTML = feature.R.kategori;

  if (feature.R.rating == null) {
    rating.innerHTML = 'Not rated'
  } else {
    rating.innerHTML = (Math.round(feature.R.rating * 10 ) / 10) + '/5 [' + feature.R.n_rev + ']';
  }
}

function updateFeatureHTLM(new_rating, new_n) {
  var featureInfoContainer = document.getElementById("featureInfoContainer");
  var rating = featureInfoContainer.childNodes[1];
  rating.innerHTML = (Math.round(new_rating * 10 ) / 10) + '/5 [' + new_n + ']';
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
// ---------------------- Local api -----------------------------
// ##############################################################

function getLayerByID(id) {
  return LAYER_LIST[id];
} 


// ##############################################################
// ---------------------- Database ------------------------------
// ##############################################################

function rateFeature(feature, rating) {
  n = parseInt(feature.R.n_rev);
  old_rating = feature.R.rating;

  new_rating = (old_rating*n + rating)/(n + 1)
  feature.R.n_rev = n + 1;
  feature.R.rating = new_rating;

  updateFeatureHTLM(new_rating, n + 1)
}


// ##############################################################
// ---------------------- Not used ------------------------------
// ##############################################################

// function getQueryExtent(map) {
// 	var extent = map.getView().calculateExtent(map.getSize());
// 	console.log(map);
// 	console.log(extent);

// 	var markFeature = new ol.Feature({
//   		geometry: new ol.geom.Point(ol.proj.transform([extent[0], extent[1]], 'EPSG:4326',     
//   		'EPSG:3857'), 'Point')
// 	});

// 	map.getView().setCenter(ol.proj.transform([extent[0], extent[1]], 'EPSG:4326', 'EPSG:3857'));
// 	var markFeature = new ol.Feature({
//   		geometry: new ol.geom.Point(ol.proj.transform([extent[2], extent[3]], 'EPSG:4326',     
//   		'EPSG:3857'), 'Point')
// 	});

// 	for (var i = 0; i < extent.length; i++) {
// 		console.log(i);
// 		var markFeature = new ol.Feature({
//       		geometry: new ol.geom.Point(ol.proj.transform([extent[i].long, extent[i].lat], 'EPSG:4326',     
//       		'EPSG:3857')),
//      		name: '1'
//    		});

// 	}
// }