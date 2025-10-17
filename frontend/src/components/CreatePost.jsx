import React, { useState } from 'react';
import postService from '../services/postService';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const CreatePost = () => {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const { currentUser } = useContext(AuthContext); // Get the user to access the token

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image to upload.');
            return;
        }
        // Logic to upload the post will go here
        const formData = new FormData();

        formData.append('image', file);
        formData.append('caption', caption);

        try {
            await postService.createPost(formData, currentUser.token);
            alert('Post created successfully');

            //Reset form : 
            setCaption('');
            setFile(null);
            document.getElementById('file').value = null;
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            setError(`Post creation failed: ${message}`);
        }
    };

    return (
        <div className='p-4 bg-white border border-gray-300 rounded-lg shadow-md my-6'>
            <h3 className="text-lg font-semibold mb-4">Create New Post</h3>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div>
                    <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
                    <textarea
                        id="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder='Write a caption ....'
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                >
                    Create Post
                </button>
            </form>

        </div>
    );
}

export default CreatePost
