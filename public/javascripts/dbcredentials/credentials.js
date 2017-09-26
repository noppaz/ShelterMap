var pg = require('pg');

var host ='localhost';
var port ='5432';
var dbName = 'spatial_database_lab3_database';

var connectionString = 'postgres://postgres:postgres@'+host+':'+port+'/'+dbName;


// Export the connection string for usage by the API
module.exports = connectionString;

var client = new pg.Client(connectionString);
client.connect();
