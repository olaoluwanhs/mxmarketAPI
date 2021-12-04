// Function containing all get routes

function getRoutes(app, models) {
    // get route to get all users
    app.get("/",(req, res)=>{
        let getAllUsers = require("./getRoutes/getAllUsers")
        getAllUsers(models.userModel, res)
    })
    // 
    // Others...
}
module.exports = getRoutes;