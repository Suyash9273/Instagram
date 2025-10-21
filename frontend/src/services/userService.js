import axios from 'axios';
const API_URL = '/api/users/';

const getUserProfile = async (username, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    const response = await axios.get(`${API_URL}profile/${username}`, config);
    return response.data;
}

const userService = {
    getUserProfile
};

export default userService;