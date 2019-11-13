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
console.log(keyArray);
//console.log(student[(keyArray[0])]); // value
console.log('#####################################################');
console.log("Array length is "+keyArray.length);
console.log('#####################################################');
// for (var i=0; i<data.userContacts.values.length; i++){
//   console.log(data.userContacts.values[i].nameValuePairs.contactName,
//               data.userContacts.values[i].nameValuePairs.contactPhone)
// }
//console.log("Printing JSON");
//console.log(student.Blocks[0].Geometry);
getTabDataByTine(student,"MORNING");
getTabDataByTine(student,"MIDDAY");
getTabDataByTine(student,"EVENING");
getTabDataByTine(student,"BEDTIME");




      console.log('#####################################################');
      //console.log(student);

      console.log('This is after the read call');
    
  });
});


async function getTabDataByTine(student,text) {
  console.log("In function ");

  for (var i=0; i<student.Blocks.length; i++){
  
    if(student.Blocks[i].Text == text && student.Blocks[i].BlockType == "LINE"){
    console.log(text + " Text Found");
    //console.log(student.Blocks[i].Geometry.BoundingBox.Width);
    //console.log(student.Blocks[i].Geometry.BoundingBox.Height);
    //console.log(student.Blocks[i].Geometry.BoundingBox.Left);
    //console.log(student.Blocks[i].Geometry.BoundingBox.Top);
    if(text=="MORNING"){
    getTabletName(student,parseFloat(student.Blocks[i].Geometry.BoundingBox.Left),parseFloat(student.Blocks[i].Geometry.BoundingBox.Top),parseFloat(student.Blocks[i].Geometry.BoundingBox.Width),parseFloat(student.Blocks[i].Geometry.BoundingBox.Height));
    }
    getTablateCount(student,parseFloat(student.Blocks[i].Geometry.BoundingBox.Left),parseFloat(student.Blocks[i].Geometry.BoundingBox.Top),parseFloat(student.Blocks[i].Geometry.BoundingBox.Width),parseFloat(student.Blocks[i].Geometry.BoundingBox.Height));
  }
    // "Width": 0.07030297070741653,
    //         "Height": 0.03281624987721443,
    //         "Left": 0.24935415387153625,
    //         "Top": 0.3512013852596283
  }
}

async function getTabletName(in1,x,y,w,h) {
  //console.log("Calling abc"+in1+" input 2"+x);
  var tabName=null;
  for (var i=0; i<in1.Blocks.length; i++){
  
    if(parseFloat(in1.Blocks[i].Geometry.BoundingBox.Top)>(y-(h*8)) && parseFloat(in1.Blocks[i].Geometry.BoundingBox.Top) < y && parseFloat(in1.Blocks[i].Geometry.BoundingBox.Left) > x && parseFloat((in1.Blocks[i].Geometry.BoundingBox.Left)) < x+w && in1.Blocks[i].BlockType == "LINE"){
    //console.log("Tabate Text Found at ");
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Width);
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Height);
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Left);
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Top);
    //console.log(parseFloat(in1.Blocks[i].Geometry.BoundingBox.Top)>(y-(h*8)));
    //console.log(y-(h*8));
    //console.log(h);
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Top+(2*h));

    
    //console.log("Text is "+in1.Blocks[i].Text);
    if(tabName == null){
      tabName=in1.Blocks[i].Text;
    }else{
      tabName=tabName+" "+in1.Blocks[i].Text;

    }
  }

  // else{
  //   console.log(parseFloat(in1.Blocks[i].Geometry.BoundingBox.Top) < y);
  //   console.log("Not Matched Values "+parseFloat(in1.Blocks[i].Geometry.BoundingBox.Top) +" Y: "+ y)

  // }
    // "Width": 0.07030297070741653,
    //         "Height": 0.03281624987721443,
    //         "Left": 0.24935415387153625,
    //         "Top": 0.3512013852596283

    // "Text": "METFORMIN HCL",
    // "Geometry": {
    //   "BoundingBox": {
    //     "Width": 0.15186142921447754,
    //     "Height": 0.04188554733991623,
    //     "Left": 0.2548302412033081,
    //     "Top": 0.12238018959760666
    //   },

  }
  console.log("Tablet Name : "+tabName);

}
async function getTablateCount(in1,x,y,w,h){
  //console.log("Calling abc"+in1+" input 2"+x);
  var tabCnt="0";
  var avail = new Boolean(false);
  
  for (var i=0; i<in1.Blocks.length; i++){
var w1=parseFloat(in1.Blocks[i].Geometry.BoundingBox.Width);
var h1=parseFloat(in1.Blocks[i].Geometry.BoundingBox.Height);
var x1=parseFloat(in1.Blocks[i].Geometry.BoundingBox.Left);
var y1=parseFloat(in1.Blocks[i].Geometry.BoundingBox.Top);
var text=in1.Blocks[i].Text;

  // x1< (x+(w*2.5)) and x1 > (x+w)
  // y>Top
    if(x1< (x+(w*2.5)) && x1 > (x+w) && y1 < y && y1> y-(4*h) && in1.Blocks[i].BlockType == "LINE" && text!="TABLET"){
    //console.log("Tabate Text Found at ");
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Width);
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Height);
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Left);
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Top);
    //console.log(parseFloat(in1.Blocks[i].Geometry.BoundingBox.Top)>(y-(h*8)));
    //console.log(y-(h*8));
    //console.log(h);
    //console.log(in1.Blocks[i].Geometry.BoundingBox.Top+(2*h));

    avail=true;
    //console.log("Text is "+in1.Blocks[i].Text);
      tabCnt=in1.Blocks[i].Text;
    

  }

  }
  if(!avail){
    tabCnt=0;
  }
  console.log("Tablet Cnt : "+tabCnt);

}

module.exports = router;