import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const {username, email, password, fullname} = req.body;

    try {
        // 1. check if user already exists 
        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({message: "user already exists"});
        }

        // 2. hash password : 
        const salt = await bcrypt.genSalt(10); // generating salt
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hash,
            fullname: fullname,
        });
        await newUser.save();

        return res.status(200).json({
            message: "user registered successfully",
            user: newUser
        });

    } catch (error) {
        return res.status(200).json({
            message: "Server Error",
            error: error.message
        });
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({message: "User does not exist, register first then login..."});

        const isMatching = await bcrypt.compare(password, user.password);

        if(!isMatching) return res.status(400).json({message: "Incorrect password"});
 
        const token = jwt.sign(
            {id: user._id}, // user payload
            process.env.JWT_SECRET_KEY,
            {expiresIn: '30m'}
        );

        return res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            token: token
        });

    } catch (error) {
        return res.status(404).json({
            message: "Server Error",
            error: error.message
        })
    }
}

//Day-> 5 :
export const getUserProfile = async (req, res) => {
    //user is inside req object becz middleware protect ran first 
    if(req.user) {
        return res.json({
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email
        });
    } else {
        res.status(404).json({message: "User not found"});
    }
}