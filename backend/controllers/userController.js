import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Post from '../models/Post.js'

export const registerUser = async (req, res) => {
    const {username, email, password, fullName} = req.body;

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
            fullname: fullName,
        });
        console.log("hello1")
        await newUser.save();
        console.log("hello2")
        return res.status(200).json({
            message: "user registered successfully",
            user: newUser
        });

    } catch (error) {
        return res.status(500).json({
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

//Day-> 15 :
// @desc    Get user profile and their posts
// @route   GET /api/users/profile/:username
export const getUserProfile = async (req, res) => {
    try {
        console.log("hello1");
        const user = await User.findOne({username: req.params.username}).select('-password');
        console.log("hello2");

        if(!user) {
            return res.status(404).json({
                message: "User not found (inside getUserProfile in userController)"
            });
        }

        const posts = await Post.find({user: user._id}).sort({createdAt: -1});

        return res.status(200).json({
            user: user,
            posts: posts
        })
    } catch (error) {
        console.log("Error inside : userController-> getUserProfile: ", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}