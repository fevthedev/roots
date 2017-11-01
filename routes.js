//routes.js

var as    = require('async'); // 'async' is a reserved word now
//var tools = require('./tools.js');

module.exports = function(app, db)
{
    app.get('/', function(req, res)
    {
        console.log("rendering index.html");
        if(req.user) return res.status(200).render('homepage', {user : req.user});
        else         return res.status(200).render('login');
    });
};

function requireLogin(req, res, next)
{
    if(!req.user) res.redirect('/');
    else next();
}
