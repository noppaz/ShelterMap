var pg = require('pg');
var express = require('express');
var router = express.Router();
var credentials = require('../public/javascripts/dbcredentials/credentials.js');
var apiClient = new pg.Client(credentials);


apiClient.on('notice', function(msg) {
    console.log("notice: %j", msg);
});

apiClient.on('error', function(error) {
    console.log(error);
});

apiClient.connect(function(err){
    if (err){
        return console.error('could not connect to postgres', err);
    }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

module.exports = router;

// ##############################################################
// ------------------- API FUNCTIONS ----------------------------
// ##############################################################

router.post('/api/getFeature', function(req, res) {
    var data = {kkod: req.body.kkod};

    var query = apiClient.query("SELECT gid, kkod, kategori, ROUND(AVG(grade), 2) AS avg_grade, ST_AsText(geom) FROM " +
    	"(SELECT sv_skydd.gid, kkod, kategori, geom, grade FROM sv_skydd LEFT JOIN reviews ON sv_skydd.gid = reviews.gid WHERE kkod = " + data.kkod +
    	") AS jn GROUP BY gid, kkod, kategori, geom;");

    apiClient.query(queryString)
	    .then(function(results) {
	        console.log(results.rows);

	        if (results.rows.length == 0) res.end("incorrect");
	        else res.json(results.rows);

	    })
	    .catch(e => console.error(e.stack));
});

router.post('/api/getClosestFeature', function(req, res) {
	var data = {coordlon: req.body.coordlon, coordlat: req.body.coordlat, kkods: req.body.kkods, grade: req.body.grade, nullflag: req.body.nullflag};
	var nullflagOption = "";
	var kkodToShow = "";

	if (kkods.length == 1) {
		kkodToShow += kkods[0];
	} else {
		kkodToShow += kkods[0];
		for (int i = 1; i < kkods.length; i++) {
			kkodToShow += "OR kkod=" + ""
		}
	}

	if (nullflag){
		nullflagOption = " OR avg_grade IS NULL";
	}

    var queryString = "SELECT gid, kkod, kategori, avg_grade AS rating, ST_AsText(geom) AS geometry, ST_Distance(geom, ST_GeomFromText('POINT(" + coordlon + " " + coordlat + ")',4326), false)/1000 AS dist_km" +  
						"FROM (SELECT gid, kkod, kategori, ROUND(AVG(grade), 2) AS avg_grade, geom FROM" +
						      	"(SELECT sv_skydd.gid, kkod, kategori, geom, grade FROM sv_skydd" +
								"LEFT JOIN reviews ON sv_skydd.gid = reviews.gid WHERE kkod=" + kkod +") AS jn" +
						      "GROUP BY gid, kkod, kategori, geom) AS x" + 
						"WHERE avg_grade>" + grade + nullflagOption +
						"ORDER BY dist_km ASC LIMIT 1;"

    apiClient.query(queryString)
        .then(function(results) {
            console.log(results.rows);

            if (results.rows.length == 0) res.end("incorrect");
            else res.json(results.rows);

        })
        .catch(e => console.error(e.stack));
});