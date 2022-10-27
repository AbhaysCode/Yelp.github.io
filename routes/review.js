const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const joi = require("joi");
const isLoggedIn = require("../middileware");
const review = require("../controllers/review");

const validateReviews = (req,res,next)=>{
    let schema = joi.object({
        body:joi.string().required(),
        rating:joi.number().required() 
    })
    let value = schema.validate(req.body);
    if(value.error){
        console.log("value. ",value);
        console.log("value.error ",value.error);
        console.log("value.error.message ",value.error.message);
        throw new ExpressError(value.error.message);
    }else{
        next();
    }
}
const isReviewAuthor = async(req,res,next)=>{
    let id = req.params.id;
    let reviewId = req.params.reviewid;
    let review = await Review.findById(reviewId).populate("author");
    if(!review.author.equals(req.user._id)){
        req.flash("error","You are not authorised to do that !!");
        return res.redirect(`/campground/${id}`);
    }
    next();
}
router.post("/",isLoggedIn,validateReviews,review.postReview);

router.delete("/:reviewid",isLoggedIn,isReviewAuthor,review.deleteReview)

module.exports = router;