function createUsers(model, {body}){
    let bodyObj = body[0]
    // 
    model.create({
        firstName: bodyObj.firstName,
        LastName: bodyObj.LastName,
        userName: bodyObj.userName,
        email: bodyObj.email,
        password: bodyObj.password,
        location: bodyObj.location,
        phoneNumber: bodyObj.phoneNumber,
        whatsApp: bodyObj.whatsApp,
        store: bodyObj.store
    })
    // 
    // console.log(model);
    // console.log(body);
    // console.log("Post request Recieved");
    return `this is also a result from the database ${body}`
}
module.exports = createUsers;