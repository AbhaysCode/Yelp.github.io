const Review = require("../models/review");
const campground = require("../models/campground");
const mongoose = require("mongoose");

module.exports.postReview = async(req,res)=>{
    console.log("In the post id review req");
    console.log(req.body);
    let camp = await campground.findById(req.params.id);
    let review = new Review(req.body);
    review.author = req.user._id;
    await review.save();
    console.log("Review is"+review);
    camp.review.push(review);
    let campsave = await camp.save();
    console.log("After camp.save() ",campsave);
    req.flash("success","Successfully reviewed a Campground !!");
    res.redirect(`/campground/${req.params.id}`);
    };
module.exports.deleteReview = async(req,res)=>{
    let camp = await campground.findById(req.params.id);
    let reviewtodel = await Review.findById(req.params.reviewid);
    console.log("Camp is",camp);
    console.log("Reviewtodel is",reviewtodel);
    var index = camp.review.indexOf(mongoose.Types.ObjectId(req.params.reviewid));
    console.log("Index is",index)
    if (index !== -1) {
        camp.review.splice(index, 1);
    }  
    await reviewtodel.save();
    await camp.save();
    req.flash("success","Successfully Deleted a Campground !!");
    res.redirect(`/campground/${req.params.id}`);
    };