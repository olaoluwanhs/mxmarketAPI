const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let categorySchema = new Schema({
// 
mainCategory: {type:String, enum:["fashion","food","technology", "books","school-materials","furnitures","jobs","housing"]},
subCategory: String,  
_id: false
// 
});

let categoryModel = mongoose.model("Category", categorySchema);

module.exports = {categoryModel, categorySchema};