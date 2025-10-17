import React, { use, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const Header = () => {
    const {currentUser, setCurrentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout(); // clears local storage
        setCurrentUser(null); // clears the context state
        navigate('/login');
    }

    return (
        <header className='bg-white border-b border-gray-300'>
            <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
                <Link to='/' className='text-xl font-semibold'>
                    Insta-Clone
                </Link>
                {
                    currentUser && (
                        <div className='flex items-center gap-4'>
                            <span className='text-sm'>Welcome, {currentUser.username}</span>
                            <button
                            onClick={handleLogout}
                            className='bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-red-600'
                            >
                                Logout
                            </button>
                        </div>
                    )
                }
            </div>
        </header>
    )
}

export default Header
