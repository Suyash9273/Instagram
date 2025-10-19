import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Day-5
export const protect = async (req, res, next) => {
    let token;

    // The token is sent in the headers like this : "Bearer: <token>"
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Server Error inside authMiddle, protect f/n",
                error: error.message
            });
        }
    }
    if(!token) {
        return res.status(400).json({
            message: "Not authorized, token not found"
        });
    }
}