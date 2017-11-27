//api.js

var as = require('async');
var ObjectID = require('mongodb').ObjectID;
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
                delete userData.userPasswordConfirm;

                // rename fields

                userData.username = userData.userName;
                userData.name     = userData.userFullName;
                userData.password = userData.userPassword;

                delete userData.userName;
                delete userData.userFullName;
                delete userData.userPassword;

                // initialize mail
                userData.mail     = [];

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
        function(err)
        {
            console.error(err);
            return res.status(500).send("Error creating your account");
        });
    });

    app.post('/ajax/upload-profile-picture', function(req, res)
    {
        db.profilePictures.insert(req.body.image, function(err, result)
        {
            db.users.update
            (
                {username: req.user.username},
                {$set: {profilePicture: result.insertedIds[0]}},
                function(){return res.status(200).send(null);}
            );
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

    app.post('/ajax/search-by-name', function(req, res)
    {
        var str = req.body.search;
        db.users.find({name: {$regex: str, $options: "i"}}).toArray(function(err, arr)
        {
            return res.status(200).send(arr.slice(0, 5));
        });
    });

    app.post('/ajax/send-mail', function(req, res)
    {
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

    //app.post("/ajax/delete-message", function(req, res)
    //{
    //    db.users.update({username: req.user.username}, {$pull: {mail: {message: "qwertuiop"}}}, {multi: true}, function(err, count, obj)
    //    {
    //        console.log();
    //    });
    //});

    app.get("/ajax/get-font-size", function(req, res)
    {
        db.users.findOne({username: req.user.username}, function(err, user)
        {
            return res.status(200).send(user.fontSize);
        });
    });

    app.post("/ajax/set-font-size", function(req, res)
    {
        db.users.update({username: req.user.username}, {$set: {fontSize: req.body.fontSize}}, function(err)
        {
            if(err) return res.status(500).send("Error " + err);

            return res.status(200).send(JSON.stringify({success: true}));
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

