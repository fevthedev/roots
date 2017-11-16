//api.js

var as = require('async');
//var tools  = require('./tools.js');

module.exports = function(app, db)
{
    app.post('/hook', function(req, res)
    {
        console.log("\nWEBHOOK RECEIVED\n");
        require('child_process').spawn('git', ['pull']);
        return res.status(200).send("thanks!");
    });

    app.get('/ajax/get-posts', function(req, res)
    {
        db.posts.find().toArray(function(err, arr)
        {
            if(err) return res.status(500).send(err);

            return res.status(200).send(arr);
        });
    });

    app.post('/ajax/login', function(req, res)
    {
        db.users.findOne({username : req.body.usrLoginName}, function(err, user)
        {
            if(err) return res.status(200).send(JSON.stringify({error: "Invalid username or password"}));

            // If we cant find a user with that username/ password combo...
            if(!user || user.password != req.body.usrPass) return res.status(200).send((JSON.stringify({error: "Invalid username or password"})));
            else
            {
                delete user.password;
                req.session.user = user;
                return res.status(200).send(JSON.stringify("SUCCESS"));
            }
        });
    });

    app.get('/ajax/logout', function(req, res)
    {
        req.session.reset(); // log the user out by resetting the session
        res.redirect('/');   // redirect to /
    });

    app.post('/ajax/create-user', function(req, res)
    {
        // return res.status(200).send(req.body);

        // parse the data from the request body
        var userData = req.body;

        as.series
        ([
            function(callback)
            {
                // Make sure their username isn't already registered
                db.users.findOne({username : userData.userName}, function(err, result)
                {
                    if(result)
                    {
                        return res.status(200).send("username already registered");
                    }
                    else callback(null);
                });
            },
            function(callback)
            {
                // // add username/ password combination into login collection in db
                // db.login.insert({username : userData.username, password: userData.usrPass}, function(err, result)
                // {
                //     if(err) callback(err);
                // });

                // // remove password from user object, we don't want to store it anywhere
                // delete userData.usrPass;

                delete userData.userPasswordConfirm;

                // rename fields

                userData.username = userData.userName;
                userData.name     = userData.userFullName;
                userData.password = userData.userPassword;

                delete userData.userName;
                delete userData.userFullName;
                delete userData.userPassword;

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
            return res.status(500).send("Error creating your account");
        });
    });

    app.get('/ajax/user-messages', function(req, res)
    {
        return res.status(200).send(req.user.messages);
    });

    app.post('/ajax/new-post', function(req, res)
    {
        post = req.body;

        db.users.findOne({username : req.user.username}, function(err, result)
        {
            if(err)
            {
                return res.status(500).send("Sorry, an error occurred");
            }

            post.user = result.name;
            post.timestamp = new Date().getTime();

            db.posts.insert(post, function(err, result)
            {
                if(err)
                {
                    return res.status(500).send("Sorry, an error occurred");
                }

                return res.status(200).send(post);
            });
        });
    });

    app.post('/test/get-user-info', function(req, res)
    {
        db.login.findOne({username : req.user.username}, function(err, result)
        {
            if(err)
            {
                return res.status(500).send("Sorry, an error occurred");
            }

            return result;
        });
    });
};
