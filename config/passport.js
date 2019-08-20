var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});
passport.use('local.signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    // req.checkBody('email','Invalid email').notEmpty().isEmail();
    // req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
    // var errors = req.validationErrors();
    // if(errors){
    //     var messages=[];
    //     errors.array.forEach(element => {
    //         messages.push(error.msg);
    //     });
    //     return done(null,false,req.flash('error',messages))
    // }

    User.findOne({'email':email},function(err,user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null,false,{message:'Email is already in use !'});
        }else{
            
            var newUser = new User();
            newUser.email= email;
            newUser.password=newUser.encrpytPassword(password);
   
            newUser.save((err,res)=>{
                if(err){
                    return done(err);
                }
                return done(null,newUser);
            });  
        }
   
    })
}));

passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    User.findOne({'email':email},function(err,user){
        if(err){
            return done(err);
        }
        if(user){
            //newUser.encrpytPassword(password);
            if(user.validPassword(req.body.password)){
                return done(null,user);
            }else{
                return done(null,false,{message:'Pass is wrong !'});
            }
           
        }else{
            return done(null,false,{message:'Account have not exist !'});
        }
   
    })
}))