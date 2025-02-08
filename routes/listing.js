const express =require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); // Destructure to get the error

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", "); // Join messages into a single string
        throw new ExpressError(400, errMsg); // Pass error message to ExpressError
    } else {
        next(); // Continue to the next middleware or route handler
    }
};
//index route
router.get("/",wrapAsync (async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});

}));

//New route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync (async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error"," listing does not exist ");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    // Ensure image is stored as an object
    if (typeof req.body.listing.image === 'string') {
        newListing.image = { url: req.body.listing.image, filename: "customFilename" };
    }

    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit", wrapAsync (async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error"," listing does not exist ");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing updated");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",wrapAsync (async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}));

module.exports=router;