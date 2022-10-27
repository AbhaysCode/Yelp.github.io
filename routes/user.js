const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const isLoggedIn = require("../middileware");
const users = require("../controllers/user");

router.get("/register",users.register);

router.post("/register",catchAsync(users.postRegister));

router.get("/login",users.renderLogin);

router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login",keepSessionInfo: true}),users.postLogin);

router.get("/logout",isLoggedIn,users.logOut)

module.exports = router;