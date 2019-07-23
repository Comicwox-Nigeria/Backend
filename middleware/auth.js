const config = require('config');

const jwt = require('jsonwebtoken');

function authReader(req, res, next) {

    const token = req.header('x-auth-token');

//    Check for token
    if (!token) return res.status(401).json({ messageHere: 'No token, authorization denied' });

    try {
        //    Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

//    Add user from payload
        req.reader = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid'});
    }

}

module.exports = authReader;
