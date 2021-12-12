// Funcntion containing all Post routes routes
const express = require("express")

function postRoutes(app, models) {
    // post route to Create new users
    app.post("/",(req, res)=>{
        let createUser = require("./postRoutes/createUser");
        res.send(createUser(models.userModel, req))
    })
    // 
    app.post("/listing", (req, res)=>{
        let createListing = require("./postRoutes/createListing")
        res.send(createListing(models.listingModel, req))
    })
    // 
}
module.exports = postRoutes;