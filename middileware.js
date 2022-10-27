let isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        console.log("The value of req.orignalUrl is ",req.originalUrl);
        req.flash("error","You need to Sign in");
        console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
        console.log("req.session.returnTo is ",req.session.returnTo);
        console.log("The Value of req.session is",req.session);
        console.log("The value of req.session.returnTo is ",req.session.returnTo);
        return res.redirect("/login");
    }
    next();
}
module.exports = isLoggedIn;
