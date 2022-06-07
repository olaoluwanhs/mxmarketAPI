const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const res = require("express/lib/response");

function verifyUser(req, res, next) {
  const mxtoken = req.cookies.mxcookie;
  // console.log(mxtoken);
  try {
    if (mxtoken == undefined) {
      req.authenticatedUser = { mesage: "no User" };
      next();
      return;
    }
    const user = jwt.verify(mxtoken, process.env.SECRET) || "";
    req.authenticatedUser = user;
    next();
  } catch (error) {
    console.log(error);
    // res.json({ mesage: "Unauthorized user" });
    req.authenticatedUser = {};
  }
}

function signUser(user, secret) {
  try {
    const token = jwt.sign(user, secret, { expiresIn: "14d" });
    return token;
  } catch (error) {
    res.json({ mesage: "There was an error", error });
  }
}

module.exports = { signUser, verifyUser };
