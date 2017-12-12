//api.js

// This file is the guts of the application server.
// The client sends ajax requests here, and we operate on the database and/or
// send data back to the client.

var as = require('async');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db)
{
    // Sends all the posts to the client
    app.get('/ajax/get-posts', function(req, res)
    {
        db.posts.find().toArray(function(err, arr)
        {
            if(err) return res.status(500).send(err);

            return res.status(200).send(arr);
        });
    });

    // Logs a user in
    app.post('/ajax/login', function(req, res)
    {
        db.users.findOne({username : req.body.usrLoginName}, function(err, user)
        {
            if(err) return res.status(200).send(JSON.stringify({error: "Invalid username or password"}));

            // If we cant find a user with that username/ password combo...
            if(!user || user.password != req.body.usrPass) return res.status(200).send((JSON.stringify({error: "Invalid username or password"})));
            else
            {
                // Remove the password field from the object
                delete user.password;
                req.session.user = user;
                return res.status(200).send(JSON.stringify("SUCCESS"));
            }
        });
    });

    // Log the user out by restting the session
    app.get('/ajax/logout', function(req, res)
    {
        req.session.reset(); // log the user out by resetting the session
        res.redirect('/');   // redirect to /
    });

    // Create a new user wth provided information
    app.post('/ajax/create-user', function(req, res)
    {
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
                        return res.status(400).send("username already registered");
                    }
                    else callback(null);
                });
            },
            function(callback)
            {
                delete userData.userPasswordConfirm;

                // rename fields

                userData.username = userData.userName;
                userData.name     = userData.userFullName;
                userData.password = userData.userPassword;

                delete userData.userName;
                delete userData.userFullName;
                delete userData.userPassword;

                // initialize mail
                userData.mail = [];

                // add user to collection of users in db
                db.users.insert(userData, function(err, user)
                {
                    if(err) callback(err);

                    // log the new user in and return
                    req.session.user = user.ops[0];
                    return res.status(200).send("SUCCESS");
                });
            }
        ],
        function(err) // this callback is only fired on error, so assume there is one
        {
            console.error(err);
            return res.status(500).send("Error creating your account");
        });
    });

    // Returns the user's messages
    app.get('/ajax/user-messages', function(req, res)
    {
        return res.status(200).send(req.user.messages);
    });

    // Add a new post
    app.post('/ajax/new-post', function(req, res)
    {
        // Parse the object
        post = req.body;

        // Add the post with the user's info
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

    // Search users for names matching given regex
    app.post('/ajax/search-by-name', function(req, res)
    {
        var str = req.body.search;
        db.users.find({name: {$regex: str, $options: "i"}}).toArray(function(err, arr)
        {
            return res.status(200).send(arr.slice(0, 5));
        });
    });

    // Send mail to another user
    app.post('/ajax/send-mail', function(req, res)
    {
        // Create the mnessage object
        var message =
        {
            sender :
            {
                name: req.user.name,
                id  : req.user._id
            },
            timestamp : new Date().getTime(),
            message   : req.body.messageText,
            id        : new ObjectID()
        };

        db.users.update({_id: ObjectID(req.body.recipientUserID)}, {$push: {mail: message}}, null);
        return res.status(200).send(null);
    });

    // Get the font size associated with the current user
    app.get("/ajax/get-font-size", function(req, res)
    {
        db.users.findOne({username: req.user.username}, function(err, user)
        {
            return res.status(200).send(user.fontSize);
        });
    });

    // Set the user's preferred font size
    app.post("/ajax/set-font-size", function(req, res)
    {
        db.users.update({username: req.user.username}, {$set: {fontSize: req.body.fontSize}}, function(err)
        {
            if(err) return res.status(500).send("Error " + err);

            return res.status(200).send(JSON.stringify({success: true}));
        });
    });
};

