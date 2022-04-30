const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

function verifyUser(req, res, next) {
  const mxtoken = req.cookies.mxcookie;
  try {
    const user = jwt.verify(mxtoken, process.env.SECRET) || "";
    req.authenticatedUser = user;
    next();
  } catch (error) {
    console.log(error);
    res.json({ mesage: "There was an error", error });
  }
}

function signUser(user, secret) {
  const token = jwt.sign(user, secret, { expiresIn: "14d" });
  return token;
}

module.exports = { signUser, verifyUser };
