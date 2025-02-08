const express =require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review =require("../models/review.js");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Destructure to get the error

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", "); // Join messages into a single string
        throw new ExpressError(400, errMsg); // Pass error message to ExpressError
    } else {
        next(); // Continue to the next middleware or route handler
    }
};


//post route
router.post("/",validateReview , wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();
    req.flash("success","New review created");
    
    res.redirect(`/listings/${listing._id}`);
}));


//Delete Review route
router.delete("/:reviewId", 
    wrapAsync(async(req,res)=>{
        let{id,reviewId}=req.params;

        await Listing.findByIdAndUpdate(id,{$pull:{ reviews :reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review deleted");
        res.redirect(`/listings/${id}`);
    })
);
module.exports=router;
