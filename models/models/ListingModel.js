const mongoose = require("mongoose");
const {categorySchema} = require("./categoryModel")
const Schema = mongoose.Schema;
// 
let listing = new Schema({
    User : {type: Schema.Types.ObjectId},
    title: String,
    description:String,
    category: {type: categorySchema},
    pictures: [{type: String}],
    postType: String,
    Negotiablity: {type:String, enum:["Negotiable", "Non-negotiable"]},
    priceType: {
        type:String, enum:["Full-price", "price-per", "on-call"]
    },
    pricePer: String,
    price: Number,
});

let listingModel = mongoose.model("Listing", listing);

module.exports = listingModel;