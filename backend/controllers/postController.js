import Post from '../models/Post.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
//Configure cloudinary : -> 
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createPost = async (req, res) => {
    const { caption } = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ message: `Please upload an image...` })
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
        const posts = await Post.find({}).sort({ createdAt: -1 }).populate('user', 'username profilePicture');

        return res.status(200).json(
            posts
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error while fetching posts' });
    }
}

//fn to like / unlike
export const likeUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }
        const isLiked = post.likes.includes(req.user.id);
        if (isLiked) {
            post.likes.pull(req.user.id);
        }
        else post.likes.push(req.user.id);

        await post.save();
        return res.status(200).json(post.likes);
    } catch (error) {
        console.log("this is error postController/likeUnlikePost: ", error);
        return res.status(500).json({
            message: `Internal Server Error: ${error.message}`
        })
    }
}

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "Comment text required!!" });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = {
            text: text,
            user: req.user.id // from protect middleware
        }

        post.comments.push(newComment);

        await post.save();
        //Populate the user info before sending it back 
        await post.populate('comments.user', 'username profilePicture')

        return res.status(201).json(post.comments);
    } catch (error) {
        console.log("Error in addComments inside postcontroller: -> ", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}
// deleting a Post : -> 
export const deletePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }

        // Authorization check : ->
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized to delete this post" });
        }

        //Delete image from cloudinary: 
        await cloudinary.uploader.destroy(post.cloudinaryId);

        await Post.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {
        console.log("error while deleting post: Post controller: ", error);
        return res.status(500).json({
            message: "Server error while deleting post"
        })
    }
}