// export async function fetchTrips() {
//     const response = await fetch('http://localhost:5000/api/trips', {
//         credentials: 'include',
//     });
//     if (!response.ok) throw new Error('Failed to fetch trips');
//     return response.json();
// }
// // api/trips.ts
// export const createTrip = async (trip: {
//     name: string;
//     budget: number;
//     startDate: string;
//     endDate: string;
//     image: string;
// }) => {
//     const response = await fetch('http://localhost:5000/api/trips', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(trip),
//     });
//     if (!response.ok) throw new Error('Failed to create trip');
//     return response.json();
// };


// export async function deleteTrip(id: number) {
//     const response = await fetch(`http://localhost:5000/api/trips/${id}`, {
//         method: 'DELETE',
//         credentials: 'include',
//     });
//     if (!response.ok) throw new Error('Failed to delete trip');
//     return response.json();
// }


// export const fetchTripDetails = async (tripId: number) => {
//     const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
//         credentials: 'include',
//     });
//     console.log(response);
    
//     if (!response.ok) throw new Error('Failed to fetch trip details');
//     return response.json();
// };


// for microservices
import axios from 'axios';

// Fetch all trips
export async function fetchTrips() {
    const response = await axios.get('http://localhost:5001/api/trips', {
        withCredentials: true, // Include cookies
    });
    return response.data;
}

// Create a new trip
export const createTrip = async (trip: {
    name: string;
    budget: number;
    startDate: string;
    endDate: string;
    image: string;
}) => {
    const response = await axios.post('http://localhost:5001/api/trips', trip, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    });
    return response.data;
};

// Update an existing trip
export const updateTrip = async (id: number, tripData: any) => {
    const response = await axios.put(`http://localhost:5001/api/trips/${id}`, tripData, {
        withCredentials: true,
    });
    return response.data;
};

// Delete a trip
export async function deleteTrip(id: number) {
    const response = await axios.delete(`http://localhost:5001/api/trips/${id}`, {
        withCredentials: true,
    });
    return response.data;
}

// Fetch details of a specific trip
export const fetchTripDetails = async (tripId: number) => {
    const response = await axios.get(`http://localhost:5001/api/trips/${tripId}`, {
        withCredentials: true,
    });    
    return response.data;
};