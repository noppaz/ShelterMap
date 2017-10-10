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

RATINGS = [
  '<i class="fa fa-paw" aria-hidden="true"></i>',
  '<i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"></i>',
  '<i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"></i>',
  '<i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"></i>',
  '<i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"> </i><i class="fa fa-paw" aria-hidden="true"></i>'
]

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

var LAYER_STYLE = [
STYLE_770,          // Kåta
STYLE_775,          // Vindskydd
STYLE_778,          // Campingplats
STYLE_780,          // Vindskydd, ej i anslutning till Vägkarteleder
STYLE_788,          // Rastplats, ej i anslutning till allmän väg
STYLE_9931,         // Fjällstation, hotell, pensionat
STYLE_9932,         // Turiststuga, övernattningsstuga
STYLE_9934,         // Rastskydd, raststuga
STYLE_9935          // Stugby
];



var LAYER_LIST = [];

// ##############################################################
// ---------------------- Initialize stuff ----------------------
// ##############################################################
var map;
var CURRENT_SELECTED_FEATURE;
var GEOLOCATION;

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
    initLayer(LAYERS[i], LAYER_STYLE[i]);
  }
  
	// Add relevent controls
	addMousePosition(map);


  map.on('singleclick', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        //you can add a condition on layer to restrict the listener
        return feature;
        });
    if (feature) {
      handlePointSelected(feature, false);
        //here you can add you code to display the coordinates or whatever you want to do
    }
  });

  //initGeoLocation();

	// Retrun the map
	return map;
}

function initLayer(kkod, style) {
   var request = $.ajax({
        url: "/api/getFeature",
        method: "POST",
        data: {kkod:kkod},
        cache: false
    });

  request.done(function(res) {
    var vectorSource = new ol.source.Vector({});
    var layerID = kkod;

    var vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: style
    });


    for (i = 0; i < res.length; i++) {
      // Location/geometry
      var wktGeometry = Terraformer.WKT.parse(res[i].geometry);
      var geometry = new ol.geom.Point(ol.proj.transform(wktGeometry.coordinates, 'EPSG:4326', 'EPSG:3857'));

      var feature = new ol.Feature({});
      feature.setStyle(style);
      feature.setGeometry(geometry);
      // Attributes
      feature.set('gid', res[i].gid);
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
  initSpatialSearchDiv();
  initFeatureInfoContainer();
}

function initGeoLocation() {

  // Map related styling
  // var locationVectorSource = new ol.source.Vector({});

  // var locationStyle = new ol.style.Style ({
  //   image: new ol.style.Circle({
  //     radius: 10,
  //     fill: new ol.style.Fill({
  //       color: 'rgba(0, 60, 136, 0.5)'
  //     }),
  //     stroke: new ol.style.Stroke({
  //       color: 'rgba(0, 60, 136, 0.7)',
  //       width: 2
  //     })
  //   })
  // });

  // var locationVectorLayer = new ol.layer.Vector({
  //   source: locationVectorSource,
  //   style: locationStyle
  // });

  // Init the geolocator
  GEOLOCATION = new ol.Geolocation({
    // take the projection to use from the map's view
    projection: map.getView().getProjection()
  });

  GEOLOCATION.setTracking(true);

  // GEOLOCATION.on('change', function(evt) {
  //   feature = new ol.geom.Circle(GEOLOCATION.getPosition(), 20);
  //   locationVectorSource.addFeature(feature);
  // });

  // map.addLayer(locationVectorLayer);
}



window.onresize = function() {
  setTimeout( function() { map.updateSize();}, 200);
}

// ##############################################################
// ---------------------- Interaction ---------------------------
// ##############################################################

function handlePointSelected(feature, centerOn) {
  var selectedStyle = new ol.style.Style ({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: 'rgba(0, 60, 136, 0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 60, 136, 0.7)',
        width: 3
      })
    })
  });

  if (CURRENT_SELECTED_FEATURE) {
    resetFeatureStyle(CURRENT_SELECTED_FEATURE);
  }

  feature.setStyle(selectedStyle);
  var featureInfoContainer = document.getElementById("featureInfoContainer");
  CURRENT_SELECTED_FEATURE = feature;

  if (centerOn) {
    map.getView().setCenter(feature.getGeometry().getCoordinates());
    map.getView().setZoom(11);
  }
  
  if (featureInfoContainer.style.display = 'none') {
    featureInfoContainer.style.display = 'block';
  }

  clearRatingUI();

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

function resetFeatureStyle(feature) {
  kkod = feature.R.kkod;
  i = findLayerNumber(kkod);
  feature.setStyle(LAYER_STYLE[i]);
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

function findLayerNumber(kkod) {
  for (i = 0; i < LAYERS.length; i++) {
    if (LAYERS[i] == kkod) {
      return i;
    }
  }
}

function getKKODfromLayerName(name) {
  for (i = 0; i < LAYER_NAMES.length; i++) {
    if (LAYER_NAMES[i] == name) {
      return LAYERS[i];
    }
  }

  return null
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
  var request = $.ajax({
      url: "/api/rateFeature",
      method: "POST",
      data: {gid:feature.R.gid, rating:rating},
      cache: false
  });
}

function spatialSearch(layer, rating, lat, lon) {
  rating = 4;
  kkod = getKKODfromLayerName(layer);

  var request = $.ajax({
      url: "/api/getClosestFeature",
      method: "POST",
      data: {coordlon:lon.toString(), coordlat:lat.toString(), kkod:kkod.toString(), grade:rating.toString()},
      cache: false
  });

  request.done(function(res) {
    layer = getLayerByID(res[0].kkod);
    var layerFeatures = layer.getSource().getFeatures();

    for (i = 0; i < layerFeatures.length; i++) {
      //console.log(i);
      if (res[0].gid == layerFeatures[i].R.gid) {

        handlePointSelected(layerFeatures[i], true);
        break;
      }
    }
  });
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