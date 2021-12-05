// Funcntion containing all Post routes routes
function postRoutes(app) {
    // Root Create new users
    app.post("/",(req, res)=>{
        res.send("Listening for posts requests")
    })
    // 
    // Others...
}
module.exports = postRoutes;