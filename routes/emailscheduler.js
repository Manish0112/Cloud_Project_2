const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('../config/auth');
const AWS = require('aws-sdk');
const moment = require('moment'); 
var schedule = require('node-schedule');
const nodeMailer = require('nodemailer');
const keys = require("../config/keys");

//dynamoDb
const dynamoDbObj = require('../models/connect');
//Twilio setup for messaging service
const client = require('twilio')(keys.twillio_accountSid, keys.twillio_authToken);

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
                let phone=temp.phone;

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
                            console.log(phone);
                            if(phone){
                              phone=phone.replace(phone,'+1');
                              phone='+1'+phone;
                            //Twilio : Publish Message
                            client.messages.create({
                              body: 'Hello, '+temp1.patientName+',\nThis message is to remind you regarding your medicine '+temp1.tabletName+' morning dose. This medicine is recommended by dr. '+temp1.docName+'.\nRegards,\nMy Medication Team',
                              from: '+18635784228',
                              to: phone
                            })
                          .then(message => console.log(message.sid));
                            }else{
                              console.log('No phone provided');
                            }
                          }
                        }
                    }
                    
 

                });
            }
        }
    })
    

});
var midday = schedule.scheduleJob('9 * 13 * * *', function(){
    
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
                let phone=temp.phone;

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
                            if(phone){
                              phone=phone.replace(phone,'+1');
                              phone='+1'+phone;
                            //Twilio : Publish Message
                            client.messages.create({
                              body: 'Hello, '+temp1.patientName+',\nThis message is to remind you regarding your medicine '+temp1.tabletName+' midday dose. This medicine is recommended by dr. '+temp1.docName+'.\nRegards,\nMy Medication Team',
                              from: '+18635784228',
                              to: phone
                            })
                          .then(message => console.log(message.sid));
                            }else{
                              console.log('No phone provided');
                            }
                            }
                        }
                    }
                });
            }
        }
    })
});
var evening = schedule.scheduleJob('9 * 17 * * *', function(){
    
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
                let phone=temp.phone;

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
                            if(phone){
                              phone=phone.replace(phone,'+1');
                              phone='+1'+phone;
                            //Twilio : Publish Message
                            client.messages.create({
                              body: 'Hello, '+temp1.patientName+',\nThis message is to remind you regarding your medicine '+temp1.tabletName+' evening dose. This medicine is recommended by dr. '+temp1.docName+'.\nRegards,\nMy Medication Team',
                              from: '+18635784228',
                              to: phone
                            })
                          .then(message => console.log(message.sid));
                            }else{
                              console.log('No phone provided');
                            }
                            }
                        }
                    }
                });
            }
        }
    })
});
var midnight = schedule.scheduleJob('9 * 21 * * *', function(){
    
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
                let phone=temp.phone;

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
                            if(phone){
                              phone=phone.replace(phone,'+1');
                              phone='+1'+phone;
                            //Twilio : Publish Message
                            client.messages.create({
                              body: 'Hello, '+temp1.patientName+',\nThis message is to remind you regarding your medicine '+temp1.tabletName+' bedtime dose. This medicine is recommended by dr. '+temp1.docName+'.\nRegards,\nMy Medication Team',
                              from: '+18635784228',
                              to: phone
                            })
                          .then(message => console.log(message.sid));
                            }else{
                              console.log('No phone provided');
                            }
                            }
                        }
                    }
                });
            }
        }
    })
});



module.exports=router;