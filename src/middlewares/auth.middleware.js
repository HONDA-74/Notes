import jwt from 'jsonwebtoken';

export const authenticate =async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ success: false, error: "Access token is missing" })
        }
        const verifyedUSer = jwt.verify(token , process.env.JWT_SECRET) 
        req.userId = verifyedUSer.userId;
        next();
    } catch (error) {
        res.status(403).json({ success: false, error: "Invalid token" })
    }
}
