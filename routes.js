//routes.js

// This file defines the routes used to access the application.
// Since everything happens at / or /help this file is very small

var as = require('async'); // 'async' is a reserved word now

module.exports = function(app, db)
{
    // Main route
    app.get('/', function(req, res)
    {
        // If theres a user logged in, send them the homepage, compiled with their info and mail
        if(req.user)
        {
            req.user.mail.reverse(); // display mail in reverse chronological order
            return res.status(200).render('homepage', {user : req.user});
        }
        // If no user is logged in, send the login page
        else return res.status(200).render('login');
    });

    // Separate route for help page
    app.get('/help', function(req, res)
    {
        return res.status(200).sendfile("UserTutorial.htm");
    });
};

// Currently unused, but if we had another route that was only accessible by logged-in users,
// we would use this piece of middleware to redirect unauthenticated requests to /
function requireLogin(req, res, next)
{
    if(!req.user) res.redirect('/');
    else next();
}
