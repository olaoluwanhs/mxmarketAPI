// Function containing all get routes

function getRoutes(app, models) {
    // get route to get all users
    app.get("/",(req, res)=>{
        let getAllUsers = require("./getRoutes/getAllUsers")
        getAllUsers(models.userModel, res)
    })
    // 
    app.get("/listings",(req, res)=>{
        let getAllListings = require("./getRoutes/getAllListings")
        getAllListings(models.listingModel, res)
    })
    // Others...
}
module.exports = getRoutes;