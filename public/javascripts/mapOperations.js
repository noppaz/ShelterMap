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

var POLYGON_LAYERS = [
0,
1];

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

var POLYGON_LAYER_NAMES = [
  'Naturreservat',
  'Nationalparker'
  ];


var LAYER_STYLE = [];
var POLYGON_LAYER_STYLE = [];
var LAYER_LIST = [];
var POLYGON_LIST = [];

RATINGS = [
  '1',
  '2',
  '3',
  '4',
  '5'
]

var LAN_LIST = [
'Skåne Län',
'Blekinge Län',
'Kalmar Län',
'Kronobergs Län',
'Hallands Län',
'Gotlands Län',
'Jönköpings Län',
'Östergötlands Län',
'Västra Götalands Län',
'Södermanlands Län',
'Örebro Län',
'Värmlands Län',
'Stockholms Län',
'Uppsala Län',
'Västmanlands Län',
'Dalarnas Län',
'Gävleborgs Län',
'Västernorrlands Län',
'Jämtlands Län',
'Västerbottens Län',
'Norrbottens Län'];

// ##############################################################
// ---------------------- Initialize stuff ----------------------
// ##############################################################
var map;
var CURRENT_SELECTED_FEATURE;
var geolocation;

function initMap() {
	// Create the map element
	map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibm9haGhvbG0iLCJhIjoiY2lrZWNmNDI2MDA0YnY4bHo3aXU1dGZkeSJ9.8Eavws7sLknJNwX_9YcEpw'
        })
      })
    ],
    controls : ol.control.defaults({
        attribution : false
    }),
    view: new ol.View({
      center: ol.proj.fromLonLat([18.00, 63.00]),
      zoom: 5
    })
  });

  // Load data
  for (i = 0; i < LAYERS.length; i++) {
    initLayer(LAYERS[i], LAYER_STYLE[i]);
  }
  // Load polygon data
  initPolygons(1, '', POLYGON_LAYER_STYLE[1]); // Loads nationalparker

  // Create naturreservat layer and store it
  var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({})//,
  });
  map.addLayer(vectorLayer);
  POLYGON_LIST[0] = vectorLayer;

  for (i = 0; i < LAN_LIST.length; i++) {
    // Loads naturreservat one län at a time
    initPolygons(0, LAN_LIST[i], POLYGON_LAYER_STYLE[0]);
  }
  
	// Add relevent controls
	addMousePosition(map);
  initGeoLocation();

  map.on('singleclick', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
      return feature;
    });
    if (feature) {
      if (feature.getGeometry().A.length < 3) {
        handlePointSelected(feature, false);
      } else {
        handlePolygonSelected(feature);
      } 
    }
  });

	// Return the map
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

function initPolygons(type, lan, style) {
  var request = $.ajax({
        url: "/api/getPolygons",
        method: "POST",
        data: {type:type, lan:lan},
        cache: false
    });

  request.done(function(res) {
    var vectorSource;
    // Type 0 == naturreservat
    if (type == 0) {
      vectorSource = POLYGON_LIST[0].getSource();
    // Type 1 == nationalparker
    } else {
      vectorSource = new ol.source.Vector({});

      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: style
      });

      map.addLayer(vectorLayer);
      POLYGON_LIST[1] = vectorLayer;
    }

    var resultRow;
    for (i = 0; i < res.length; i++) {
      resultRow = res[i];

      var coordinates = formatPolyCoords(resultRow.geometry);
      var geometry = new ol.geom.Polygon([coordinates]);
      geometry.transform('EPSG:4326', 'EPSG:3857');

      var feature = new ol.Feature({});
      feature.setGeometry(geometry);
      feature.setStyle(style);

      // Attributes
      feature.setId(resultRow.nvrid);
      feature.set('gid', resultRow.gid);
      feature.set('namn', resultRow.namn);
      feature.set('skyddstyp', resultRow.skyddstyp);
      feature.set('lan', resultRow.lan);
      feature.set('kommun', resultRow.kommun);

      vectorSource.addFeature(feature);
    }
  });
}

function initUI() {
  initFilterDiv();
  initPolygonFilterDiv();
  initSpatialSearchDiv();
  initFeatureInfoContainer();
  initPolygonInfoContainer();
}

function initGeoLocation() {
  geolocation = new ol.Geolocation({
    // take the projection to use from the map's view
    projection: map.getView().getProjection()
  });

  var accuracyFeature = new ol.Feature();
      geolocation.on('change:accuracyGeometry', function() {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
      });

  var positionFeature = new ol.Feature();
  positionFeature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#3399CC'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      })
    })
  }));

  geolocation.on('change:position', function() {
    var coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ?
      new ol.geom.Point(coordinates) : null);
  });

  // Init the geolocator
  geolocation.setTracking(true);

  new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: [accuracyFeature, positionFeature]
    })
  });
}

function formatPolyCoords (wktString) {
  // Formats WKT coordinates from database to desired format with projection for rendering
  var coordString = wktString.substring(9, wktString.indexOf(")"));
  var coordString2 = coordString.replace(/ /g, ',');
  var coordinates = coordString2.split(',');

  var coords2 = [];
  for (j = 0; j < coordinates.length; j += 2) {
    coords2.push([Number(coordinates[j]), Number(coordinates[j+1])]);
  }

  return coords2;
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
    if (CURRENT_SELECTED_FEATURE.getGeometry().A.length < 3) {
      resetFeatureStyle(CURRENT_SELECTED_FEATURE);
    } else {
      resetFeatureStylePolygon(CURRENT_SELECTED_FEATURE);
    }  
  }

  feature.setStyle(selectedStyle);
  var featureInfoContainer = document.getElementById("featureInfoContainer");
  CURRENT_SELECTED_FEATURE = feature;

  if (centerOn) {
    flyTo(feature.getGeometry().getCoordinates(), function() {})
  }

  if (featureInfoContainer.style.display == 'none') {
    hideInfoBoxElements();
    featureInfoContainer.style.display = 'block';
  }

  clearRatingUI();

  var heading = featureInfoContainer.childNodes[0];
  var rating = featureInfoContainer.childNodes[1];
  heading.innerHTML = feature.R.kategori;

  if (feature.R.rating == null) {
    rating.innerHTML = 'Not rated'
  } else {
    rating.innerHTML = (Math.round(feature.R.rating * 10 ) / 10) + '/5 [' + feature.R.n_rev + ']';
  }
}

function handlePolygonSelected(feature) {
  var selectedStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 120, 120, 0.7)',
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 120, 120, 0.5)'
    })
  });

  if (CURRENT_SELECTED_FEATURE) {
    if (CURRENT_SELECTED_FEATURE.getGeometry().A.length < 3) {
      resetFeatureStyle(CURRENT_SELECTED_FEATURE);
    } else {
      resetFeatureStylePolygon(CURRENT_SELECTED_FEATURE);
    }  
  }

  feature.setStyle(selectedStyle);
  var polygonInfoContainer = document.getElementById("polygonInfoContainer");
  CURRENT_SELECTED_FEATURE = feature;

  if (polygonInfoContainer.style.display == 'none') {
    hideInfoBoxElements();
    polygonInfoContainer.style.display = 'block';
  }

  var heading = polygonInfoContainer.childNodes[0];
  var type = polygonInfoContainer.childNodes[1];
  var desc = polygonInfoContainer.childNodes[2];

  heading.innerHTML = feature.R.namn;
  type.innerHTML = feature.R.skyddstyp;
}

function resetFeatureStyle(feature) {
  kkod = feature.R.kkod;
  i = findLayerNumber(kkod);
  feature.setStyle(LAYER_STYLE[i]);
}

function resetFeatureStylePolygon(feature) {
  if (feature.R.skyddstyp == 'Naturreservat') {
    var i = 0;
  } else {
    var i = 1;
  }
  feature.setStyle(POLYGON_LAYER_STYLE[i]);
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

function flyTo(location, done) {
  var view = map.getView();
  var duration = 3000;
  var initialZoom = view.getZoom();

  if (initialZoom > 7) {
    zoom = 7;
  } else {
    zoom = initialZoom - 1;
  }

  var finalZoom = 10;
  var parts = 2;
  var called = false;
  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      done(complete);
    }
  }
  view.animate({
    center: location,
    duration: duration
  }, callback);
  view.animate({
    zoom: zoom,
    duration: duration / 2
  }, {
    zoom: finalZoom,
    duration: duration / 2
  }, callback);
}

// ##############################################################
// ---------------------- Local api -----------------------------
// ##############################################################

function getLayerByID(id) {
  return LAYER_LIST[id];
}

function getPolygonLayerByID(id) {
  return POLYGON_LIST[id];
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
      if (res[0].gid == layerFeatures[i].R.gid) {
        handlePointSelected(layerFeatures[i], true);
        break;
      }
    }
  });
}