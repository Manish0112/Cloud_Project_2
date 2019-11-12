//Added By Pankaj to process file and extract relevent information
const express = require('express');
const router = express.Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const keys = require("../config/keys");
const Files= require('../models/files');
const fs = require('fs');
const path = require('path');


 const storage = multer.memoryStorage();
 const upload = multer({storage: storage, limits: {fileSize: 10 * 1024 * 1024}}).single('myImage');


router.post('/', (req, res) => {

  upload(req, res, (err) => {
    // console.log('User is');
    // console.log(req.user);
    //File Process Started
    var startDate = new Date();
  
    //get user details 
      const email = "pankajhpatil21@gmail.com";
      const name = "admin";
  
      const file = req.file;
      //const filepath= path.resolve(file.path);
     // console.log(req.file);

      console.log("File Name is : "+req.file.originalname);
      console.log("File Path is : "+file);
      console.log(file);

      let student = JSON.parse(file.buffer);
      console.log('#####################################################');
      console.log("Pring JSON");
      console.log(student.Blocks.Geometry);
      
var keyArray = Object.keys(student); // key1
//console.log(student[(keyArray[0])]); // value
console.log("Array length is "+keyArray.length);
for (var i = 0; i < keyArray.length; i++) {
  var key = keyArray[i]; 
  var value = student[key];
  console.log(key, value);
  
  var keyArray1 = Object.keys(key); // key2
  //console.log(student[(keyArray[0])]); // value
  for (var j = 0; j < keyArray1.length; j++) {
    var key1 = keyArray1[j]; 
    var value1 = key[key1]; 
    console.log("************************************");
    console.log(key1, value1);
    console.log("************************************");

  }

}

      // fs.readFile(file.path, (err, data) => {
      //     if (err) {
      //       console.log("Error is : "+err);

      //      // console.log(err);
      //     }
      //    // console.log("sucess : "+data);
      //     let student = JSON.parse(data);
      //     console.log('#####################################################');
      //     console.log("Pring JSON");
      //     console.log(student.Blocks.Geometry);
      // });
      console.log('#####################################################');
      //console.log(student);

      console.log('This is after the read call');
    
  });
});

module.exports = router;