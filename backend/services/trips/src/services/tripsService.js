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
            'trip_users.role' // Adding role
        );
};

const createTrip = async (userId, tripData) => {
    // Creating the trip in the trips table
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
    // Adding the creator to the trip_users table with role of admin
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
        .join('trip_users', 'trips.id', '=', 'trip_users.trip_id') // Checking connection
        .where('trips.id', tripId) // Trip ID
        .andWhere('trip_users.user_id', userId) // User ID
        .select(
            'trips.id',
            'trips.name',
            'trips.budget',
            'trips.start_date as startDate',
            'trips.end_date as endDate',
            'trips.image as image',
            'trips.destination',
            'trip_users.role' // Indicates the user's role in the trip
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
        // Fetching users from the linking table
        const tripUsers = await knex('trip_users')
            .where({ trip_id: tripId })
            .select('user_id as userId', 'role');        
        // Fetching user_id
        const userIds = tripUsers.map((user) => user.userId);
        
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
        // Merging the information
        return tripUsers.map((tripUser) => ({
            ...tripUser,
            ...usersData.find((user) => user._id === tripUser.userId),
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

const removeUserFromTrip = async (tripId, userId) => {
    const user = await knex('trip_users')
        .where({ trip_id: tripId, user_id: userId })
        .first();

        if (user.role === 'admin') {
            throw new Error('Cannot remove an admin from the trip');
        }


    return await knex('trip_users').where({ trip_id: tripId, user_id: userId }).del();
};

const isAdminForTrip = async (userId, tripId) => {
    const user = await knex('trip_users')
        .where({ trip_id: tripId, user_id: userId, role: 'admin' })
        .first();
    return !!user;
};

module.exports = { 
    fetchTrips, 
    createTrip, 
    fetchTripById, 
    removeTrip, 
    updateTripById, 
    getTripUserLink, 
    createTripUserLink, 
    getTripUsers, 
    getServiceToken, 
    getUserIdByEmail,
    removeUserFromTrip,
    isAdminForTrip,
};
