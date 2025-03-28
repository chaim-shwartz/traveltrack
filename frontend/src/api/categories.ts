// export const fetchCategories = async () => {
//     const response = await fetch('http://localhost:5000/api/categories', {
//         credentials: 'include',
//     });
//     if (!response.ok) {
//         throw new Error('Failed to fetch categories');
//     }
//     return response.json();
// };

// export const addCategory = async (name: string) => {
//     const response = await fetch('http://localhost:5000/api/categories', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ name }),
//     });
//     if (!response.ok) {
//         throw new Error('Failed to add category');
//     }
//     return response.json();
// };






import axios from 'axios';

const baseURL = 'http://localhost:5003/api/categories';

export const fetchCategories = async () => {
    try {
        const response = await axios.get(baseURL, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error('Failed to fetch categories');
    }
};

export const addCategory = async (name: string) => {
    try {
        const response = await axios.post(
            baseURL,
            { name },
            {
                withCredentials: true, // Allows sending cookies
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to add category:', error);
        throw new Error('Failed to add category');
    }
};
