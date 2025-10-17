import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  });

  const { username, fullName, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      alert('Registration successful! Please Login...');
      navigate('/login');
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      alert(`Registration Failed: ${message}`);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-white border border-gray-300 p-10 w-full max-w-sm rounded-lg shadow-md">
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>

          <h2 className="text-2xl font-semibold text-center mb-4">
            Sign Up for Insta-Clone
          </h2>

          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            placeholder="Username"
            className='p-2 bg-gray-50 border border-gray-300 rounded-md text-sm'
            required
          />

          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={onChange}
            placeholder="fullName"
            className='p-2 bg-gray-50 border border-gray-300 rounded-md text-sm'
            required
          />

          <input
            type="text"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="email"
            className='p-2 bg-gray-50 border border-gray-300 rounded-md text-sm'
            required
          />

          <input
            type="text"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="password"
            className='p-2 bg-gray-50 border border-gray-300 rounded-md text-sm'
            required
          />

          <button
            type="submit"
            className="p-2 mt-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        <p className='text-center text-sm mt-6'>Already have an account
          {' '}
          <Link to='/login' className='text-blue-500 front-bold'>Log In</Link>
        </p>
      </div>
    </div>
  );

}
export default RegisterPage;
