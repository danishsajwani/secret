require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');             // plugin for the schema to mass up data.

const app = express();

// console.log(process.env.SECRET)

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})      // encryptedFields allows encrypt and decode to password field

const User = mongoose.model("User", userSchema)

//TO Do
app.get("/", function(req, res){
  res.render("home")
})

app.get("/login", function(req, res){
  res.render("login")
})

app.get("/register", function(req, res){
  res.render("register")
})


app.post("/register", function(req, res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save(function(err){
    if (err) {
      console.log(err)
    } else {
      res.render("secrets")                       // secret page does not have app.get because it will only been display to the user if they sign up or sign in.
    }
  })
})

app.post("/login", function(req, res){
  const username = req.body.username
  const password = req.body.password

User.findOne({email: username}, function(err, foundUser){
  if (err) {
    console.log(err)
  } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        } else {
          res.send("User Not Found.")
        }
      }
  }
})


})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
