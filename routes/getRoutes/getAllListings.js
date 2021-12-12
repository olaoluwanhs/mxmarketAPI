function getAllLisitings(model, res){
    // 
    // 
    console.log(`Get request recieved`);
    model.find().then((result)=>{
        console.log(result)
        res.send(result);
        // 
    })
}
module.exports = getAllLisitings;