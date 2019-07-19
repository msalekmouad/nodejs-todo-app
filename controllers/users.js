const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.getUsers = (req,res,next)=>{
    User.findAll()
        .then(users=>{
            res.render('users',{
                pageTitle : 'Users list',
                Users : users,
                pathUrl : '/users',
                isAuthenticated : req.session.userAuth,
                user : req.session.user
            })
        })
        .catch(err=>console.log(err));
};
exports.addUsers = (req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        where : {
            email : email
        }
    })
        .then(user =>{
            if(user){
                res.redirect('/users/register');
            }else{
                return bcrypt.hash(password,12);
            }
        })
        .then(hashedPassword=>{
            return User.create({
                name : name,
                email: email,
                password :  hashedPassword
            });
        })
        .then(response => {
            if(response)
                res.redirect('/users?success');
            else
                res.redirect('/users?failed');
        })
        .catch(err => console.log(err));
};
exports.deleteUser = (req,res,next)=>{
    const user_id = req.params.id;

    User.findByPk(user_id)
        .then(user=>{
            return user.destroy();
        })
        .then(response=>{
            res.redirect('/users');
        })
        .catch(err=>console.log(err));
};
exports.getLogin = (req,res,next)=>{
    const empty = req.flash('lempty');
    const invalid = req.flash('lerror');
    let errorMessages = {
        "invalid" : (invalid.length > 0) ? invalid : null,
        "empty" : (empty.length > 0) ? empty : null
    };
    res.render('login',{
        pageTitle : "Login ",
        pathUrl : '/login',
        isAuthenticated : req.session.userAuth,
        user : req.session.user,
        errorMessages : errorMessages
    });
};
exports.postLogin = (req,res,next)=>{
    if(req.body.rememberMe){
        res.cookie('email',req.body.email);
        res.cookie('password',req.body.password);
    }else{
        res.clearCookie('email');
        res.clearCookie('password');
    }
    const email = req.body.email;
    const password = req.body.password;

    if(email != "" && password != ""){
        User.findOne({
            where :{
                email:email
            }
        })
            .then(user=>{
                if(user){
                    bcrypt.compare(password,user.password).then(doMatch=>{
                        console.log('password is :'+user.password+" is match : "+doMatch);
                        if(doMatch){
                            req.session.userAuth = true;
                            req.session.user = user;
                            req.session.save();

                            res.redirect('/my_posts');
                        }else{
                            req.authUser = false;
                            req.session.save();
                            req.flash('lerror','Invalid email or password');
                            res.redirect('/users/login');
                        }
                    });
                }else{
                    req.session.authUser = false;
                    req.session.save();
                    req.flash('lerror','Invalid email or password');
                    res.redirect('/users/login');
                }
            })
            .catch(err => console.log(err));
    }else{
        req.flash('lempty','please enter empty fields');
        res.redirect('/users/login');
    }


};
exports.getRegister = (req,res,next) =>{
    const error = req.flash('error');
    const empty = req.flash('empty');
    const exist = req.flash('exist');
    const notmatch = req.flash('notmatch');
    let errorMessages = {
        "error" : (error.length>0)?error:null,
        "emptyy" : (error.length>0 )?empty:null,
        "notmatch" :(notmatch.length>0)?notmatch:null,
        "exist":(exist.length>0)?exist:null
    }
    res.render('register',{
        pageTitle : "Register ",
        pathUrl : '/login',
        isAuthenticated : req.session.userAuth,
        user : req.session.user,
        errorMessages : errorMessages
    });
};
exports.postRegister = (req,res,next) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.cpassword;
   if(name!="" && email != "" && password != ""&&cpassword!=""){
       User.findOne({
           where : {
               email : email
           }
       })
           .then(user =>{
               if(user){
                   req.flash('exist','email : '+email+' already exist !');
                   res.redirect('/users/register');
               }
               else{
                   if(password == cpassword)
                   {
                       return bcrypt.hash(password,12);
                   }else{
                       req.flash('notmatch','Password do not match');
                       res.redirect('/users/register');
                   }
               }
           })
           .then(hashedPassword=>{
               return User.create({
                   name : name,
                   email: email,
                   password :  hashedPassword
               })
           })
           .then(response => {
               if(response){
                   res.redirect('/users/login?success');

               }
               else
               {
                   req.flash('error','and unexpected error whie registering your account');
                   res.redirect('/users/register');
               }
           })
           .catch(err => console.log(err));
   }else{
       req.flash('empty','please fill empty fields');
       res.redirect('/users/register');
   }
};
exports.logoutUser = (req,res,next)=>{
  req.session.destroy(()=>{
      res.redirect('/users/login');
  });
};
exports.getReset = (req,res,next)=>{
    const error = req.flash('error');
    const empty = req.flash('empty');
    const notfound = req.flash('notfound');
    let errorMessages = {
        "error" : (error.length>0)?error:null,
        "emptyy" : (error.length>0 )?empty:null,
        "notfound" :(notfound.length>0)?notfound:null
    };
    res.render('reset',{
        pageTitle : "Reset",
        pathUrl : '/reset',
        isAuthenticated : req.session.userAuth,
        user : req.session.user,
        errorMessages : errorMessages
    });

};
exports.postReset= (req,res,next)=>{
    const email = req.body.email;
    if(email != ""){

    }else{
        req.flash('empty','please enter your email');
        res.redirect('/users/reset');
    }
};
