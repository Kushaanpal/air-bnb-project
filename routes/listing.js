const express =require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const mongoose = require("mongoose");
const listingcontroller=require("../controller/listing.js");
const multer  = require('multer');
const {storage}=require("./cloudconfig.js");
const upload = multer({ storage});


router.route("/")
.get(wrapAsync (listingcontroller.index))
.post(isLoggedIn, 
  
   upload.single("listing[image]"),
   validateListing,
 wrapAsync(listingcontroller.createListing));
   
     //New route
router.get("/new",isLoggedIn, listingcontroller.renderNewForm);




router.route("/:id").get( 
    wrapAsync (listingcontroller.showListing))
    .put( 
        isLoggedIn,
         
        validateListing, 
        wrapAsync(listingcontroller.updateListing))
        .delete(
            isLoggedIn,
            
            wrapAsync (listingcontroller.destroy));
        
    


//Edit route
// Edit route (SHOW EDIT FORM)
router.get("/:id/edit", 
    isLoggedIn,
    wrapAsync(listingcontroller.renderEditForm));




module.exports=router;