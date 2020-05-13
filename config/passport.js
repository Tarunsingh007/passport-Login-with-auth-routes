var LocalStrategy=require("passport-local").Strategy;
var User=require("../models/user");
var mongoose=require("mongoose");
var bcrypt=require("bcryptjs");

module.exports=function(passport){
  passport.use(new LocalStrategy({usernameField:'email'},function(email, password, done){
    console.log(email,password);
      User.findOne({ email:email}, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false,{message:"Email is not registered"});}
        bcrypt.compare(password,user.password,(err,isMatch)=>{
          console.log(password);
          if(err) throw err;
          if(isMatch)
          return done(null,user);
          else
          return done(null,false,{message:"password is incorrect"});
        })
      });
    }
  ));

  passport.serializeUser((user, done)=>{
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user)=>{
      done(err, user);
    });
  });
}