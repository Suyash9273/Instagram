import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    imageUrl: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        trim: true
    },
    likes: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        default: []
    },
    comments: [{
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {timestamps: true});

const Post = new mongoose.model('Post', postSchema);
export default Post;