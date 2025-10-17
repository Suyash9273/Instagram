import React from 'react'

const Post = ({ post }) => {
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
                {/* Action buttons will go here later (Like, Comment) */}
                <div className="mb-2">
                    <span className="font-semibold text-sm mr-2">{post.user.username}</span>
                    <span className="text-sm">{post.caption}</span>
                </div>
            </div>

        </div>
    )
}

export default Post;
