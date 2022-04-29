const jwt = require('jsonwebtoken');

function auth (req, res, next) {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if(err) {
            return res.status(403).send('Not authenticated');
        } else {
            req.user = user;
            next();
        }
    })
}

module.exports = auth;