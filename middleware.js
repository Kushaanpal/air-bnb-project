const Listing = require("./models/listing");

const ExpressError=require("./utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
if(!req.isAuthenticated())//it stores info about current users(passport method)
{
req.session.redirectUrl=req.originalUrl;
req.flash("error","you must be logged in");// if user not logged in he cannot create a new listing
return res.redirect("/login");
}
next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); // Destructure to get the error

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", "); // Join messages into a single string
        throw new ExpressError(400, errMsg); // Pass error message to ExpressError
    } else {
        next(); // Continue to the next middleware or route handler
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Destructure to get the error

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", "); // Join messages into a single string
        throw new ExpressError(400, errMsg); // Pass error message to ExpressError
    } else {
        next(); // Continue to the next middleware or route handler
    }
};


