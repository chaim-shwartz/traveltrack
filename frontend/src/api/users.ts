import axios from 'axios';
import { User } from '../types/userTypes';

const BASE_URL = 'http://localhost:5004/api/users'; // URL לשירות המשתמשים

/**
 * Get user details
 */
export const fetchUserDetails = async (): Promise<User> => {
    try {
        const response = await axios.get(`${BASE_URL}/details`, {
            withCredentials: true, // מאפשר שליחת Cookies
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

        // הוספת פרטי המשתמש ל-FormData
        Object.entries(userDetails).forEach(([key, value]) => {
            if (value && key !== 'profilePic') {
                formData.append(key, value.toString());
            }
        });

        // הוספת קובץ תמונה ל-FormData
        if (userDetails.profilePic) {
            formData.append('profilePic', userDetails.profilePic);
        }

        // שליחת בקשה לשרת
        await axios.post(`${BASE_URL}/update`, formData, {
            withCredentials: true, // מאפשר שליחת Cookies
            headers: {
                'Content-Type': 'multipart/form-data', // נדרש ל-FormData
            },
        });
    } catch (error) {
        console.error('Failed to update user details:', error);
        throw new Error('Failed to update user details');
    }
};