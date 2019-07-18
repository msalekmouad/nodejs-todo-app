module.exports = (req,res,next)=>{
    if(!req.session.userAuth){
        return res.redirect('/users/login');
    }
    next();
};
