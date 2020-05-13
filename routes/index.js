var express = require('express');
var router = express.Router();
var User=require('../models/user');
var bcrypt=require('bcryptjs');
var passport=require('passport');
var auth=require("../config/auth");
/* GET home page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});


router.post('/signup', function(req, res, next){
  var errors=[];
  var {email,pw,pw2}=req.body;
  if(email==""||pw==""||pw2=="")
    errors.push("Fields cannot left empty");
  if(pw.length<6){
    errors.push("Password should be of at least 6 characters");
  }
  else{
    if(pw!=pw2)
    errors.push("Password do not match");
  }
  if(errors.length>0){
    res.render('signup',{errors})
  }
    // check if user already exists or not
  User.findOne({email:email},(err,userexist)=>{
    if(userexist){
      errors=[];
      errors.push("user already exists");
    }
    if(errors.length>0){
      res.render('signup',{errors})
    }
    else{    
      var user=new User({
        email:email,
        password:pw,
      });
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash){
          if(err){
            throw new Error(err,"some problem while registering")
          }
          user.password=hash;
          user.save()
          .then((user)=>{
            req.flash('success_msg',"Registered successfully, please login!");
            res.redirect('/api/login');
          })
          .catch((err)=>{
            next(err)
          });
        });
      });
    }
  });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:"/api/dashboard",
    failureRedirect:'/api/login', 
    failureFlash: true
  })(req, res, next);
});

router.get('/dashboard',auth.isauth ,function(req, res, next) {
  res.render('dashboard');
});

router.post('/logout',auth.isLoggedIn ,function(req, res, next) {
  req.logOut();
  req.flash('success_msg',"Successfully, loggedout!");
  res.redirect("/api/login");
});










module.exports = router;





