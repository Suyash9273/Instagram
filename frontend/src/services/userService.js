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

//follow or unfollow service: ->
const followToggle = async (userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(`${API_URL}follow/${userId}`, null, config);
    return response.data;
}

const userService = {
    getUserProfile,
    followToggle
};

export default userService;