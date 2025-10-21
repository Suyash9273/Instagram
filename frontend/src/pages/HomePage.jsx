import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import postService from '../services/postService';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  const handlePostDeleted = (deletedPostId) => {
        setPosts(currentPosts =>
            currentPosts.filter(post => post._id !== deletedPostId)
        );
    };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts(currentUser.token);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts: -> ", error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) fetchPosts();
  }, [currentUser]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className='container mx-auto p-4 md:w-2/3 lg:w-1/2'>
        <CreatePost />
        <div className="mt-8">
          {
            loading ? (
              <p>Loading posts...</p>
            ) : posts.length > 0 ? (
              posts.map((post) => {
                return <Post
                  key={post._id}
                  post={post}
                  onPostDeleted={handlePostDeleted} />
              })
            ) : (<p>No posts found...</p>)
          }
        </div>
      </div>
    </div>
  );
}

export default HomePage;
