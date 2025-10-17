import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                if(value.includes(" ")) {
                    return false;
                }

                return true;
            },

            message: "Password cannot contains spaces"
        }
    },
    fullname: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'url_to_a_default_avatar_image', // We'll add a real default later
    },
    bio : {
        type: String,
        default: '',
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;