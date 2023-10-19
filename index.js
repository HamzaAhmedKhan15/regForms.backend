// import http from "http";
// import { generatednum } from "./feature.js";
// import fs from "fs";
// import path from "path";

// const home = fs.readFile("./index.html" , () =>{
//     console.log("Hamza Ahmed Khan")
// });

// console.log(path.extname("/home/random/index.js"))                   - for path checking

// const server = http.createServer((req, res) => {
//     console.log(req.method);

//   if (req.url === "/about") {
//     res.end(`<h1>Love is ${generatednum()}</h1>`);
//   } else if (req.url === "/") {
//     res.end("<h1>Home Page</h1>");
//   } else if (req.url === "/contactus") {
//     res.end("<h1>Contact Page</h1>");
//   } else {
//     res.end("<h1>No Page Found</h1>");
//   }
// });
//
// });

// server.listen(5000, () => {
//   console.log("Server is working");
// });

/////////////////////////////////////////////////// EXPRESSS JS  /////////////////////

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const server = express();

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected Succesfully! "))
  .catch((e) => console.log(e));

// Setting up view engine
server.set("view engine", "ejs");

// server.get("/form", (req, res) => {
  // res.send("Hi")

  // res.sendStatus(404)

  //   res.json({
  //     success: true,
  //     products: [],
  //   });
  // console.log(path.resolve());  -- to find path of current directoy
  // const pathlocation = path.resolve();
  // res.sendFile(path.join(pathlocation, "./index.html"));

//   res.render("index", { name: "Hamza" });
// });

/////////////////////////// MIDDLEWAREs ///////////////////////////////////////////
server.use(express.static(path.join(path.resolve(), "public")));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

/////////////////////////////////////////////////////////

const isAuthenticated = async(req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = jwt.verify(token, "abbadabbajabba");

    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};

server.get("/", isAuthenticated, (req, res) => {
  res.render("logout", {name: req.user.name });
});

server.get("/login",(req, res) => {
  res.render("login");
});

server.get("/register",(req, res) => {
  res.render("register");
});



server.post("/login", async (req, res) => {
  const {email, password} = req.body;
  
  let user = await User.findOne({email})

  if(!user) return res.redirect("/register");

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) return res.render("login", {email, message:"Incorrect Password"});

  const token = jwt.sign({ _id: user._id }, "abbadabbajabba"); // secret key

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");

});



server.post("/register", async (req, res) => {
  const { name, email,password } = req.body;

  let user = await User.findOne({email});
  if (user) return res.redirect("/login");

  const hashedPassword = await bcrypt.hash(password,10);


  user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ _id: user._id }, "abbadabbajabba"); // secret key

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});


server.get("/logout", (req, res) => {
  const token = req.cookies.token; // Retrieve the token from cookies

  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  if (token) {
    res.redirect("logout");
  } else {
    res.redirect("login");
  }
});

////////////////////// Creating Schema to send data in Database

// const registrationSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String
// });

// const Registration = mongoose.model('Registration', registrationSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// const users = [];   // random array to store registered users

// server.get ("/success",(req,res) => {
// res.render("success");                  // to redirect users to this page
// });

//////////////////////////// Sample to add data in database //////////////////////////////////
// server.get ("/add", async(req,res) => {
//   await Registration.create({name:"Hamza", email:"ha475128@gmail.com", password:"ironman",confirmPassword:"ironman"});
//   res.send("Done")
//   });

// server.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
//   await Registration.create({ name, email, password });
//   res.redirect("/success");
// });

server.listen(5000, () => {
  console.log("Server is working");
});
