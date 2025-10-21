import React, { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import Header from '../components/Header';

const ProfilePage = () => {
    const { username } = useParams();
    const { currentUser } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(
        () => {
            const fetchProfile = async () => {
                try {
                    setLoading(true);
                    const data = await userService.getUserProfile(username, currentUser.token);
                    setProfile(data);
                } catch (error) {
                    console.log("Error inside ProfilePage inside useEffect: -> ", error);
                } finally {
                    setLoading(false);
                }
            }

            if(currentUser) fetchProfile();
            else setLoading(false);
        }, [username, currentUser]
    );

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!profile) {
        return <div>User not found...</div>
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="container mx-auto p-4">
                <div className="flex items-center gap-8 mb-8">
                    <img src="https://via.placeholder.com/150" alt={profile.user.username} className="w-32 h-32 rounded-full" />
                    <div>
                        <h2 className="text-2xl font-semibold">{profile.user.username}</h2>
                        <p className="text-gray-600">{profile.user.fullName}</p>
                        {/* More bio info will go here later */}
                    </div>
                </div>

                <h3 className="font-semibold border-t pt-4">POSTS</h3>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {
                        profile.posts.map((post) => {
                            return (
                                <div key={post._id} className="aspect-square bg-gray-200">
                                    <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover"/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;