import Post from '../models/Post.js';
import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv'
//Configure cloudinary : -> 
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createPost = async (req, res) => {
    const {caption} = req.body;

    try {
        if(!req.file) {
            return res.status(400).json({message: `Please upload an image...`})
        }
        // Upload image to cloudinary : 
        // const result = await cloudinary.uploader.upload(req.file.path, {
        //     folder: 'insta-clone-posts',
        // });

        // Convert the buffer to a Data URI
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // Upload the Data URI to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'insta-clone-posts',
        });

        const newPost = new Post({
            user: req.user.id,
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
            caption,
        });

        await newPost.save();
        return res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Server error while creating post`
        });
    }
}
// WE will add getPosts, likePost, etc. functions here later
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({createdAt: -1}).populate('user', 'username profilePicture');

        return res.status(200).json(
            posts
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error while fetching posts' });
    }
}