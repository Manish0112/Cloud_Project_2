const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('./../config/auth');
const AWS = require('aws-sdk');

//dynamoDb
const dynamoDbObj = require('./../models/connect');

//Welcome Page
router.get('/',(req,res)=>res.render('welcome'));

var schedule = require('node-schedule');
var j = schedule.scheduleJob('10 * * * * *', function(){
    console.log('Today is recognized by Rebecca Black!');
});
//dahsboard Page
router.get('/dashboard',ensureAuthenticated,(req,res)=>{

    const currentuser =req.user;
    const email = req.user.email;

    res.render('dashboard',{
        user: currentuser
    })
});

//prescriptions
router.get('/files',ensureAuthenticated,(req,res)=>{

    const currentuser =req.user;
    const email = req.user.email;

    if(currentuser.name == 'admin'){

        var params = {
            TableName: 'files'
        };

    }else{

        var params = {
            TableName: 'files',
            FilterExpression: '#sn = :i',
            ExpressionAttributeNames:{
                '#sn': 'email'
            },
            ExpressionAttributeValues : {
                ':i'  : email
            }
        };
    }

    dynamoDbObj.scan(params, function (err, data) {
            
        if (err){ throw err}
        else{
            
            res.render('files',{
        
                user: currentuser,
                data: data.Items
            })
        }
    })
});

//list of all users
router.get('/listUsers',ensureAuthenticated,(req,res)=>{

    const currentuser =req.user;
    const email = req.user.email;

    var params = {
        TableName: 'user',
        FilterExpression: '#sn <> :i',
        ExpressionAttributeNames:{
            '#sn': 'level'
        },
        ExpressionAttributeValues : {
            ':i'  : 'A'
        }
    };

    dynamoDbObj.scan(params, function (err, data) {
            
        if (err){ throw err}
        else{
            
            res.render('users',{
        
                user: currentuser,
                logins: data.Items
            })
        }
    })
});

module.exports=router;