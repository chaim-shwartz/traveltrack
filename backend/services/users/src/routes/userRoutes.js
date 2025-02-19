const express = require('express');
const userController = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authenticateJWT');

const router = express.Router();
const upload = require('../middlewares/multer');
const authenticateServiceToken = require('../middlewares/authenticateServiceToken');

router.get('/details', authenticateJWT, userController.getUserDetails);
router.post('/update', authenticateJWT, upload.single('profilePic'), userController.updateUserDetails);
router.get('/google', userController.getUserByGoogleId);
router.post('/google', userController.createUserFromGoogle);
router.get('/validate-email/:email', authenticateServiceToken, userController.validateUserByEmail);
router.post('/bulk',authenticateServiceToken, userController.getPartUsers);


module.exports = router;
