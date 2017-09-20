//api.js

var as     = require('async');
var bcrypt = require('bcryptjs');
//var tools  = require('./tools.js');

module.exports = function(app, db)
{
    app.post('/login', function(req, res)
    {
        db.login.findOne({email : req.body.email}, function(err, user)
        {
            if(err) return res.status(200).send("Error: " + err);

            // If we cant find a user with that email address...
            if(!user) return res.status(200).send("Invalid email or password");
            else
            {
                // check the password
                bcrypt.compare(req.body.password, user.passwordHash, function(err, match)
                {
                    if(err) return res.status(500).send("Error: " + err);

                    if(match)
                    {
                        req.session.user = user;
                        return res.status(200).send("SUCCESS");
                    }
                    else return res.status(200).send("Invalid email or password");
                });
            }
        });
    });

    app.get('/logout', function(req, res)
    {
        req.session.reset(); // log the user out by resetting the session
        res.redirect('/');   // redirect to /
    });

    app.post('/createuser', function(req, res)
    {
        // parse the data from the request body
        var userData = req.body;
        
        as.series
        ([
            function(callback)
            {
                // Make sure their email address isn't already registered
                db.login.findOne({email : userData.email}, function(err, result)
                {
                    if(result)
                    {
                        return res.status(200).send("email already registered");
                    }
                    else callback(null);
                });
            },
            function(callback)
            {
                // hash the password
                bcrypt.hash(userData.password, 1, function(err, hash)
                {
                    // add email/ password hash combination into login collection in db
                    db.login.insert({email : userData.email, passwordHash: hash}, function(err, result)
                    {
                        if(err) callback(err);
                    });
                });

                // remove password from user object, we don't want to store it anywhere
                delete userData.password;

                // add user to collection of users in db
                db.users.insert(userData, function(err, user)
                {
                    if(err) callback(err);

                    // log the new user in and return
                    req.session.user = user.ops[0];
                    return res.status(200).send(null);
                });
            }
        ],
        function(err)
        {
            console.error(err);
            return response.status(500).send("Error creating your account");
        });
    });

    app.get('/endpoint', function(req, res)
    {
        // do stuff
    });

    app.post('/another-endpoint', function(req, res)
    {
        // do stuff
    });
};
