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
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);

    useEffect(
        () => {
            const fetchProfile = async () => {
                try {
                    setLoading(true);
                    const data = await userService.getUserProfile(username, currentUser.token);
                    setProfile(data);

                    setIsFollowing(data.user.followers.includes(currentUser._id));
                    setFollowerCount(data.user.followers.length);
                } catch (error) {
                    console.log("Error inside ProfilePage inside useEffect: -> ", error);
                } finally {
                    setLoading(false);
                }
            }

            if (currentUser) fetchProfile();
            else setLoading(false);
        }, [username, currentUser]
    );

    // follow handler : -> 
    const handleFollowToggle = async () => {
        if (!profile) return;

        try {
            setIsFollowing(!isFollowing);
            setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);// We are doing such because isFollowing do not update until and unless whole of handleFollowToggle is executed, that is isFollowing will persist it's state...

            // call the Api 
            await userService.followToggle(profile.user._id, currentUser.token);
        } catch (error) {
            console.log("User is not able to follow unfollow: -> ", error);
            //Revert state on error
            setIsFollowing(isFollowing);
            setFollowerCount(followerCount);
            alert("Error inside ProfilePage.jsx/followToggle");
        }
    }

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!profile) {
        return <div>User not found...</div>
    }

    //check if the user is viewing their own profile
    const isOwnProfile = currentUser._id === profile.user._id

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="container mx-auto p-4">
                <div className="flex items-center gap-8 mb-8">
                    <img src="https://via.placeholder.com/150" alt={profile.user.username} className="w-32 h-32 rounded-full" />
                    <div>
                        <h2 className="text-2xl font-semibold">{profile.user.username}</h2>

                        {/* --- CONDITIONAL FOLLOW BUTTON --- */}
                        {
                            !isOwnProfile && (
                                <button
                                    onClick={handleFollowToggle}
                                    className={`px-4 py-1 rounded-md font-semibold ${isFollowing ?
                                        'bg-gray-200 text-black hover:bg-gray-400 transition-colors duration-300' :
                                        'bg-blue-500 text-white hover:bg-blue-700 transition-colors duration-300'}`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )
                        }

                        {/* --- DYNAMIC COUNTS --- */}
                        <div className="flex gap-6 mt-4">
                            <p><span className="font-semibold">{profile.posts.length}</span> posts</p>
                            <p><span className="font-semibold">{followerCount}</span> followers</p>
                            <p><span className="font-semibold">{profile.user.following.length}</span> following</p>
                        </div>

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
                                    <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
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