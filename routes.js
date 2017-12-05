//routes.js

var as    = require('async'); // 'async' is a reserved word now
//var tools = require('./tools.js');

module.exports = function(app, db)
{
    app.get('/', function(req, res)
    {
        if(req.user)
        {
            req.user.mail.reverse(); // display mail in reverse chronological order
            return res.status(200).render('homepage', {user : req.user});
        }
        else return res.status(200).render('login');
    });

    app.get('/help', function(req, res)
    {
        return res.status(200).sendfile("UserTutorial.htm");
    });
};

function requireLogin(req, res, next)
{
    if(!req.user) res.redirect('/');
    else next();
}
