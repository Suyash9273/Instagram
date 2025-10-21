import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'; // 1. Added missing import
import { AuthContext } from '../context/AuthContext';
import postService from '../services/postService';

// Icons
import { BiLike } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const Post = ({ post, onPostDeleted }) => {
    // --- Context ---
    const { currentUser } = useContext(AuthContext);

    // --- State ---
    // Like State
    const [likes, setLikes] = useState(post.likes);
    // 4. Added robustness: Check for currentUser before accessing ._id
    const [isLiked, setIsLiked] = useState(currentUser ? post.likes.includes(currentUser._id) : false);

    // Comment State
    const [comments, setComments] = useState(post.comments);
    const [newComment, setNewComment] = useState('');

    // --- Handlers ---
    const handleLike = async () => {
        if (!currentUser || !currentUser.token) {
            alert("You must be logged in to like a post.");
            return;
        }

        try {
            // Optimistic UI update
            setIsLiked(!isLiked);
            setLikes((prevLikes) =>
                isLiked ? prevLikes.filter(id => id !== currentUser._id) : [...prevLikes, currentUser._id]
            );
            await postService.likeUnlikePost(post._id, currentUser.token);
        } catch (error) {
            console.log('Failed to like post: in the Post Component: -> ', error);
            // Revert UI on error
            setIsLiked(isLiked);
            setLikes(likes);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const updatedComments = await postService.addComment(
                post._id,
                { text: newComment },
                currentUser.token
            );
            setComments(updatedComments);
            setNewComment('');
        } catch (error) {
            console.log("error while putting comment: -> ", error);
            alert("Could not post comment. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this Post?")) {
            try {
                await postService.deletePost(post._id, currentUser.token);
                onPostDeleted(post._id);
} catch (error) {
                console.log("Failed to delete post: -> (inside Post.jsx handleDelete) ", error);
                alert("Failed to delete post. Please try again.");
            }
        }
    };

    // --- Render ---
    return (
        <div className="bg-white border border-gray-300 rounded-lg mb-6">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src="https://via.placeholder.com/32" // We'll update this later
                        alt={post.user.username}
                        className="w-8 h-8 rounded-full mr-3"
                    />
                    <Link to={`/profile/${post.user.username}`} className="font-semibold text-sm">
                        {post.user.username}
                    </Link>
                    {/* 2. Fixed: Removed duplicate username span */}
                </div>

                {/* Delete Icon (Conditional) */}
                {currentUser && currentUser._id === post.user._id && (
                    <MdDelete
                        onClick={handleDelete}
                        // 3. Added styling
                        className="cursor-pointer text-gray-500 hover:text-red-500"
                        size={20}
                    />
                )}
            </div>

            {/* Post Image */}
            <img src={post.imageUrl} alt={post.caption} className="w-full" />

            {/* Post Actions & Content */}
            <div className="p-4">
                {/* Action Icons */}
                <div className="flex items-center gap-4 mb-2">
                    <BiLike
                        onClick={handleLike}
                        // 3. Added styling
                        className="cursor-pointer"
                        color={isLiked ? 'red' : 'black'}
                        size={24}
                    />
                    {/* Comment icon can go here */}
                </div>

                {/* Like Count */}
                <p className="font-semibold text-sm">{likes.length} likes</p>

                {/* Caption */}
                <div className="mb-2">
                    <span className="font-semibold text-sm mr-2">{post.user.username}</span>
                    <span className="text-sm">{post.caption}</span>
                </div>

                {/* Comments List */}
                <div className="text-sm text-gray-500 mb-2">
                    {comments.length > 0 && `View all ${comments.length} comments`}
                </div>
                <div className="space-y-1">
                    {comments.slice(0, 2).map((comment) => (
                        <div key={comment._id} className="text-sm">
                            <span className="font-semibold mr-2">{comment.user.username}</span>
                            <span>{comment.text}</span>
                        </div>
                    ))}
                </div>

                {/* Comment Form */}
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
    );
}

export default Post;