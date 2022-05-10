var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
const { dirname } = require("path");
const { links } = require("express/lib/response");
var app = express();

// Serve static files from the "public" directory
app.use(express.static("views"));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set("view engine","ejs");

// POST /login gets urlencoded bodies
app.post("/login", urlencodedParser, function(req, res) {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);
    res.send("welcome, " + req.body.name);
});

app.listen(8080, function() {
    console.log("Example app listening on port 8081!");
});

// connect to mongoose
var mongoose = require("mongoose");
var uri = "mongodb+srv://dbuser:demopass@cluster0-6tein.mongodb.net/mongoosedemos";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

db.on("error", function(){
    console.log("connection error!");
});
db.once("open", function(){
    console.log("connection to mongoose!");
});

const User = mongoose.model("User", {
    username: String,
    password: Number,
    birthday: Date
    });


//show all information in database in a table
app.get('/api/getall', function(req, res){
  User.find({},null,{limit:20}, function(err, results){
    //if err then return the fault code to browser
     if(err) {
      res.status(500).json("Fault in data search");
    } else {
      // Return the results as JSON-objects to browser
      res.status(200).json(results);
    }; 
  });
});

  app.get('/api/:id', function(req, res){
      var id = req.params.id;
    //find and show results
      User.findById(id, function (err, results) {
        if (err) {
         console.log(err);
         res.status(500).json("Fault in delete operation.");
      }
        else if (results == null) {
         res.status(200).json("Cannot be deleted as object cannot be found.");
      }
        else {
        console.log(results);
        res.status(200).json("found " + id + " " + results.username);
      }
    });
  });
  //add user
  app.put("/api/add", function(req, res) {
  
    res.send("Add user: " + req.params.username + " (" + req.params.birthday + ")");
  });

  app.put("/api/update/:id", function(req, res) {
      // find and update user information
    console.log("Modify user information by " + req.params.id);
    res.send("Modify user information by " + req.params.id);
  });

  app.delete("/api/delete/:id", function(req, res) {
    // Get the id for the delete operation
    var id = req.params.id;
    //test and if success, delete
    User.findByIdAndDelete(id, function (err, results) {
        if (err) {
         console.log(err);
         res.status(500).json("Error in delete operation.");
      }
        else if (results == null) {
         res.status(200).json("object " + id + " cannot be found and is not deleted");
      }
        else {
        console.log(results);
        res.status(200).json("Deleted " + id + " " + results.username);
      }
    });
  }); 