const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('../config/auth');
const AWS = require('aws-sdk');
const moment = require('moment'); 
var schedule = require('node-schedule');

//dynamoDb
const dynamoDbObj = require('../models/connect');

var morning = schedule.scheduleJob('9 * * * * *', function(){

    //Fetch dp details
    // var params = {
    //     TableName: 'prescriptions',
    //     FilterExpression: "#sn = :i and :yr between #start_yr and #end_yr",
    //     ExpressionAttributeNames:{
    //         "#sn": "email",
    //         "#start_yr": "startDate",
    //         "#end_yr": "endDate",
    //     },
    //     ExpressionAttributeValues : {
    //         ':i'  : 'bat@man.com',
    //         ":yr": moment(Date.now()).format("YYYY-MM-DD")
    //     }
    // };

    // dynamoDbObj.scan(params, function (err, data) {
            
    //     if (err){ throw err}
    //     else{
    //         console.log(data);
    //     }
    // });

    console.log('End');
    
});
var midday = schedule.scheduleJob('9 * 12 * * *', function(){
    console.log('Today is recognized by mec 22!');
});
var evening = schedule.scheduleJob('9 * 18 * * *', function(){
    console.log('Today is recognized by mec32!');
});
var midnight = schedule.scheduleJob('9 * 10 * * *', function(){
    console.log('Today is recognized by me 12!');
});



module.exports=router;