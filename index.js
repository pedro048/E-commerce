const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

/*
const uriRead = process.env.MONGODB_URI_READ;

const uriWrite = process.env.MONGODB_URI_WRITE;

const conn1 = mongoose.createConnection(uriRead, {useNewUrlParser: true});
*/

const conn1 = mongoose.createConnection("mongodb+srv://pedroandrade046:Calmapedro2046@cluster0.z39fm.mongodb.net/usersDataDB", {useNewUrlParser: true});


//--------------------------------------------------------------------------------------------

const usersDataSchema = {
   username: String,
   gender: String,   
   birthdate: String,
   email: String,
   phone: Number
}

const UsersData = conn1.model('UsersData', usersDataSchema);

//---------------------------------------------------

const currentUserSchema = {
   username: String
}

const CurrentUser = conn1.model('CurrentUser', currentUserSchema);

var username;   
var birthdate; 
var email; 
var phone;

var logoutVisitor;
var currentUserLogInLogOut = "Visitor";
var successRegistryLogIn;
var failureLogIn;


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//-----------------------

app.post("/confirmed_account", function(req, res){
   username = req.body.username;
   gender = req.body.gender; 
   birthdate = req.body.birthdate;
   email = req.body.email;
   phone = req.body.phone;

   const userCreated = new UsersData({
      username: username.toString(),   
      gender: gender.toString(),
      birthdate: birthdate.toString(),
      email: email.toString(),
      phone: Number(phone)
   });
   
   userCreated.save();
   successRegistryLogIn = "Account created successfully!";
   res.redirect('/views/success.ejs');
   
   console.log("username: ", username);
   console.log("gender: ", gender);
   console.log("birthdate: ", birthdate);
   console.log("email: ", email);
   console.log("phone: ", phone);
});

//-----------------------

app.post("/confirmed_login", function(req, res){
   username = req.body.username1;

   UsersData.findOne({ username: username.toString() }, function(err, user) {
      if (err) {
        console.log(err);
        return;
      }
    
      if (user) {
         CurrentUser.findByIdAndUpdate("66ba5be1cb54b3ccf6947eaa", { username: username.toString() }, function(err){
            if (err){
               console.log(err);
            }
         });
      
         currentUserLogInLogOut = username.toString();
         console.log("Current User: ", currentUserLogInLogOut);
         successRegistryLogIn = "User logged successfully!"; 
         res.redirect('/views/success.ejs');
      } else {
         failureLogIn = "User not found!";
         console.log("User not found!");
         res.redirect('/views/failure.ejs');
      }
   });
});

//-----------------------

app.post("/confirmed_logout", function(req, res){

   logoutVisitor = req.body.logout;

   CurrentUser.findByIdAndUpdate("66ba5be1cb54b3ccf6947eaa", { username: logoutVisitor.toString() }, function(err){
      if (err){
         console.log(err);
      }
   });

   currentUserLogInLogOut = logoutVisitor.toString();
   console.log("Current User: ", currentUserLogInLogOut);

   res.redirect('/views/indeex.ejs');
});


function main(){

   app.use('/Images', express.static(__dirname + '/Images'));
   app.get("/", function(req, res){
      res.render("indeex", {homePageUsername: currentUserLogInLogOut});
   });
   app.get("/views/indeex.ejs", function(req, res){
      res.render("indeex", {homePageUsername: currentUserLogInLogOut}); 
   });
   app.get("/views/camisabasica.ejs", function(req, res){
      res.render("camisabasica", {homePageUsername: currentUserLogInLogOut});  
   });
   app.get("/views/registration.ejs", function(req, res){
      res.render("registration", {homePageUsername: currentUserLogInLogOut});  
   });
   app.get("/views/success.ejs", function(req, res){
      res.render("success", {homePageUsername: currentUserLogInLogOut, successRegistryLogIn: successRegistryLogIn});  
   });
   app.get("/views/failure.ejs", function(req, res){
      res.render("failure", {homePageUsername: currentUserLogInLogOut, failureLogIn: failureLogIn});  
   });
   app.get("/views/login.ejs", function(req, res){
      res.render("login", {homePageUsername: currentUserLogInLogOut});  
   });
}

// set an interval to update 2 times per second:
setInterval(main, 500);

//-----------------------

server.listen(3000, function(){   
  console.log("Server is running on port 3000");
});














