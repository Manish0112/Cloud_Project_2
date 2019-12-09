const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('./../config/auth');
const AWS = require('aws-sdk');
const nodeMailer = require('nodemailer');

//dynamoDb
const dynamoDbObj = require('./../models/connect');

//For mail
var transporter = nodeMailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
           user: 'manishlokhande111@gmail.com',
           pass: 'M@nish123'
       }
   });

//view schedules
router.get('/view',ensureAuthenticated,(req,res)=>{

    const currentuser =req.user;
    const email = req.user.email;
    
    if(currentuser.name == 'admin'){
        
        var params = {
            TableName: 'prescriptions'
        };

    }
    else{

        //get schedule from dynamodb
        var params = {
        TableName: 'prescriptions',
        FilterExpression: "#sn = :i",
        ExpressionAttributeNames:{
            "#sn": "email"
        },
        ExpressionAttributeValues : {
            ':i'  : email
        }
        };
    }

    dynamoDbObj.scan(params, function (err, filedata) {
            
        if (err){ throw err}
        else{
            
            res.render('schedule',{
        
                user: currentuser,
                data: filedata.Items,
                logins: {}
            })
        }
    })
     
   
});

//add shedule manually
router.get('/add',ensureAuthenticated,(req,res)=>{

    const currentuser =req.user;
    const email = req.user.email;
    
    var params = {
        TableName: 'prescriptions',
        FilterExpression: "#sn <> :i",
        ExpressionAttributeNames:{
            "#sn": "email"
        },
        ExpressionAttributeValues : {
            ':i'  : email
        }
        };

        
        dynamoDbObj.scan(params, function (err, filedata) {
            
            if (err){ throw err}
            else{
                
                res.render('addschedule',{
            
                    user: currentuser,
                    data: filedata,
                    editFlag:false,
                    logins: {}
                })
            }
        })
});

router.post('/add', (req,res)=>{

    const { sName,pName, tablet, startDate, endDate, morningCnt, middayCnt, eveningCnt, bedtimeCnt, docName, confirmBtn, deleteBtn} = req.body;

    let errors = [];

    if(!sName || !pName || !tablet || !startDate ||!endDate || !docName){
        errors.push({ msg:'Please fill all required fields!' });
    }
    
    if(errors.length > 0){
        res.render('addSchedule',{
            user: req.user,
            errors,
            tablet,
            startDate,
            endDate,
            docName
        });
    }
    else{

        const dynamoDbObj = require('./../models/connect');

        if(deleteBtn == 'delete'){
            //for delete schedule
            console.log('Inside delete');
            var params = {
                TableName: 'prescriptions',
                Key: {
                    'fileName': sName
                }
            };
            
            dynamoDbObj.delete(params, function (err, data) {
        
                if (err) {
                    console.log(err);
                    req.flash('error_msg','Error Occured while deleting schedule!');
                    res.redirect('/schedule/add');
                } else {
                    console.log('Schedule deleted');
                    req.flash('success_msg','Schedule Deleted!');
                    res.redirect('/schedule/view');
                }
            });

        }
        else{
            //for add new and confirm schedule
            var myScheduleName,myScheduleDesc;
            
            if(!(sName.includes('mySchedule'))){
                myScheduleName = 'mySchedule'+('-')+Date.now();
                myScheduleDesc=sName;
                
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
        
                var yyyy = today.getFullYear();
                if (dd < 10) {
                dd = '0' + dd;
                } 
                if (mm < 10) {
                mm = '0' + mm;
                } 
                var today = dd + '/' + mm + '/' + yyyy;

            }
            else{
                myScheduleName=sName;
            }

            var input = {
                'name': req.user.name,'fileName': myScheduleName, 'fileDesc':myScheduleDesc, 'startDate': startDate, 'endDate': endDate, 'morningTabCnt': morningCnt,'expiryDate':endDate, 'modifiedDate':today,
                'middayTabCnt': middayCnt, 'eveTabCnt': eveningCnt, 'bedtimeTabCnt': bedtimeCnt , 'tabletName' : tablet, 'patientName':pName, 'docName':docName, 'createdDate':today
            };

            var paramsDb = {
                TableName: 'prescriptions',
                Item:  input
            };

            dynamoDbObj.put(paramsDb, function (err, data) {
                        
                if (err) {
                    console.log(err);
                    req.flash('error_msg','Error Occured while creating schedule!');
                    res.redirect('/schedule/add');
                } else {
                    console.log('Schedule Added');
                    req.flash('success_msg','Schedule Created!');
                    res.redirect('/schedule/view');
                }
            });
        }  
    }
});

router.post('/edit', (req,res)=>{

    const { fileName, user, editFlag, editBtn, activateBtn} = req.body;

    if(editBtn == 'edit'){

        var params= {
            TableName: 'prescriptions',
            Key: {
                'fileName': fileName
            }
        };
    
        dynamoDbObj.get(params, function (err, data) {
    
            if (err){ throw err}
            else{
                res.render('addSchedule',{
                    user: user,
                    data: data.Item,
                    editFlag: editFlag,
                    logins: { }
                })
            }
        })

    }
    else if(activateBtn == 'activate'){

        var input = {
            'fileName': fileName, 'activeFlag' : 'Y'
        };

        //send mail confirmation
        const mailOptions = {
            from: 'manishlokhande111@gmail.com', // sender address
            to: 'manishlokhande96@gmail.com', // list of receivers
            subject: 'Activation of the schedule', // Subject line
            html: '<p>Your schedule for the uploaded prescription is activated.</p>'// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });


        //update in dyanamo
        var params = {
            TableName: 'prescriptions',
            Key : {
                "fileName" : fileName
            },
            UpdateExpression: "set #sn = :i",
            ExpressionAttributeNames:{
                "#sn": "activeFlag"
            },
            ExpressionAttributeValues : {
                ':i'  : 'Y'
            }
        };

        dynamoDbObj.update(params, function (err, data) {
                    
            if (err) {
                console.log(err);
                req.flash('error_msg','Error Occured while activating schedule!');
                res.redirect('/schedule/view');
            } else {
                console.log('Schedule Activated');
                req.flash('success_msg','Schedule Activated!');
                res.redirect('/schedule/view');
            }
        });
    }
    else if(activateBtn == 'deactivate'){

        var input = {
            'fileName': fileName, 'activeFlag' : 'Y'
        };

        //update in dynamo
        var params = {
            TableName: 'prescriptions',
            Key : {
                "fileName" : fileName
            },
            UpdateExpression: "set #sn = :i",
            ExpressionAttributeNames:{
                "#sn": "activeFlag"
            },
            ExpressionAttributeValues : {
                ':i'  : 'N'
            }
        };

        dynamoDbObj.update(params, function (err, data) {
                    
            if (err) {
                console.log(err);
                req.flash('error_msg','Error Occured while deactivating schedule!');
                res.redirect('/schedule/view');
            } else {
                console.log('Schedule Deactivated');
                req.flash('success_msg','Schedule Deactivated!');
                res.redirect('/schedule/view');
            }
        });
    }
});

module.exports=router;