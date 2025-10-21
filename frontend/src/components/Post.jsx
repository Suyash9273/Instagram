import React from 'react'
import { useState, useContext } from 'react';
import {AuthContext} from '../context/AuthContext'
import postService from '../services/postService'
import { BiLike } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const Post = ({ post, onPostDeleted }) => {
    const {currentUser} = useContext(AuthContext);
    // state to manage likes for instant ui feedback
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
    
    //states to manage comments : -> 
    const [comments, setComments] = useState(post.comments);
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if(!newComment.trim()) return; // don't submit empty comments

        try {
            const updatedComments = await postService.addComment(
                post._id,
                {text: newComment},
                currentUser.token
            )
            setComments(updatedComments);
            setNewComment('');// clear the input field
        } catch (error) {
            console.log("error while putting comment: -> ", error);
            return;
        }
    }

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

    //handler for deleting a post : -> 
    const handleDelete = async () => {
        if(window.confirm("Are you sure you want to delete this Post?")) {
            try {
                await postService.deletePost(post._id, currentUser.token);
                onPostDeleted(post._id);// Call the function from the parent
            } catch (error) {
                console.log("Failed to delete post: -> (inside Post.jsx handleDelete) ", error);
                return;
            }
        }
    }

    return (
        <div className="bg-white border border-gray-300 rounded-lg mb-6">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
                <img
                    // We will add real profile pictures later
                    src="https://via.placeholder.com/32"
                    alt={post.user.username}
                    className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-semibold text-sm">{post.user.username}</span>
                {/* --- CONDITIONAL RENDERING FOR DELETE ICON --- */}
                {currentUser && currentUser._id === post.user._id && (
                    <MdDelete onClick={handleDelete}/>
                )}
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

                {/* --- COMMENTS SECTION --- */}
                <div className="text-sm text-gray-500 mb-2">
                    {/* We can add a link to a "view all" page later */}
                    {comments.length > 0 && `View all ${comments.length} comments`}
                </div>

                <div className="space-y-1">
                    {comments.slice(0, 2).map((comment) => ( // Show the first 2 comments
                        <div key={comment._id} className="text-sm">
                            <span className="font-semibold mr-2">{comment.user.username}</span>
                            <span>{comment.text}</span>
                        </div>
                    ))}
                </div>

                {/* --- ADD COMMENT FORM --- */}
                <form onSubmit={handleCommentSubmit} className="flex items-center mt-3 border-t pt-3">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow bg-transparent outline-none text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="text-blue-500 font-semibold text-sm disabled:text-blue-200"
                    >
                        Post
                    </button>
                </form>
                
            </div>

        </div>
    )
}

export default Post;
