const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden access' });
        }
        req.adminId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized access' });
    }
};

module.exports = adminAuth;

//not required
