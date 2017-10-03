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

// Query to get one kind of feature by kkod, this is then put in a separate OL vector layer
router.post('/api/getFeature', function(req, res) {
    var data = {kkod: req.body.kkod};
    var queryString = "SELECT gid, kkod, kategori, ROUND(AVG(grade), 2) AS rating, ST_AsText(geom) AS geometry FROM " +
    	"(SELECT sv_skydd.gid, kkod, kategori, geom, grade FROM sv_skydd LEFT JOIN reviews ON sv_skydd.gid = reviews.gid WHERE kkod = " + data.kkod +
    	") AS jn GROUP BY gid, kkod, kategori, geom;";

      apiClient.query(queryString)
        .then(function(results) {
            console.log(results.rows);

            if (results.rows.length == 0) res.end("incorrect");
            else res.json(results.rows);

        })
        .catch(e => console.error(e.stack));
});
