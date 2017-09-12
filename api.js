//api.js

var as     = require('async');
var bcrypt = require('bcryptjs');
var tools  = require('./tools.js');

module.exports = function(app, db)
{
    app.get('/endpoint', function(req, res)
    {
        // do stuff
    });

    app.post('/another-endpoint', function(req, res)
    {
        // do stuff
    });
};
