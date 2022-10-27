const campground = require("../models/campground");

module.exports.renderIndex = async(req,res)=>{
    let data = await campground.find({});
    res.render("campground/index",{data});
}
module.exports.postCampground = async(req,res,next)=>{
    let camp = new campground(req.body);
    camp.image = req.files.map(f=>({url:f.path,filename:f.filename}))
    camp.author = req.user._id;
    let savedCamp = await camp.save();
    let id = savedCamp._id;
    req.flash("success","Successfully Created a new Campground !!");
    res.redirect(`/campground/${id}`);
};
// module.exports.postCampground = async(req,res,next)=>{
//     console.log("req.body is ",req.body);
//     console.log("req.files is ",req.files);
//     res.send("req.body is ",req.body);
// }
module.exports.newCampground = async(req,res)=>{
    res.render("campground/new");
    };
module.exports.renderCampground = async(req,res)=>{
    let camp = await campground.findById(req.params.id).populate({
        path: "review", 
        populate: {
           path: "author" 
        }
     }).populate("author");
    if(!camp){
        req.flash("error","Campground Not Found !!");
        return res.redirect("/campground");
    }
    res.render("campground/show",{camp});
};
module.exports.editCampground = async(req,res)=>{
    let id = req.params.id;
    let camp = await campground.findById(id);
    if(!camp){
        req.flash("error","Campground Not Found !!");
        return res.redirect("/campground");
    }
    res.render("campground/edit",{camp});
};
module.exports.updateCampground = async(req,res,next)=>{
    try{
    let id = req.params.id;
    await campground.findByIdAndUpdate(id,req.body);
    req.flash("success","Successfully Updated a new Campground !!");
    res.redirect(`/campground/${id}`);
    }catch(err){
        if(!camp){
            req.flash("error","Campground Not Found !!");
            return res.redirect("/campground");
        }
        next(err);
    }
};
module.exports.deleteCampground = async(req,res)=>{
    const id = req.params.id;
    let campdel = await campground.findOneAndDelete(id);
    console.log("In the delete route "+ campdel);
    req.flash("success","Successfully Deleted a new Campground !!");
    res.redirect("/campground");
};
