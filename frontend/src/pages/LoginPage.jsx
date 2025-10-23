import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(AuthContext);

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
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-200 to-gray-400 
                shadow-lg">
            <div className='flex flex-col items-center justify-center w-[656px] h-[594px] gap-[151px] px-[135px] py-[34px] rounded-4xl bg-[#5E5959]'>
                <form className="flex flex-col items-center justify-center w-full max-w-[450px] gap-11" onSubmit={onSubmit}>

                    <div className='flex justify-center items-center gap-2.5 px-[55px] py-[9px]
        rounded-4xl bg-black text-[24px] font-extrabold
        text-[#E055FF]'>
                        Login-Page
                    </div>

                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Email"
                        className="flex justify-start w-full gap-2.5 px-4 py-[7px] bg-[#D9D9D9]"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Password"
                        className="flex justify-start w-full gap-2.5 px-4 py-[7px] bg-[#D9D9D9]"
                        required
                    />

                    <button type='submit' className='flex justify-center items-center gap-2.5 px-5 py-2 rounded-4xl bg-[#0DE7FF] font-extrabold text-[20px] text-black hover:bg-blue-600 transition'>Login</button>
                </form>

                {/* <p className="text-center text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 font-bold">
                        Sign Up
                    </Link>
                </p> */}

                <div className='flex justify-center items-center gap-2.5 px-[31px] py-7 rounded-[40px] bg-[#E35555] font-extrabold text-[20px]'>
                    <p className='text-black'>Not Registered?  {"->"}</p>
                    <Link to="/register" className='text-[#FFF41F] hover:text-black transition'>
                        {"    "} Sign Up
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
