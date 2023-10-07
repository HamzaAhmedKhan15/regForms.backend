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

const server = express();

mongoose.connect("mongodb://127.0.0.1:27017" , {
  dbName: "backend"
})
.then(()=> console.log("Database Connected Succesfully! "))
.catch((e)=> console.log(e));

server.get ("/",(req,res) => {

  // res.send("Hi")

  // res.sendStatus(404)   

//   res.json({
//     success: true,
//     products: [],
//   });
  // console.log(path.resolve());  -- to find path of current directoy
  // const pathlocation = path.resolve();
  // res.sendFile(path.join(pathlocation, "./index.html"));

  // Setting up view engine
  server.set("view engine", "ejs");
  res.render("index" , {name: "Hamza"});
});


// Creating Schema to send data in Database

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model('Registration', registrationSchema);



// const users = [];   // random array to store registered users

 // USING MIDDLEWARES 
server.use(express.static(path.join(path.resolve(), "public")));
server.use(express.urlencoded({extended:true}));

server.get ("/success",(req,res) => {
res.render("success");                  // to redirect users to this page
});


//////////////////////////// Sample to add data in database //////////////////////////////////
// server.get ("/add", async(req,res) => {
//   await Registration.create({name:"Hamza", email:"ha475128@gmail.com", password:"ironman",confirmPassword:"ironman"});
//   res.send("Done")            
//   });

server.post("/register", async (req,res) => {
  const { name, email, password} = req.body;
  await Registration.create({name, email, password });
  res.redirect("/success")
});

server.get ("/users",(req,res) => {
  res.json({
    users,
  });
});
  

server.listen(5000, () => {
    console.log("Server is working");
  });