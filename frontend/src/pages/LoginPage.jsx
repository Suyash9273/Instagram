import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const {setCurrentUser} = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await authService.login(formData);
            setCurrentUser(userData); // update global state
            navigate('/');//redirect to home page
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            alert(`Login failed: ${message}`);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-slate-900">
            <div className="bg-white border border-gray-300 p-10 w-full max-w-sm rounded-lg shadow-md">
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <h2 className="text-2xl font-semibold text-center mb-4">
                        Log In to Insta-Clone
                    </h2>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Email"
                        className="p-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Password"
                        className="p-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                        required
                    />
                    <button
                        type="submit"
                        className="p-2 mt-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                    >
                        Log In
                    </button>
                </form>
                 <p className="text-center text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 font-bold">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
