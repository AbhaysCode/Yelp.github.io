const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const joi = require("joi");
const isLoggedIn = require("../middileware");
const camp = require("../controllers/campground");
const multer  = require('multer')
const {storage} = require("../cloudinary");
const upload = multer({storage });

const validateCampground = (req,res,next)=>{
    let schema = joi.object({
        title:joi.string().required(),
        price:joi.number().required(),
        description:joi.string().required(),
        location:joi.string().required()
    });
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
const isAuthor = async(req,res,next)=>{
    let id = req.params.id;
    let camp = await campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash("error","You are not authorised to do that !!");
        return res.redirect(`/campground/${id}`);
    }
    next();
}
router.get("/", catchAsync(camp.renderIndex));

router.post("/",isLoggedIn,upload.array("image"),validateCampground,catchAsync(camp.postCampground))
// router.post("/",isLoggedIn,upload.array("image"),catchAsync(camp.postCampground))

router.get("/new",isLoggedIn,catchAsync(camp.newCampground));

router.get("/:id",catchAsync(camp.renderCampground));

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(camp.editCampground))

router.put("/:id",isLoggedIn,isAuthor,catchAsync(camp.updateCampground))

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(camp.deleteCampground))
module.exports = router;
