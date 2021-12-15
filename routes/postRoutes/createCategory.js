function createCategory(model, {body}){
    let bodyObj = body[0]
    // 
    console.log(model)
    model.create({
    // 
    mainCategory: bodyObj.mainCategory,
    subCategory: bodyObj.subCategory,  
    // 
    })
    //
    return `this is also a result from the database ${body}`
}
module.exports = createCategory;