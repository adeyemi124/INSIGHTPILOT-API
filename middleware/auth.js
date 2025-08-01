const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.required = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided.' });
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token.' });
        req.user = { id: decoded.id };
        next();
    });
};

exports.optional = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) req.user = { id: decoded.id };
        next();
    });
};
