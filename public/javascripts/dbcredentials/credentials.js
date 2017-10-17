var pg = require('pg');

var host ='webgis.lemni.se';
var port ='5432';
var dbName = 'gisdb';

var connectionString = 'postgres://postgres:postgres@'+ host + ':' + port + '/' + dbName + '?ssl=true';

// Export the connection string for usage by the API
module.exports = connectionString;

var client = new pg.Client(connectionString);
client.connect();
