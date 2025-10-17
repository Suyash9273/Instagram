import axios from 'axios';
const API_URL = '/api/users/';

// Register User : 
const register = async (userData) => {
    const response = await axios.post(API_URL+'register', userData);

    return response.data;
}

//User login
const login = async (userData) => {
    const response = await axios.post(API_URL+'login', userData);

    if(response.data) {
        // If login is successful, the API sends back user data including the token.
        // We store this is browser's local Storage
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
}

//Logout User: 
const logout = () => {
    localStorage.removeItem('user');
}

const authService = {
    register, 
    login,
    logout
}

export default authService;