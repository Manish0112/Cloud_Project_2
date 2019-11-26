const express=require('express');
const router=express.Router();
const { ensureAuthenticated }= require('./../config/auth');
const AWS = require('aws-sdk');

const User = require('./../models/user');
const Files = require('./../models/files');
 
//dynamoDb
const dynamoDbObj = require('./../models/connect');

//view schedules
router.get('/view',ensureAuthenticated,(req,res)=>{

    const currentuser =req.user;
    const email = req.user.email;
    
    Files.find({ email : req.user.email },(err, data) => {
        
        //get schedule from dynamodb
        var params = {
        TableName: 'files',
        FilterExpression: "#sn = :i",
        ExpressionAttributeNames:{
            "#sn": "name"
        },
        ExpressionAttributeValues : {
            // ':i'  : 'mySchedule-1574717348492'
            ':i'  : 'admin'
        }
        };

        
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
    })
});

//add shedule manually
router.get('/add',ensureAuthenticated,(req,res)=>{

    const currentuser =req.user;
    const email = req.user.email;
    
    Files.find({ email : req.user.email },(err, data) => {
        
        res.render('addschedule',{
            
            user: currentuser,
            data: data,
            editFlag:false,
            logins: {}
        })
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
                TableName: 'files',
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
                TableName: 'files',
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
            TableName: 'files',
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

        res.render('activate');
    }
});

module.exports=router;