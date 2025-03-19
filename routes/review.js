const express =require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review =require("../models/review.js");
const{validateReview,isLoggedIn}=require("../middleware.js");

const reviewController= require("../controller/review.js");

//post route
router.post("/",isLoggedIn,validateReview , wrapAsync(reviewController.createReview));


//Delete Review route
router.delete("/:reviewId", isLoggedIn,
    wrapAsync(reviewController.destroyReview));
module.exports=router;
