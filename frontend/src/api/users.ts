import axios from 'axios';
import { User } from '../types/userTypes';

const BASE_URL = 'http://localhost:5004/api/users'; // URL for the user service

/**
 * Get user details
 */
export const fetchUserDetails = async (): Promise<User> => {
    try {
        const response = await axios.get(`${BASE_URL}/details`, {
            withCredentials: true, // Allows sending cookies
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user details:', error);
        throw new Error('Failed to fetch user details');
    }
};

/**
 * Update user details
 */
export const updateUserDetails = async (userDetails: User): Promise<void> => {
    try {
        const formData = new FormData();

        // Adding user details to FormData
        Object.entries(userDetails).forEach(([key, value]) => {
            if (value && key !== 'profilePic') {
                formData.append(key, value.toString());
            }
        });

        if (userDetails.profilePic) {
            formData.append('profilePic', userDetails.profilePic);
        }

        // Sending request to the server
        await axios.post(`${BASE_URL}/update`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Failed to update user details:', error);
        throw new Error('Failed to update user details');
    }
};
