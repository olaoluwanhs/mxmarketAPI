// Funcntion containing all get routes
function getRoutes(app) {
    // Root get route to get all users
    app.get("/",(req, res)=>{
        res.send("Listening get requests")
    })
    // 
    // Others...
}
module.exports = getRoutes;