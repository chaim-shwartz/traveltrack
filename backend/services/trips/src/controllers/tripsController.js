const { produceMessage } = require('../services/kafkaProducer');
const {
    fetchTrips,
    createTrip,
    fetchTripById,
    removeTrip,
    updateTripById,
    getTripUserLink,
    createTripUserLink,
    getTripUsers,
    getUserIdByEmail,
    removeUserFromTrip,
    isAdminForTrip,
} = require('../services/tripsService');

const getTrips = async (req, res) => {
    try {
        const trips = await fetchTrips(req.user.id);
        res.status(200).json(trips);
    } catch (error) {
        console.error('Failed to fetch trips:', error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

const addTrip = async (req, res) => {
    const { name, budget, startDate, endDate, image, destination } = req.body;

    if (!name || !budget || budget > 99999999.99 || !image) {
        return res.status(400).json({ error: 'Invalid name, budget value, or image' });
    }

    try {
        const id = await createTrip(req.user.id, { name, budget, startDate, endDate, image, destination });
        res.status(201).json({ id });
    } catch (error) {
        console.error('Failed to add trip:', error);
        res.status(500).json({ error: 'Failed to add trip' });
    }
};

const updateTrip = async (req, res) => {
    const { id } = req.params;
    const { name, budget, startDate, endDate, destination, image } = req.body;

    try {

        const updatedRows = await updateTripById(id, { name, budget, startDate, endDate, image, destination });

        if (updatedRows) {
            res.status(200).json({ message: 'Trip updated successfully' });
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ error: 'Failed to update trip' });
    }
};

const getTripById = async (req, res) => {
    try {
        const trip = await fetchTripById(req.user.id, req.params.id);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.status(200).json(trip);
    } catch (error) {
        console.error('Failed to fetch trip details:', error);
        res.status(500).json({ error: 'Failed to fetch trip details' });
    }
};

const deleteTrip = async (req, res) => {
    try {
        await removeTrip(req.user.id, req.params.id);
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Failed to delete trip:', error);
        res.status(500).json({ error: 'Failed to delete trip' });
    }
};


// הוספת משתמש לטיול
const addUserToTrip = async (req, res) => {    
    const { id: tripId } = req.params; // מזהה הטיול
    const { email } = req.body; // מזהה המשתמש

    try {
        // Check if the user is an admin
        const isAdmin = await isAdminForTrip(req.user.id, tripId);
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admins can add users to the trip' });
        }

        const userId = await getUserIdByEmail(email)
        if (!userId) {
            return res.status(404).json({ message: 'there is no user with this email' });
        }
        // בדיקה אם המשתמש כבר מקושר לטיול
        const existing = await getTripUserLink(userId, tripId)
        if (existing) {            
            return res.status(200).json({ message: 'User already associated with the trip' });
        }
        // הוספת הקשר לטבלה
        await createTripUserLink(tripId, userId);
        
        // send message to kafka
        const trip = await fetchTripById(req.user.id, tripId);
        await produceMessage("trip-user-added", {
            tripId,
            tripName: trip.name,
            userId,
            addedBy: req.user.id,
        });

        res.status(200).json({ message: 'User added to the trip successfully' });
    } catch (error) {
        console.error('Error adding user to trip:', error);
        res.status(500).json({ message: 'Failed to add user to the trip' });
    }
};

const TripUsers = async (req, res) => {
    const { id: tripId } = req.params;

    try {
        // שאילתת המשתמשים בטיול
        const users = await getTripUsers(tripId)
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching trip users:', error);
        res.status(500).json({ message: 'Failed to fetch users for the trip' });
    }
};

const removeSharedUserFromTrip = async (req, res) => {
    const { id: tripId, userId } = req.params;
    
    try {
        // Check if the user is an admin
        const isAdmin = await isAdminForTrip(req.user.id, tripId);
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admins can remove users from the trip' });
        }

        await removeUserFromTrip(tripId, userId);
        res.status(200).json({ message: 'User removed from the trip successfully' });
    } catch (error) {
        if (error.message === 'Cannot remove an admin from the trip') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error removing user from trip:', error);
        res.status(500).json({ message: 'Failed to remove user from the trip' });
    }
};

module.exports = { getTrips, addTrip, updateTrip, getTripById, deleteTrip, addUserToTrip, TripUsers, removeSharedUserFromTrip };