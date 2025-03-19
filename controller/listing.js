const Listing=require("../models/listing");
const mongoose=require("mongoose");
module.exports.index = async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm= (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
  
    let id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID.");
        return res.redirect("/listings");
    }
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews", 
        populate:{
        path:"author",
    },
})
    .populate("owner");
    if(!listing){
        req.flash("error"," listing does not exist ");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing= async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);

    // Ensure image is stored as an object
    if (typeof req.body.listing.image === 'string') {
        newListing.image = { url: req.body.listing.image, filename: "customFilename" };
    }
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm= async (req, res) => {
    let id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID.");
        return res.redirect("/listings");
    }
    const listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","no permission");
        return res.redirect(`/listings/${id}`);
    }
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", { listing }); // ✅ Just render the edit form
};

module.exports.updateListing= async (req, res) => {
    let id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID.");
        return res.redirect("/listings");
    }
const listing = await Listing.findById(id);
if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","no permission");
    return res.redirect(`/listings/${id}`);
}

if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
}

// If a new image is provided, update it; otherwise, keep the old one
if (req.body.listing.image && req.body.listing.image.trim() !== "") {
    listing.image = { url: req.body.listing.image, filename: "customFilename" };
}
if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","dont permission");
    res.redirect(`/listings/${id}`);
}


// Update other fields
listing.title = req.body.listing.title;
listing.description = req.body.listing.description;
listing.price = req.body.listing.price;
listing.country = req.body.listing.country;
listing.location = req.body.listing.location;

await listing.save();

req.flash("success", "Listing updated successfully!");
res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
    let id = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid listing ID.");
        return res.redirect("/listings");
    }

    let listing = await Listing.findById(id); // Fetch listing before deleting

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "No permission to delete this listing.");
        return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndDelete(id); 

    req.flash("success", "Listing deleted successfully.");
    res.redirect("/listings");
};