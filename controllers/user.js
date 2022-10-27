const User = require("../models/user");

module.exports.register = (req,res)=>{
    res.render("user/register");
};
module.exports.postRegister = async (req,res,next)=>{
    try{
        console.log("Value of req.body is",req.body);
        const {username,email,password} = req.body;
        const user = new User({email,username});
        console.log("Value of user is",user);
        let registeredUser = await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash("success","Successfully Registered!!");
            res.redirect("/campground");
        })
    }catch(e){
        console.log("E.message is",e.message);
        req.flash("error",e.message);  
        res.redirect("/register");
    }
};
module.exports.renderLogin = (req,res)=>{
    res.render("user/login");
};
module.exports.postLogin = (req,res)=>{
    let redirectUrl = req.session.returnTo || "/campground";
    req.flash("success","Successfully Logged In !!");
    res.redirect(redirectUrl);
};
module.exports.logOut = (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success","Successfully Logged Out");
        res.redirect("/campground");
      });
};