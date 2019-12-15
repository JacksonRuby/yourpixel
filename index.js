const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const getPixels = require("get-pixels");
const zeros = require("zeros");
const savePixels = require("save-pixels");

const mongoose = require('mongoose');
mongoose.set("useFindAndModify", false);
mongoose.connect('mongodb://localhost:27017/CMS', {
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
    
});

//----------- Start the server -------------------

myApp.listen(8080);
console.log('Server started at 8080 for CMS...');