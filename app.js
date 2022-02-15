//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));



mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({   /* created from mongoose schema   */
  email:String,                             /*  mongoose-encryption - npm  basic  */
  passward:String,
});

//          /*  mongoose-encryption - npm    Secret String Instead of Two Keys (want to write secret into long String) */
userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["passward"]  });
 /* add encrypt package as plugin      encrypt our entire database */
// add this plugin to the schema before create mongoose model bcoz we are passing userSchema as a parameter to create new mongoose model.
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  const newUser = new User({
    email:req.body.username,
    passward: req.body.passward
  });
 newUser.save(function(err){
   if(err){
     console.log(err);
   }else{
     res.render("secrets");
   }
 });
});

app.post("/login", function(req,res){
  const username = req.body.username;
  const passward = req.body.passward;

  User.findOne({email:username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.passward === passward){
          res.render("secrets");
        }
      }
    }
  });
});



app.listen(3000, function(){
  console.log("server started at port 3000");
});
