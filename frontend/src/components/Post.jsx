import React from 'react'
import { useState, useContext } from 'react';
import {AuthContext} from '../context/AuthContext'
import postService from '../services/postService'
import { BiLike } from "react-icons/bi";

const Post = ({ post }) => {
    const {currentUser} = useContext(AuthContext);
    // state to manage likes for instant ui feedback
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));

    const handleLike = async () => {
        if (!currentUser || !currentUser.token) {
        alert("You must be logged in to like a post.");
        return;
    }

        try {
            // Optimistic UI update 
            setIsLiked(!isLiked);
            setLikes((prevLikes) => {
                if(isLiked) return prevLikes.filter(id => id !== currentUser._id);
                else return [...prevLikes, currentUser._id];
            })

            await postService.likeUnlikePost(post._id, currentUser.token);
        } catch (error) {
            console.log('Failed to like post: in the Post Component: -> ', error);

            // Revert UI on error
            setIsLiked(isLiked);
            setLikes(likes);
            alert("Something went wrong. (path: frontend/src/comp/Post.jsx )Please try again.");
        }
    }

    return (
        <div className="bg-white border border-gray-300 rounded-lg mb-6">
            {/* Post Header */}
            <div className="p-4 flex items-center">
                <img
                    // We will add real profile pictures later
                    src="https://via.placeholder.com/32"
                    alt={post.user.username}
                    className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-semibold text-sm">{post.user.username}</span>
            </div>

            {/* Post Image */}
            <img src={post.imageUrl} alt={post.caption} className="w-full" />

             {/* Post Actions & Caption */}
            <div className="p-4">
                <div>
                    <BiLike onClick={handleLike} />
                    {/* Action buttons will go here later (Like, Comment) */}
                </div>
                <p className="font-semibold text-sm">{likes.length} likes</p>
                
                <div className="mb-2">
                    <span className="font-semibold text-sm mr-2">{post.user.username}</span>
                    <span className="text-sm">{post.caption}</span>
                </div>
            </div>

        </div>
    )
}

export default Post;
