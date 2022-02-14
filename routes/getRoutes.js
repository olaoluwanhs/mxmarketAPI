// Function containing all get routes
const query = require("./getQueries");

function getRoutes(app, mysqlCon) {
    // get route to get a user
    app.get("/",(req, res)=>{
        let result = mysqlCon.query(query.getUser(req.params));
        res.json(result);
    })
    // get rout to listings
    app.get("/listings",(req, res)=>{
        let result = mysqlCon.query(query.getListing(req.params))
        res.json(result);
    })
    // Others...
}
module.exports = getRoutes;