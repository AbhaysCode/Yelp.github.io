if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const camproutes = require("./routes/campground");
const revRoutes = require("./routes/review");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/user");

mongoose.connect("mongodb+srv://Abhay:Abhaycodeman@cluster0.ctaurmk.mongodb.net/?retryWrites=true&w=majority")
.then(res=>{
    console.log("Connection Established !! ");
}).catch(err=>{
    console.log(err);
})
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
const sessionConfig = {
    secret:"ThisIsaSecretKey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+(1000*60*60*24*7),
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
app.use("/",userRoutes);
app.use("/campground",camproutes);
app.use("/campground/:id/review",revRoutes);
app.get("/",(req,res)=>{
    res.render("home");
})
app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not Found",404));
})
app.use((err,req,res,next)=>{
    let {statusCode=500} = err;
    if(!err.message){
        err.message = "Oh Boy! Something Went Wrong."
    }
    res.status(statusCode).render("./error",{err});
})
app.listen(3000,()=>{
    console.log("Listening on Port 3000");
})
