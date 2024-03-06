// auth.js
var jwt = require("jsonwebtoken");
var generateAccessToken = function (userId) {
    return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "60m",
    });
};
var generateRefreshToken = function (userId) {
    return jwt.sign({ userId: userId }, process.env.REFRESH_TOKEN_SECRET);
};
var verifyAccessToken = function (req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
};
module.exports = {
    generateAccessToken: generateAccessToken,
    generateRefreshToken: generateRefreshToken,
    verifyAccessToken: verifyAccessToken,
};
