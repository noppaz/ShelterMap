var LAYER_COLOR = [
'178, 102, 255',      // Kåta
'0, 204, 204',        // Vindskydd
'0, 255, 128',        // Campingplats
'0, 255, 255',        // Vindskydd, ej i anslutning till Vägkarteleder
'51, 131, 255',       // Rastplats, ej i anslutning till allmän väg
'255, 128, 0',        // Fjällstation, hotell, pensionat
'0, 255, 64',         // Turiststuga, övernattningsstuga
'204, 0, 204',        // Rastskydd, raststuga
'255, 0, 255'         // Stugby
];

var LAYER_SYMBOL_SIZE = [
[3, 1],             // Kåta
[3, 1],             // Vindskydd
[3, 1],             // Campingplats
[3, 1],             // Vindskydd, ej i anslutning till Vägkarteleder
[3, 1],             // Rastplats, ej i anslutning till allmän väg
[7, 3],             // Fjällstation, hotell, pensionat
[5, 2],             // Turiststuga, övernattningsstuga
[3, 1],             // Rastskydd, raststuga
[5, 2]              // Stugby
]

var LAYER_ALPHA = [
', 0.5)',
', 0.7)'
];


var STYLE_770 = new ol.style.Style ({
  image: new ol.style.Circle({
    radius: LAYER_SYMBOL_SIZE[0][0],
    fill: new ol.style.Fill({
      color: 'rgba(' + LAYER_COLOR[0] + LAYER_ALPHA[0]
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(' + LAYER_COLOR[0] + LAYER_ALPHA[1],
      width: LAYER_SYMBOL_SIZE[0][1]
    })
  })
});

var STYLE_775 = new ol.style.Style ({
  image: new ol.style.Circle({
    radius: LAYER_SYMBOL_SIZE[1][0],
    fill: new ol.style.Fill({
      color: 'rgba(' + LAYER_COLOR[1] + LAYER_ALPHA[0]
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(' + LAYER_COLOR[1] + LAYER_ALPHA[1],
      width: LAYER_SYMBOL_SIZE[1][1]
    })
  })
});

var STYLE_778 = new ol.style.Style ({
  image: new ol.style.Circle({
    radius: LAYER_SYMBOL_SIZE[2][0],
    fill: new ol.style.Fill({
      color: 'rgba(' + LAYER_COLOR[2] + LAYER_ALPHA[0]
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(' + LAYER_COLOR[2] + LAYER_ALPHA[1],
      width: LAYER_SYMBOL_SIZE[2][1]
    })
  })
});

var STYLE_780 = new ol.style.Style ({
  image: new ol.style.Circle({
    radius: LAYER_SYMBOL_SIZE[3][0],
    fill: new ol.style.Fill({
      color: 'rgba(' + LAYER_COLOR[3] + LAYER_ALPHA[0]
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(' + LAYER_COLOR[3] + LAYER_ALPHA[1],
      width: LAYER_SYMBOL_SIZE[3][1]
    })
  })
});

var STYLE_788 = new ol.style.Style ({
  image: new ol.style.Circle({
    radius: LAYER_SYMBOL_SIZE[4][0],
    fill: new ol.style.Fill({
      color: 'rgba(' + LAYER_COLOR[4] + LAYER_ALPHA[0]
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(' + LAYER_COLOR[4] + LAYER_ALPHA[1],
      width: LAYER_SYMBOL_SIZE[4][1]
    })
  })
});

var STYLE_9931 = new ol.style.Style ({
  image: new ol.style.Circle({
    radius: LAYER_SYMBOL_SIZE[5][0],
    fill: new ol.style.Fill({
      color: 'rgba(' + LAYER_COLOR[5] + LAYER_ALPHA[0]
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(' + LAYER_COLOR[5] + LAYER_ALPHA[1],
      width: LAYER_SYMBOL_SIZE[5][1]
    })
  })
});

var STYLE_9932 = new ol.style.Style ({
  image: new ol.style.Circle({
    radius: LAYER_SYMBOL_SIZE[6][0],
    fill: new ol.style.Fill({
      color: 'rgba(' + LAYER_COLOR[6] + LAYER_ALPHA[0]
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(' + LAYER_COLOR[6] + LAYER_ALPHA[1],
      width: LAYER_SYMBOL_SIZE[6][1]
    })
  })
});

var STYLE_9934 = new ol.style.Style ({
  image: new ol.style.Circle({
    radius: LAYER_SYMBOL_SIZE[7][0],
    fill: new ol.style.Fill({
      color: 'rgba(' + LAYER_COLOR[7] + LAYER_ALPHA[0]
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(' + LAYER_COLOR[7] + LAYER_ALPHA[1],
      width: LAYER_SYMBOL_SIZE[7][1]
    })
  })
});

var STYLE_9935 = new ol.style.Style ({
  image: new ol.style.Circle({
    radius: LAYER_SYMBOL_SIZE[8][0],
    fill: new ol.style.Fill({
      color: 'rgba(' + LAYER_COLOR[8] + LAYER_ALPHA[0]
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(' + LAYER_COLOR[8] + LAYER_ALPHA[1],
      width: LAYER_SYMBOL_SIZE[8][1]
    })
  })
});