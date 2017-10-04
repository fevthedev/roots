//main.js

const PORT = require('./config.js').portnumber;

// ### SETUP

var express    = require('express');         // HTTP/ routing/ web server
var mongodb    = require('mongodb');         // NoSQL database (JSON-like)
var bodyParser = require('body-parser');     // for parsing data from client
var session    = require('client-sessions'); // cookies/ user accounts
var fs         = require('fs');              // local file system (might not be necessary)
var as         = require('async');           // makes asynchronous code less of a pain
// var tools = require('./tools.js');

// secret key for encrypting cookies
const secretKey = "CGgnvg2$zc#!Kz2EVh8GZTkNpaxj!5HE";

// main app object
var app = express();

// app.engine('hbs', hbs.engine);
// app.set('view engine', 'hbs');
app.use(express.static(__dirname + "/resources")); // all resources in resources folder
app.use(bodyParser()); // so we can parse data from client using req.body



////////////////////////////////////////////////////////////////////////////
// This could become important if we have the database on another server  //
//                                                                        //
// var allowCrossDomain = function (req, res, next)                       //
// {                                                                      //
//     console.log("allowing...");                                        //
//     res.header('Access-Control-Allow-Origin ', '*');                   //
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); //
//     res.header('Access-Control-Allow-Headers', 'Content-Type');        //
//     next();                                                            //
// };                                                                     //
////////////////////////////////////////////////////////////////////////////


// ### MONGO INIT

var db = {};

mongodb.connect('mongodb://localhost:27017/roots', function(error, database)
{
    if(error)
    {
        console.log('Error connecting to MongoDB\n');
    }

    db.users = database.collection('users');
    db.login = database.collection('login');

    console.log("Connected to database");

    process.on('SIGTERM', function()
    {
        console.log("Shutting Roots server on port " + PORT + " down.");
        database.close();
        app.close();
    });
});

// ### COOKIES

app.use
(
    session
    ({
      cookieName: 'session',
      secret: secretKey,
      duration: 5 * 60 * 60 * 1000,      // 5 hours
      activeDuration: 1 * 60 * 60 * 1000 // 1 hour
    })
);

// ### MIDDLEWARE

app.use(function (req, res, next)
{
    // If there's a user logged in, find them in the database and set
    // req.user to them so we can access their info
    if (req.session && req.session.user)
    {
        db.users.findOne({email: req.session.user.email}, function(err, user)
        {
            if(user)
            {
                if(!user.cookie) // Make sure they actually have a cookie
                {
                    // keep cookie small by only using email
                    user.cookie =
                    {
                        email : user.email
                    };
                }

                req.user = user;
                req.session.user = user.cookie; // refresh
            }
        });
    }
    else next();
});

// Following code commented out; it's in api.js

// function requireLogin(req, res, next)
// {
//     if(!req.user) res.redirect('/');
//     else next();
// }

// ### ROUTES (exported)

require('./routes.js')(app, db);

// ### API (exported)

require('./api.js')(app, db);

// ### 404 AND LISTEN

// this is what will happen if someone tries to access a resource that doesn't exist (send HTTP 404)
app.use(function(req, res)
{
    res.status(404);
    // do something else...
});

// Start it up, output confirmation that we are listening on the port specified in config.js
var server = app.listen(PORT, function()
{
    console.log('Listening on port %d', server.address().port);
});
