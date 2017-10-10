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

var POLYGON_LAYER_COLOR = [
'178, 102, 255',      // Naturreservat
'0, 204, 204',        // Nationalpark
]

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

for (i = 0; i < LAYER_COLOR.length; i++) {
  var style = new ol.style.Style ({
    image: new ol.style.Circle({
      radius: LAYER_SYMBOL_SIZE[i][0],
      fill: new ol.style.Fill({
        color: 'rgba(' + LAYER_COLOR[i] + LAYER_ALPHA[0]
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(' + LAYER_COLOR[i] + LAYER_ALPHA[1],
        width: LAYER_SYMBOL_SIZE[i][1]
      })
    })
  });

  LAYER_STYLE[i] = style;
}
