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
    res.render('login',{
        pageTitle : "Login ",
        pathUrl : '/login',
        isAuthenticated : req.session.userAuth,
        user : req.session.user
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
                           //res.send(req.session);
                            res.redirect('/my_posts');
                      }else{
                          req.authUser = false;
                          req.session.save();
                         res.redirect('/users/login?false');
                      }
                 });
            }else{
                req.session.authUser = false;
                req.session.save();
                console.log("not found");
                res.redirect('/users/login?false');
            }
        })

        .catch(err => console.log(err));


};
exports.getRegister = (req,res,next) =>{
    res.render('register',{
        pageTitle : "Register ",
        pathUrl : '/login',
        isAuthenticated : req.session.userAuth,
        user : req.session.user
    });
};
exports.postRegister = (req,res,next) =>{
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
                res.redirect('/users/register?exist');
            }return bcrypt.hash(password,12);
        })
        .then(hashedPassword=>{
            return User.create({
                name : name,
                email: email,
                password :  hashedPassword
            })
        })
        .then(response => {
            if(response)
                res.redirect('/users/login?success');
            else
                res.redirect('/users/register?failed');
        })
        .catch(err => console.log(err));
};
exports.logoutUser = (req,res,next)=>{
  req.session.destroy(()=>{
      res.redirect('/users/login');
  });
};
