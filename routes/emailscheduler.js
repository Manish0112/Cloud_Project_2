const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('../config/auth');
const AWS = require('aws-sdk');

// const User = require('./../models/user');
// const Files = require('./../models/files');
 
//dynamoDb
const dynamoDbObj = require('../models/connect');
var schedule = require('node-schedule');



var morniing = schedule.scheduleJob('9 * 9 * * *', function(){
    console.log('Today is recognized by mec 42!');
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