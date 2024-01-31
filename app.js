//Connection to the database.
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
// mongoose.connect("mongodb://127.0.0.1:27017/NextTUsersDB");

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/public/forms.css"));

mongoose.connect(
  "mongodb+srv://Admin-Samuel:test1234@cluster0.7fp58pn.mongodb.net/Empdata"
);
//SCHEMA
const authSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  password: String,
});
//MODEL
const authModel = mongoose.model("authModel1", authSchema);

//HOME get ROUTE
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/src/Forms/Register.html");
});
//REGISTER get ROUTE
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/src/Forms/Register.html");
});
//REGISTER post ROUTE
app.post("/register", async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password === confirmPassword) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const userExist = await authModel.findOne(
      { fname: fname } && { lname: lname }
    );
    if (userExist) {
      //sending register form for details to be capture because that user already exist
      res.sendFile(__dirname + "/src/Forms/Register.html");
      console.log("That user already exist");
    } else {
      const regRequest = new authModel({
        fname: req.body.fname,
        lname: req.body.lname,
        password: req.body.password,
      });
      regRequest.save();
      console.log("New user added");
      res.sendFile(__dirname + "/views/Home.html");
      // res.redirect("/home");
    }
  } else {
    console.log("Password did not match. Try again");
  }
});
//LOGIN get ROUTE
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/src/forms/Login.html");
});

//LOGIN post ROUTE
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await authModel.findOne(
    { fname: username } || { lname: username }
  );
  if (user) {
    if (user.password === password) {
      res.sendFile(__dirname + "/views/Home.html");
    } else {
      res.send("You have entered wrong password. Try again");
    }
  } else {
    res.send("That user does not exist");
  }
});
const port = process.env.port;
app.listen(port || 3000, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("The serve is running on port 3000");
  }
});
