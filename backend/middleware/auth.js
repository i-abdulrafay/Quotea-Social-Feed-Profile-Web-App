const jwt = require('jsonwebtoken');

const verify = (req,res,next) => {
    const auth = req.headers.authorization;
    if (!auth){
        return res.status(401).json({ message: 'Access Denied' });
    } 

    token = auth.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }

};

module.exports = verify;