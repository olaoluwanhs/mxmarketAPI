// Funcntion containing all get routes

function getRoutes(app, models) {
    // get route to get all users
    app.get("/",(req, res)=>{
        // 
        let getAllUsers = require("./getRoutes/getAllUsers")
        res.send(getAllUsers(models.userModel, req))
    })
    // 
    // Others...
}
module.exports = getRoutes;