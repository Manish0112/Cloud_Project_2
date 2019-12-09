const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('../config/auth');
const AWS = require('aws-sdk');
const moment = require('moment'); 
var schedule = require('node-schedule');
const nodeMailer = require('nodemailer');

//dynamoDb
const dynamoDbObj = require('../models/connect');

//For mail
var transporter = nodeMailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
           user: 'manishlokhande96@gmail.com',
           pass: 'manish9004945479'
       }
   });

var morning = schedule.scheduleJob('9 * 9 * * *', function(){

    //fetch users
    var paramsdb = {
        TableName: 'user',
        FilterExpression: '#sn <> :i',
        ExpressionAttributeNames:{
            '#sn': 'level'
        },
        ExpressionAttributeValues : {
            ':i'  : 'A'
        }
    };

     dynamoDbObj.scan(paramsdb, function (err, data) {
            
        if (err){ throw err}
        else{
            
            for(let i=0;i<data.Items.length;i++){

                let temp=data.Items[i];

                var params = {
                    TableName: 'prescriptions',
                    FilterExpression: "#sn = :i and :yr between #start_yr and #end_yr",
                    ExpressionAttributeNames:{
                        "#sn": "email",
                        "#start_yr": "startDate",
                        "#end_yr": "endDate",
                    },
                    ExpressionAttributeValues : {
                        ':i'  : temp.email,
                        ":yr": moment(Date.now()).format("YYYY-MM-DD")
                    }
                };

                dynamoDbObj.scan(params, function (err, data1) {
                    
                    if (err){ throw err}
                    else{

                        for(let j=0;j<data1.Items.length;j++){
                
                            let temp1=data1.Items[j];
                            
                            if(temp1.morningTabCnt == '1'  ){
                                
                            //send mail confirmation
                            const mailOptions = {
                                from: 'manishlokhande96@gmail.com', // sender address
                                to: temp.email, // list of receivers
                                subject: 'Morning Reminder of '+temp1.tabletName+'', // Subject line
                                html: '<div><center><img src="https://manish-dropbox.s3.us-east-2.amazonaws.com/MedicationLogo.png" alt="My Medication"  width="70" height="70"/></center><h3>Hello, '+temp1.patientName+'</h3><p>&nbsp;&nbsp;&nbsp;&nbsp;This mail is to remind you regarding your medicine '+temp1.tabletName+' morning dose. This medicine is recommended by dr. '+temp1.docName+'.</p><p>Regards,<br/><b>My Medication Team</b></p></div>'// plain text body
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                console.log(err)
                                else
                                console.log(info);
                            });
                            }
                        }
                    }
                });
            }
        }
    })
    
});
var midday = schedule.scheduleJob('9 * 12 * * *', function(){
    
    //fetch users
    var paramsdb = {
        TableName: 'user',
        FilterExpression: '#sn <> :i',
        ExpressionAttributeNames:{
            '#sn': 'level'
        },
        ExpressionAttributeValues : {
            ':i'  : 'A'
        }
    };

     dynamoDbObj.scan(paramsdb, function (err, data) {
            
        if (err){ throw err}
        else{
            
            for(let i=0;i<data.Items.length;i++){

                let temp=data.Items[i];

                var params = {
                    TableName: 'prescriptions',
                    FilterExpression: "#sn = :i and :yr between #start_yr and #end_yr",
                    ExpressionAttributeNames:{
                        "#sn": "email",
                        "#start_yr": "startDate",
                        "#end_yr": "endDate",
                    },
                    ExpressionAttributeValues : {
                        ':i'  : temp.email,
                        ":yr": moment(Date.now()).format("YYYY-MM-DD")
                    }
                };

                dynamoDbObj.scan(params, function (err, data1) {
                    
                    if (err){ throw err}
                    else{

                        for(let j=0;j<data1.Items.length;j++){
                
                            let temp1=data1.Items[j];
                            
                            if(temp1.middayTabCnt == '1'  ){
                                
                            //send mail confirmation
                            const mailOptions = {
                                from: 'manishlokhande96@gmail.com', // sender address
                                to: temp.email, // list of receivers
                                subject: 'Midday Reminder of '+temp1.tabletName+'', // Subject line
                                html: '<div><center><img src="https://manish-dropbox.s3.us-east-2.amazonaws.com/MedicationLogo.png" alt="My Medication"  width="70" height="70"/></center><h3>Hello, '+temp1.patientName+'</h3><p>&nbsp;&nbsp;&nbsp;&nbsp;This mail is to remind you regarding your medicine '+temp1.tabletName+' midday dose. This medicine is recommended by dr. '+temp1.docName+'.</p><p>Regards,<br/><b>My Medication Team</b></p></div>'// plain text body
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                console.log(err)
                                else
                                console.log(info);
                            });
                            }
                        }
                    }
                });
            }
        }
    })
});
var evening = schedule.scheduleJob('9 * 18 * * *', function(){
    
    //fetch users
    var paramsdb = {
        TableName: 'user',
        FilterExpression: '#sn <> :i',
        ExpressionAttributeNames:{
            '#sn': 'level'
        },
        ExpressionAttributeValues : {
            ':i'  : 'A'
        }
    };

     dynamoDbObj.scan(paramsdb, function (err, data) {
            
        if (err){ throw err}
        else{
            
            for(let i=0;i<data.Items.length;i++){

                let temp=data.Items[i];

                var params = {
                    TableName: 'prescriptions',
                    FilterExpression: "#sn = :i and :yr between #start_yr and #end_yr",
                    ExpressionAttributeNames:{
                        "#sn": "email",
                        "#start_yr": "startDate",
                        "#end_yr": "endDate",
                    },
                    ExpressionAttributeValues : {
                        ':i'  : temp.email,
                        ":yr": moment(Date.now()).format("YYYY-MM-DD")
                    }
                };

                dynamoDbObj.scan(params, function (err, data1) {
                    
                    if (err){ throw err}
                    else{

                        for(let j=0;j<data1.Items.length;j++){
                
                            let temp1=data1.Items[j];
                            
                            if(temp1.eveTabCnt == '1'  ){
                                
                            //send mail confirmation
                            const mailOptions = {
                                from: 'manishlokhande96@gmail.com', // sender address
                                to: temp.email, // list of receivers
                                subject: 'Evening Reminder of '+temp1.tabletName+'', // Subject line
                                html: '<div><center><img src="https://manish-dropbox.s3.us-east-2.amazonaws.com/MedicationLogo.png" alt="My Medication"  width="70" height="70"/></center><h3>Hello, '+temp1.patientName+'</h3><p>&nbsp;&nbsp;&nbsp;&nbsp;This mail is to remind you regarding your medicine '+temp1.tabletName+' evening dose. This medicine is recommended by dr. '+temp1.docName+'.</p><p>Regards,<br/><b>My Medication Team</b></p></div>'// plain text body
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                console.log(err)
                                else
                                console.log(info);
                            });
                            }
                        }
                    }
                });
            }
        }
    })
});
var midnight = schedule.scheduleJob('9 * 10 * * *', function(){
    
    //fetch users
    var paramsdb = {
        TableName: 'user',
        FilterExpression: '#sn <> :i',
        ExpressionAttributeNames:{
            '#sn': 'level'
        },
        ExpressionAttributeValues : {
            ':i'  : 'A'
        }
    };

     dynamoDbObj.scan(paramsdb, function (err, data) {
            
        if (err){ throw err}
        else{
            
            for(let i=0;i<data.Items.length;i++){

                let temp=data.Items[i];

                var params = {
                    TableName: 'prescriptions',
                    FilterExpression: "#sn = :i and :yr between #start_yr and #end_yr",
                    ExpressionAttributeNames:{
                        "#sn": "email",
                        "#start_yr": "startDate",
                        "#end_yr": "endDate",
                    },
                    ExpressionAttributeValues : {
                        ':i'  : temp.email,
                        ":yr": moment(Date.now()).format("YYYY-MM-DD")
                    }
                };

                dynamoDbObj.scan(params, function (err, data1) {
                    
                    if (err){ throw err}
                    else{

                        for(let j=0;j<data1.Items.length;j++){
                
                            let temp1=data1.Items[j];
                            
                            if(temp1.bedtimeTabCnt == '1'  ){
                                
                            //send mail confirmation
                            const mailOptions = {
                                from: 'manishlokhande96@gmail.com', // sender address
                                to: temp.email, // list of receivers
                                subject: 'Bed time Reminder of '+temp1.tabletName+'', // Subject line
                                html: '<div><center><img src="https://manish-dropbox.s3.us-east-2.amazonaws.com/MedicationLogo.png" alt="My Medication"  width="70" height="70"/></center><h3>Hello, '+temp1.patientName+'</h3><p>&nbsp;&nbsp;&nbsp;&nbsp;This mail is to remind you regarding your medicine '+temp1.tabletName+' bedtime dose. This medicine is recommended by dr. '+temp1.docName+'.</p><p>Regards,<br/><b>My Medication Team</b></p></div>'// plain text body
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                console.log(err)
                                else
                                console.log(info);
                            });
                            }
                        }
                    }
                });
            }
        }
    })
});



module.exports=router;