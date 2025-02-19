const knex = require('../config/knex');
const axios = require('axios');
const fetchTrips = async (userId) => {
    return await knex('trips')
        .join('trip_users', 'trips.id', '=', 'trip_users.trip_id')
        .where('trip_users.user_id', userId)
        .select(
            'trips.id',
            'trips.name',
            'trips.budget',
            'trips.start_date as startDate',
            'trips.end_date as endDate',
            'trips.image as image',
            'trips.destination',
            'trip_users.role' // הוספת role
        );
};

const createTrip = async (userId, tripData) => {
    // יצירת הטיול בטבלת trips
    const [trip] = await knex('trips')
        .insert({
            name: tripData.name,
            budget: tripData.budget,
            start_date: tripData.startDate,
            end_date: tripData.endDate,
            image: tripData.image,
            destination: tripData.destination,
        })
        .returning('id');
    // הוספת היוצר לטבלת trip_users עם role של admin
    await knex('trip_users').insert({
        trip_id: trip.id,
        user_id: userId,
        role: 'admin',
    });

    return trip;
};
const updateTripById = async (tripId, tripData) => {
    const updatedRows = await knex('trips').where({ id: tripId }).update({
        name: tripData.name,
        budget: tripData.budget,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        image: tripData.image,
        destination: tripData.destination,
    });
    return updatedRows;
};

const fetchTripById = async (userId, tripId) => {
    return knex('trips')
        .join('trip_users', 'trips.id', '=', 'trip_users.trip_id') // בדיקת קשר
        .where('trips.id', tripId) // מזהה הטיול
        .andWhere('trip_users.user_id', userId) // מזהה המשתמש
        .select(
            'trips.id',
            'trips.name',
            'trips.budget',
            'trips.start_date as startDate',
            'trips.end_date as endDate',
            'trips.image as image',
            'trips.destination',
            'trip_users.role' // מציין את התפקיד של המשתמש בטיול
        )
        .first(); // מחזיר רק רשומה אחת
};

const removeTrip = async (userId, tripId) => {
    // Check if the user is an admin
    const isAdmin = await knex('trip_users')
        .where({ trip_id: tripId, user_id: userId, role: 'admin' })
        .first();

    if (!isAdmin) {
        throw new Error('Only admins can delete a trip');
    }

    // Delete all links from trip_users
    await knex('trip_users').where({ trip_id: tripId }).del();

    // Delete the trip from trips
    return await knex('trips').where({ id: tripId }).del();
};

const getTripUserLink = async (userId, tripId) => {
    return await knex('trip_users').where({ trip_id: tripId, user_id: userId }).first();
};
const createTripUserLink = async (tripId, userId) => {
    return await knex('trip_users').insert({
        trip_id: tripId,
        user_id: userId,
        role: 'user',
    });
};
const getTripUsers = async (tripId) => {
    try {
        // שליפת המשתמשים מהטבלה המקשרת
        const tripUsers = await knex('trip_users')
            .where({ trip_id: tripId })
            .select('user_id', 'role');        
        // שליפת user_id
        const userIds = tripUsers.map((user) => user.user_id);
        
        if (userIds.length === 0) {
            return [];
        }

        // שליחת בקשה ל-Users Service
        const serviceToken = await getServiceToken();
        const response = await axios.post(
            `${process.env.USERS_SERVICE_URL}/users/bulk`,
            { userIds },
            {
                headers: { Authorization: `Bearer ${serviceToken}` },
            }
        );

        const usersData = response.data; // נתוני המשתמשים מ-Users Service        
        // שילוב המידע
        return tripUsers.map((tripUser) => ({
            ...tripUser,
            ...usersData.find((user) => user._id === tripUser.user_id),
        }));
    } catch (error) {
        console.error('Failed to fetch trip users:', error.message);
        throw new Error('Failed to fetch trip users');
    }
};
const getUserIdByEmail = async (email) => {
    const serviceToken = await getServiceToken();
    try {
        const userResponse = await axios.get(
            `${process.env.USERS_SERVICE_URL}/users/validate-email/${email}`, {
            headers: { Authorization: `Bearer ${serviceToken}` },
        });
        return userResponse.data.userId;
    } catch (error) {
        console.error('Failed to get userId by email:', error.message);
    }

};


const getServiceToken = async () => {
    try {

        const { data } = await axios.post(`${process.env.AUTH_SERVICE_URL}/service-token`, {
            serviceName: 'trips-service',
        }, {
            headers: {
                'x-api-key': process.env.SERVICE_API_KEY, // Include the API key
            },
        });
        return data.token;
    } catch (error) {
        console.error('Failed to fetch service token:', error.message);
        throw new Error('Failed to fetch service token');
    }
};


module.exports = { fetchTrips, createTrip, fetchTripById, removeTrip, updateTripById, getTripUserLink, createTripUserLink, getTripUsers, getServiceToken, getUserIdByEmail };