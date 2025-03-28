// // api/expenses.ts
// export const fetchExpenses = async (tripId: number) => {
//     const response = await fetch(`http://localhost:5000/api/expenses/trip/${tripId}`, {
//         credentials: 'include',
//     });
//     if (!response.ok) {
//         throw new Error('Failed to fetch expenses');
//     }
//     return response.json();
// };

// export const addExpense = async (expense: {
//     tripId: number;
//     categoryId: number;
//     amount: number;
//     description?: string;
//     date: string;
// }) => {    
//     const response = await fetch(`http://localhost:5000/api/expenses`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(expense),
//     });
//     if (!response.ok) {
//         throw new Error('Failed to add expense');
//     }
//     return response.json();
// };

// export const updateExpense = async (expense: {
//     id: number;
//     tripId: number;
//     categoryId?: number;
//     amount: number;
//     description?: string;
//     date: string;
// }) => {
//     const response = await fetch(`http://localhost:5000/api/expenses/${expense.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(expense),
//     });
//     if (!response.ok) {
//         throw new Error('Failed to update expense');
//     }
//     return response.json();
// };

// export const deleteExpense = async (id: number) => {
//     const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
//         method: 'DELETE',
//         credentials: 'include',
//     });
//     if (!response.ok) {
//         throw new Error('Failed to delete expense');
//     }
// };




// for microservices
import axios from 'axios';

const baseURL = 'http://localhost:5002/api/expenses';

export const fetchExpenses = async (tripId: number) => {
    try {
        const response = await axios.get(`${baseURL}/trip/${tripId}`, {
            withCredentials: true, // Allows sending cookies
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch expenses:', error);
        throw new Error('Failed to fetch expenses');
    }
};

export const addExpense = async (expense: {
    tripId: number;
    categoryId: number;
    amount: number;
    description?: string;
    date: string;
}) => {
    try {
        const response = await axios.post(baseURL, expense, {
            withCredentials: true, // Allows sending cookies
        });
        return response.data;
    } catch (error) {
        console.error('Failed to add expense:', error);
        throw new Error('Failed to add expense');
    }
};

export const updateExpense = async (expense: {
    id: number;
    tripId: number;
    categoryId?: number;
    amount: number;
    description?: string;
    date: string;
}) => {
    try {
        const response = await axios.put(`${baseURL}/${expense.id}`, expense, {
            withCredentials: true, // Allows sending cookies
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update expense:', error);
        throw new Error('Failed to update expense');
    }
};

export const deleteExpense = async (id: number) => {
    try {
        await axios.delete(`${baseURL}/${id}`, {
            withCredentials: true, // Allows sending cookies
        });
    } catch (error) {
        console.error('Failed to delete expense:', error);
        throw new Error('Failed to delete expense');
    }
};
