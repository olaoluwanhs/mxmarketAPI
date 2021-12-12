function createListing(model, {body}){
    let bodyObj = body[0]
    // 
    model.create({
    // 
    User : bodyObj.userID,
    title: bodyObj.title,
    description:body.description,
    category: bodyObj.category,
    pictures: bodyObj.pictures,
    postType: bodyObj.postType,
    Negotiablity: bodyObj.Negotiablity,
    priceType: bodyObj.priceType,
    pricePer: bodyObj.pricePer,
    price: bodyObj.price,
    // 
    })
    //
    // console.log(body)
    return `this is also a result from the database ${body}`
}
module.exports = createListing;