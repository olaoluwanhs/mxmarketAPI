const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let listing = new Schema({
    User : {type: Schema.Types.ObjectId},
    title: String,
    description:String,
    category:String,
    pictures: [{type: String}],
    postType: String,
    Negotiablity: {type:String, enum:["Negotiable", "Non-negotiable"]},
    priceType: {
        type:String, enum:["Full-price, price-per"]
    },
    pricePer: String,
    price: Number,
});

let listingModel = mongoose.model("Listing", listing);

module.exports = listingModel;