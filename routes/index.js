const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('./../config/auth');
const AWS = require('aws-sdk');

// const User = require('./../models/user');
// const Files = require('./../models/files');
 
//dynamoDb
const dynamoDbObj = require('./../models/connect');

//Welcome Page
router.get('/',(req,res)=>res.render('welcome'));

//dahsboard Page
router.get('/dashboard',ensureAuthenticated,(req,res)=>{

    const currentuser =req.user;
    const email = req.user.email;

    res.render('dashboard',{
        user: currentuser
    })
    // console.log('1');

    // if(req.user.name == 'admin'){
    //     console.log('2');
        // let getdata = () => {
        //     var params = {
        //         TableName: 'user',
        //         Key: {
        //             'email': email
        //         },
        //         "level": {
        //             ComparisonOperator: "NE",
        //             AttributeValueList: [ {"S":"A"} ]
        //        }
        //     };

        //     dynamoDbObj.get(params, function (err, userdata) {
                
        //         if (err){ throw err}
        //         else{

        //             var params1 = {
        //                 TableName: 'files',
        //                 Key: {
        //                     'email': email
        //                 }
        //             };

        //             dynamoDbObj.get(params1, function (err, filedata) {

        //                 console.log(currentuser);
        //                 console.log(filedata);
        //                 console.log(userdata);
        //                 if (err){ throw err}
        //                 else{

        //                     res.render('dashboard',{
        //                         user: currentuser,
        //                         data: filedata,
        //                         logins: userdata
        //                     })
        //                 }
        //             })
        //         }
        //     })
        // }

        // getdata();

        
        // User.find({ level: { $ne: 'A' }},(err, output) => {
        //     // console.log(output);
        //     Files.find({},(err, data) => {
                
        //         res.render('dashboard',{
        //             user: currentuser,
        //             data: data
        //         })
        //     })
        // })
      
    // }
    // else{
        
        // let getdata = () => {

        //     var params= {
        //         TableName: 'files',
        //         Key: {
        //             'email': email
        //         }
        //     };

        //     dynamoDbObj.get(params, function (err, filedata) {

        //         if (err){ throw err}
        //         else{

        //             console.log(filedata);

        //             res.render('dashboard',{
        //                 user: currentuser,
        //                 data: filedata,
        //                 logins: { }
        //             })
        //         }
        //     })
        // }

        // Files.find({ email : req.user.email },(err, data) => {
        //     res.render('dashboard',{
                
        //         user: currentuser,
        //         data: data
        //     })
        // })
    // }
});

//prescriptions
router.get('/files',ensureAuthenticated,(req,res)=>{

    const currentuser =req.user;
    const email = req.user.email;

    var params = {
        TableName: 'files',
        FilterExpression: '#sn = :i',
        ExpressionAttributeNames:{
            '#sn': 'email'
        },
        ExpressionAttributeValues : {
            // ':i'  : 'mySchedule-1574717348492'
            ':i'  : email
        }
    };

    dynamoDbObj.scan(params, function (err, data) {
            
        if (err){ throw err}
        else{
            
            res.render('files',{
        
                user: currentuser,
                data: data.Items
            })
        }
    })
    
    // Files.find({ email : req.user.email },(err, data) => {
        
    //     res.render('files',{
            
    //         user: currentuser,
    //         data: data
    //     })
    // })
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
            // ':i'  : 'mySchedule-1574717348492'
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
    
    // User.find({ level: { $ne: 'A' }},(err, output) => {
    //     // console.log(output);
    //     Files.find({},(err, data) => {
            
    //         res.render('users',{
    //             user: currentuser,
    //             data: data,
    //             logins: output
    //         })
    //     })
    // })
});

module.exports=router;