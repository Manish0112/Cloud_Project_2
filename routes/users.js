const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');
const AWS = require('aws-sdk');
const keys=require('./../config/keys');
// const User = require('./../models/user');

//Login Page
router.get('/login',(req,res)=>res.render('login'));

//Register Page
router.get('/register',(req,res)=>res.render('register'));

//Register Handle
router.post('/register', (req,res)=>{
    const { name, email, password, password2} = req.body;
    let errors = [];

    //check required fields
    if(!name || !email || !password ||!password2){
        errors.push({ msg:'Please fill in all fields!' });
    }

    //check password match
    if(password != password2){
        errors.push({msg: 'Passwords do not match!'});
    }

    //check pass length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters'});
    }


    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        
        const dynamoDbObj = require('./../models/connect');

        let user = () => {
            var params = {
                TableName: 'user',
                Key: {
                    'email': email
                }
            };

            dynamoDbObj.get(params, function (err, data) {
                if (err){ throw err}
                else{
                    if( Object.keys(data).length > 0){
                    errors.push({ msg:'Email is already registered' });
                        res.render('register',{
                            errors,
                            name,
                            email,
                            password,
                            password2
                    });
                    }
                else{

                    //update in dynamodb
                    var input = {
                        'email': email, 'name': name,
                        'level': 'U', 'password': password
                    };
                    var params = {
                        TableName: "user",
                        Item:  input
                    };
        
                    dynamoDbObj.put(params, function (err, data) {
        
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash('success_msg','You are now registered!!');
                            res.redirect('/users/login');
                        }
                    });
                }
                }
            })
        } 

        user();        
    }
});

//Login Handle
router.post('/login', (req,res, next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout handle
router.get('/logout',(req,res,next) => {
    req.logout();
    req.flash('success_msg','You are Logged out');
    res.redirect('/users/login');
});

//google oauth
router.get('/auth/google',
    passport.authenticate('google', {
    scope:['profile','email']
}));

router.get('/auth/google/callback',passport.authenticate('google'),(req,res,next) => {
    res.redirect('/dashboard');
});

//facebook oauth
router.get('/auth/facebook', 
    passport.authenticate('facebook'));

router.get('/auth/facebook/callback',passport.authenticate('facebook'), (req,res,next) => {
    res.redirect('/dashboard');
});

router.get('/auth/amazon',
  passport.authenticate('amazon'));

router.get('/auth/amazon/callback', 
  passport.authenticate('amazon', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

module.exports=router;