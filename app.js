//jshint esversion:6

/////////////////////////////////// Starting code ///////////////////////////////////
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');


/////////////////////////////////// Mongo Schema //////////////////////////////////
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


/////////////////////////////////// Mongo Encryption //////////////////////////////////
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


/////////////////////////////// Creating Mongoose Model ///////////////////////////////
const User = new mongoose.model("User", userSchema);


//////////// app route ///////////////
app.route("/")

.get(function(req,res){
    res.render("home");
});


/////////// register route ///////////
app.route("/register")

.get(function(req, res){
    
    res.render("register");

})

.post(function(req, res){

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

});


//////////// login route ////////////
app.route("/login")

.get(function(req, res){
    
    res.render("login");

})

.post(function(req, res){
    
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundInfo){

        if (foundInfo.password === password) {
            res.render("secrets");
        } else if (err) {
            console.log(err);
        } else {
            console.log("Wrong password");
        }

    })

});


/////////////////////////////////// Post Listening ///////////////////////////////////
app.listen(3000, function() {
    console.log("Server started on post 3000.");
});