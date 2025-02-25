const express = require('express');
const { getTrips, addTrip, getTripById, deleteTrip, updateTrip, addUserToTrip, TripUsers, removeSharedUserFromTrip } = require('../controllers/tripsController');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

router.get('/', authenticateJWT, getTrips);
router.post('/', authenticateJWT, addTrip);
router.put('/:id', authenticateJWT, updateTrip);
router.get('/:id', authenticateJWT, getTripById);
router.delete('/:id', authenticateJWT, deleteTrip);

// הוספת משתמש לטיול
router.post('/:id/add-user',authenticateJWT, addUserToTrip);

// קבלת רשימת משתמשים בטיול
router.get('/:id/users',authenticateJWT, TripUsers);

// הסרת משתמש מטיול
router.delete('/:id/remove-user/:userId', authenticateJWT, removeSharedUserFromTrip);

module.exports = router;