//main.js

const PORT = require('./portnumber.js').portnumber;

// ### SETUP

// bcrypt is only required in routes.js (for now at least)
// var bcrypt     = require('bcryptjs');
var express    = require('express');
var mongodb    = require('mongodb');
var bodyParser = require('body-parser');
var session    = require('client-sessions');
var fs         = require('fs');
var as         = require('async'); // 'async' is a reserved word now
var tools = require('./tools.js');

// cookies
var secretKey = "somerandomstring";

var hbs = exphbs.create
({
    helpers:
    {
        sep: function()
        {
            return "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;";
        },
        // http://chrismontrois.net/2016/01/30/handlebars-switch/
        switch : function(value, options)
        {
            this._switch_value_ = value;
            var html = options.fn(this); // Process the body of the switch block
            delete this._switch_value_;
            return html;
        },
        case : function(value, options)
        {
            if (value == this._switch_value_)
                return options.fn(this);
        },
        // http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/#comment-44
        compare: function (lvalue, operator, rvalue, options)
        {
            var operators, result;

            if (arguments.length < 3)
            {
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
            }

            if (options === undefined)
            {
                options  = rvalue;
                rvalue   = operator;
                operator = "===";
            }

            operators =
            {
                '=='     : function (l, r) { return l == r; },
                '==='    : function (l, r) { return l === r; },
                '!='     : function (l, r) { return l != r; },
                '!=='    : function (l, r) { return l !== r; },
                '<'      : function (l, r) { return l < r; },
                '>'      : function (l, r) { return l > r; },
                '<='     : function (l, r) { return l <= r; },
                '>='     : function (l, r) { return l >= r; },
                'typeof' : function (l, r) { return typeof l == r; }
            };

            if (!operators[operator])
            {
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
            }

            result = operators[operator](lvalue, rvalue);

            if (result) {return options.fn(this);}
            else        {return options.inverse(this);}
        }
    },
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: ['views/partials/']
});

var app = express();

// app.engine('hbs', hbs.engine);
// app.set('view engine', 'hbs');
app.use(express.static(__dirname + "/resources"));
app.use(bodyParser());



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
    db.cards = database.collection('cards');
    db.login = database.collection('login');
    db.properties = database.collection('properties');

    console.log("Connected to database");

    process.on('SIGTERM', function()
    {
        console.log("Shutting Beacon Lane server on port " + PORT +" down.");
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
    if (req.session && req.session.user)
    {
        db.users.findOne({email: req.session.user.email}, function(err, user)
        {
            if(user)
            {
                if(!user.cookie)
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

// app.use(function(req, res)
// {
//     res.status(404).render('404');
// });

var server = app.listen(PORT, function()
{
    console.log('Listening on port %d', server.address().port);
});
