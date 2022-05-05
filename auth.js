// const jwt = require('jsonwebtoken');
//
// function auth (req, res, next) {
//     const header = req.headers['authorization'];
//     const token = header && header.split(' ')[1];
//
//     jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
//         if(err) {
//             return res.status(403).send('Not authenticated');
//         } else {
//             req.user = user;
//             next();
//         }
//     })
// }
//
// module.exports = auth;
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;