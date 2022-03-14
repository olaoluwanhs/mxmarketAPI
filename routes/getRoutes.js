// Function containing all get routes
const { serialize } = require("cookie");
const sign = require("jsonwebtoken/sign");
const query = require("./getQueries");

function getRoutes(app, mysqlCon) {
    // get route to get a user
    app.get("/",(req, res)=>{
        mysqlCon.query(query.getUser(req.query),(err, result)=>{
            if(result[0]){
                // Creating the web token
                const token = sign({
                    exp:Math.floor(Date.now()/1000)+60*60*24*30,
                    user_id:result[0].user_id
                },process.env.SECRET)
                // 
                // Serializing the cookie
                const serialized = serialize("MxmarketJWT",token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV !== "development",
                    sameSite:"strict",
                    maxAge: 60*60*34*30,
                    path:"/"
                }) 
                // 
                res.setHeader('Set-Cookie',serialized);
                // res.cookie("cookie-name","value of cookie")
                res.json(result[0])
            }else{res.json("invalid-credentials")}
        });
    })
    // get profile information
    app.get("/profile",(req, res)=>{
        let result = mysqlCon.query(query.getProfile(req.query),(err, result)=>{
            if(err){res.json("problem fetching profile information")
            console.log(err)
        return 
        }else{
        //         // Check user on the profile
        //         res.json("complete")
        //         // 
        console.log(result)
        res.json(result[0])
        }
        })
    })
    // get route to listings
    app.get("/listings",(req, res)=>{
        let result = mysqlCon.query(query.getListing(req.params))
        res.json(result);
    })
    // Others...
}
module.exports = getRoutes;