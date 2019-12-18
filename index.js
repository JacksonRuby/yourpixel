const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const getPixels = require("get-pixels");
const zeros = require("zeros");
const savePixels = require("save-pixels");

const mongoose = require('mongoose');
mongoose.set("useFindAndModify", false);
mongoose.connect('mongodb://localhost:27017/yourpixel', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const fileupload = require('express-fileupload');

var session = require('express-session');
process.env.PWD = process.cwd();

const Login = mongoose.model('Login', {
    username: String,
    password: String
});

const slugRegex = /^[a-zA-Z0-9\$-\.\+!\*'\(\)_)]+$/;

var myApp = express();
myApp.use(express.static(process.env.pwd + '/public'))
myApp.use(bodyParser.urlencoded({ extended:false}));
myApp.use(bodyParser.json())
myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs');
myApp.use(fileupload());
myApp.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));

//---------------- Routes ------------------

myApp.get('/',function(req, res){
    if (req.session.userLoggedIn) {
        res.render('index');
    } else {
        res.redirect('login');
    }
});

myApp.get('/login',function(req, res){
    res.render('login');
});

myApp.post('/login', [
    check('username', 'Please enter your username').not().isEmpty(),
    check('password', 'Please enter your password').not().isEmpty()
], function(req, res){
    var user = req.body.username;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var errorData = {
            errors: errors.array()
        };
        res.render('login', {errorData, user});
    } else {
        var pass = req.body.password;
        Login.findOne({username:user, password:pass}).exec(function(err, foundUser){
            if (err || foundUser == null) {
                var error = { msg: 'Username / password combination incorrect'};
                var errors = [];
                errors.push(error);
                var errorData = { errors: error };
                res.render('login', {errorData, user});
            } else {
                req.session.username = foundUser.username;
                req.session.userLoggedIn = true;
                req.session.save(function(err){});
                res.redirect('/');
            }
        });
    }
});

//----------- Start the server -------------------

myApp.listen(8080);
console.log('Server started at 8080 for yourpixel...');