const mongoose = require("mongoose");
const Review = require("./review");
const Schema = new mongoose.Schema({
    "author":
        {
        "type":mongoose.Schema.Types.ObjectId,
        "ref":"User"
    },
    "title":String,
    "price":Number,
    "image":[
        {
        "url":String,
        "filename":String
    }
],
    "description":String,
    "location":String,
    "review":[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
})
Schema.post("findOneAndDelete",async(doc)=>{
    console.log("Campground to be deleted is"+doc);
    console.log("Campground Review about to be deleted is "+doc.review);
    for(let review of doc.review){
        let res = await Review.findByIdAndDelete(review);
        console.log(res);
    }
});
module.exports = mongoose.model("campground",Schema);