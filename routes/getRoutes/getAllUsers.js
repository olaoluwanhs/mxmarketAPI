function getAllUsers(model, {query}){
    // 
    // Logic
    // 
    console.log(`Get request recieved`);
    console.log(query);
    return `This is the result from the database ${query}`;
}
module.exports = getAllUsers;