const jwt = require('jsonwebtoken');


const jwtSecret = 'somesecret';

const getUserId = (req) => {
    const header = req.request.headers.authorization;
    if(!header) throw new Error('Authentication required');
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtSecret);
    return String(decoded.id);
};

module.exports = getUserId;

