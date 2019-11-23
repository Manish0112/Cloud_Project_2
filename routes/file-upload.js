const express = require('express');
const router = express.Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const keys = require("../config/keys");
const Files= require('./../models/files');

 const storage = multer.memoryStorage();
 const upload = multer({storage: storage, limits: {fileSize: 10 * 1024 * 1024}}).single('myPrescription');
 var qtyfound=new Boolean("false");
 var expiryfound=new Boolean("false");
 var startfound=new Boolean("false");
 var docfound=new Boolean("false");

var qty=0;
var expiryDate=new String("");
var startDate=new String("");
var docName=new String("");
var tabletName=new String("");
var morningTabCnt=0;
var middayTabCnt=0;
var eveTabCnt=0;
var bedtimeTabCnt=0;



router.post('/', (req, res) => {

  upload(req, res, (err) => {
    
    const moment = require('moment');    
    //File Upload started
    var startDate = new Date();
  
    //get user details 
//      const email = req.user.email;
//      const name = req.user.name;
       //get user details 
       const email = "pankajhpatil21@gmail.com";
       const name = "admin";
 
  
      const file = req.file;

      if(!file){
        req.flash('error_msg','Please select a file');
        res.redirect('/dashboard');
      }
      else{



      //for s3 bucket
      const s3FileURL = 'https://manish-dropbox.s3.us-east-2.amazonaws.com';

      console.log('Start Bucket');
      let s3bucket = new AWS.S3({
          accessKeyId: keys.AwsAccessKeyId,
          secretAccessKey: keys.AwsSecretAccessKey,
          region: keys.region,
          s3BucketEndpoint: false,
          endpoint: 's3.amazonaws.com',
          port: 443
      });

      var myFileName = file.fieldname+('-')+Date.now();
      //for s3 bucket
      var s3params = {
          Bucket: 'manish-dropbox',
          Key: myFileName,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read"
      };
      s3bucket.upload(s3params, function (err, data) {
        
        if (err) {
            console.log(err);
            //res.status(500).json({error: true, Message: err});
        } else {
            //success
            req.flash('success_msg','File Uploaded!');
            res.redirect('/dashboard');

            //updating in dyanamodb

            var endDate   = new Date();

            //dynamoDb
            
            var input = {
              'email': email, 'createdDate': Date.now(), 'fileDesc': file.originalname, 'fileName': myFileName,
              'fileUrl': data.Location, 'modifiedDate': Date.now(), 'name': name , 'uploadTime' : ((endDate - startDate) / 1000)
            };
            

            const dynamoDbObj = require('./../models/connect');

            var paramsDb = {
                TableName: "files",
                Item:  input
            };

            dynamoDbObj.put(paramsDb, function (err, data) {
                
                if (err) {
                    console.log(err);
                } else {
                    console.log('File uploaded');
                }
            });

            //mongo
            const newFile = new Files({
              user : name,
              email : email,
              fileUrl:data.Location,
              fileName: myFileName,
              fileDesc: file.originalname,
              uploadTime: ((endDate - startDate) / 1000),
              modifiedDate: ((endDate - startDate) / 1000)
            });
            //check if already exisits
            Files.findOne({ fileName:file.originalname })
            .then( (fileName) => {

                newFile.save()
                .then(file => {
                  console.log('File Uploaded');
              })
              .catch(err=>console.log(err));
            });

        }
      });
      }
      AWS.config.update ({
        region: 'us-east-2',
        //accessKeyId: keys.AWS_ACCESS_KEY_ID,
        //secretAccessKey: keys.AWS_SECRET_ACCESS_KEY ,
        endpoint : 'https://textract.us-east-2.amazonaws.com'  
         });
    //Params for textract 
     var params = {
      Document: {
        Bytes: file.buffer
      }
    };
    //Text processing
    getTextFromImage(params,file);
    debugger;   
    
  });
});
//Calling textract to extract text from images
async function getTextFromImage(params,file) {

     var textract = new AWS.Textract();
    await textract.detectDocumentText(params, function (err, data) {
       if (err) {
      console.log(err);
      }else{
       // console.log(data);
       // debugger;     
        let student = data;
 //       console.log('#####################################################');
 // var keyArray = Object.keys(student); // extractinh 
        qtyfound=false;
        expiryfound=false;
        startfound=false;
        docfound=false;
        getTabDataByTime(student,"MORNING");
        getTabDataByTime(student,"MIDDAY");
        getTabDataByTime(student,"EVENING");
        getTabDataByTime(student,"BEDTIME");
        console.log('#####################################################');
         qtyfound=false;
         expiryfound=false;
         startfound=false;
         docfound=false;
        
         //dynamoDb
         var eDate = Date.parse(startDate,'MM/DD/YYYY');
         eDate.setDate(eDate.getDate() + parseInt(qty));
            var pdata = {
              'docName': docName, 'tabletName': tabletName, 'morningTabCnt': morningTabCnt, 'middayTabCnt': middayTabCnt, 
              'eveTabCnt': eveTabCnt, 'bedtimeTabCnt': bedtimeTabCnt, 'fileDesc': file.originalname, 'fileName': file.originalname,
              'startDate': Date.parse(startDate,'MM/DD/YYYY'),'endDate': eDate, 'expiryDate': Date.parse(expiryDate,'MM/DD/YYYY'),'modifiedDate': Date.now()
            };
            
            

            const dynamoDbObj = require('./../models/connect');

            var paramsDb = {
                TableName: "files",
                Item:  pdata
            };

            dynamoDbObj.put(paramsDb, function (err, data) {
                
                if (err) {
                    console.log(err);
                } else {
                    console.log('Schedule data updated');
                }
            });
      //  console.log('This is after the read call');
      console.log(pdata);
       }
     });
}

async function getTabDataByTime(student,text) {
 
  for (var i=0; i<student.Blocks.length; i++){
  var jText=new String(student.Blocks[i].Text);

  if (!docfound && jText.indexOf("PRSCBR") >= 0 && student.Blocks[i].BlockType == "LINE"){
    console.log("Prescribed By");
    console.log(jText.replace("PRSCBR:",'').trim());
    docName=jText.replace("PRSCBR:",'').trim();
    docfound=true;
  }
 
    if (!expiryfound && jText.indexOf("DISCARD AFTER")>= 0 && student.Blocks[i].BlockType == "LINE"){
      console.log("Expiration Date");
      console.log(jText.replace("DISCARD AFTER:",'').trim());
      expiryDate=jText.replace("DISCARD AFTER:",'').trim();
      expiryfound=true;
    }
    if (!startfound && jText.indexOf("DATE FILLED")>= 0 && student.Blocks[i].BlockType == "LINE"){
      console.log("Start Date");
      console.log(jText.replace("DATE FILLED:",'').trim());
      startDate=jText.replace("DATE FILLED:",'').trim();
      startfound=true;
    }
    if (!qtyfound && jText.indexOf("QTY") >= 0 && student.Blocks[i].BlockType == "LINE"){
      console.log("Total Quantity");
      console.log(jText.replace("QTY:",'').trim());
      qty=jText.replace("QTY:",'').trim();
      qtyfound=true;
    }
    

    if(student.Blocks[i].Text == text && student.Blocks[i].BlockType == "LINE"){
    //console.log(student.Blocks[i].Geometry.BoundingBox.Width);
    //console.log(student.Blocks[i].Geometry.BoundingBox.Height);
    //console.log(student.Blocks[i].Geometry.BoundingBox.Left);
    //console.log(student.Blocks[i].Geometry.BoundingBox.Top);
    if(text=="MORNING"){
    getTabletName(student,parseFloat(student.Blocks[i].Geometry.BoundingBox.Left),parseFloat(student.Blocks[i].Geometry.BoundingBox.Top),parseFloat(student.Blocks[i].Geometry.BoundingBox.Width),parseFloat(student.Blocks[i].Geometry.BoundingBox.Height));
    }
    //console.log(text + " Dosage Info");
    getTablateCount(text,student,parseFloat(student.Blocks[i].Geometry.BoundingBox.Left),parseFloat(student.Blocks[i].Geometry.BoundingBox.Top),parseFloat(student.Blocks[i].Geometry.BoundingBox.Width),parseFloat(student.Blocks[i].Geometry.BoundingBox.Height));
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
  tabletName=tabName;

}
async function getTablateCount(timeOfDay,in1,x,y,w,h){
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
  console.log(timeOfDay +" Tablet Cnt : "+tabCnt);
  if(timeOfDay=='MORNING'){
    morningTabCnt=tabCnt;
  }else if(timeOfDay=='MIDDAY'){
    middayTabCnt=tabCnt;
  }else if(timeOfDay=='EVENING'){
    eveTabCnt=tabCnt;
  }else if(timeOfDay=='BEDTIME'){
    bedtimeTabCnt=tabCnt;
  }

}

module.exports = router;