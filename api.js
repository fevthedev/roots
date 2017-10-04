//api.js

var as     = require('async');
//var tools  = require('./tools.js');

module.exports = function(app, db)
{
    app.post('hook', function(req, res)
    {
        require('child_process').spawn('git', ['pull']);
    });

    app.post('ajax/login', function(req, res)
    {
        db.login.findOne({email : req.body.usrEmail}, function(err, user)
        {
            if(err) return res.status(200).send("Error: " + err);

            // If we cant find a user with that email address...
            if(!user || user.password != usrPass) return res.status(200).send("Invalid email or password");
            else return res.status(200).send("SUCCESS");
        });
    });

    app.get('ajax/logout', function(req, res)
    {
        req.session.reset(); // log the user out by resetting the session
        res.redirect('/');   // redirect to /
    });

    app.post('ajax/create-user', function(req, res)
    {
        // parse the data from the request body
        var userData = req.body;

        as.series
        ([
            function(callback)
            {
                // Make sure their email address isn't already registered
                db.login.findOne({email : userData.usrEmail}, function(err, result)
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
                // add email/ password combination into login collection in db
                db.login.insert({email : userData.email, password: userData.usrPass}, function(err, result)
                {
                    if(err) callback(err);
                });

                // remove password from user object, we don't want to store it anywhere
                delete userData.usrPass;

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
