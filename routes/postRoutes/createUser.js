function createUsers(model, {body}, bodyParser){
    // 
    // Logic
    // 
    console.log("Post request Recieved");
    console.log(body);
    return `this is also a result from the database ${body}`
}
module.exports = createUsers;