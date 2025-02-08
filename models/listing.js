const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review =require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16" : v,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ]
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: { $in: listing.reviews }});
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
