const express = require('express');
const { getTrips, addTrip, getTripById, deleteTrip, updateTrip, addUserToTrip, TripUsers, removeSharedUserFromTrip } = require('../controllers/tripsController');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

router.get('/', authenticateJWT, getTrips);
router.post('/', authenticateJWT, addTrip);
router.put('/:id', authenticateJWT, updateTrip);
router.get('/:id', authenticateJWT, getTripById);
router.delete('/:id', authenticateJWT, deleteTrip);

// Adding a user to the trip
router.post('/:id/add-user',authenticateJWT, addUserToTrip);

// Getting the list of users in the trip
router.get('/:id/users',authenticateJWT, TripUsers);

// Removing a user from the trip
router.delete('/:id/remove-user/:userId', authenticateJWT, removeSharedUserFromTrip);

module.exports = router;
