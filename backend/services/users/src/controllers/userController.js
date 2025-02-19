const userService = require('../services/userService');

const userController = {

    // async getUserDetails(req, res) {
    //     try {            
    //         const user = await userService.getUserById(req.user.id);
    //         if (!user) {                
    //             return res.status(404).json({ error: 'User not found' });
    //         }
    //         res.status(200).json({ user });
    //     } catch (error) {
    //         console.error('Error fetching user details:', error);
    //         res.status(500).json({ error: 'Failed to fetch user details' });
    //     }
    // },
    // async updateUserDetails(req, res) {
    //     const updates = req.body;  
    //     console.log(updates);

    //     try {
    //         await userService.updateUser(req.user.id, updates);
    //         res.status(200).json({ message: 'User details updated successfully' });
    //     } catch (error) {
    //         console.error('Error updating user details:', error);
    //         res.status(500).json({ error: 'Failed to update user details' });
    //     }
    // },
    async getUserDetails(req, res) {
        try {
            const user = await userService.getUserById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).json({ error: 'Failed to fetch user details' });
        }
    },
    async updateUserDetails(req, res) {
        try {
            const updates = req.body;

            const updatedUser = await userService.updateUser(req.user.id, updates);
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user details:', error);
            res.status(500).json({ error: 'Failed to update user details' });
        }
    },

    async getUserByGoogleId(req, res) {
        const { googleId } = req.query;
        if (!googleId) {
            return res.status(400).json({ error: 'Google ID is required' });
        }

        try {
            const user = await userService.getUserByGoogleId(googleId);
            if (!user) {
                return res.status(404).json(null); // החזרת 404 אם המשתמש לא נמצא
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    },

    async createUserFromGoogle(req, res) {
        const { googleId, email, name, profilePic } = req.body;
        if (!googleId || !email || !name || !profilePic) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const user = await userService.createUserFromGoogle({ googleId, email, name, profilePic });
            res.status(201).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    },

    // אימות משתמש לפי Email
    async validateUserByEmail(req, res) {
        const { email } = req.params;
        console.log(email);

        try {
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ userId: user._id, email: user.email });
        } catch (error) {
            console.error('Error validating user:', error);
            res.status(500).json({ message: 'Failed to validate user' });
        }
    },
    async getPartUsers(req, res) {
        const { userIds } = req.body;        
        try {
            // שליפת משתמשים לפי IDs            
            const users = await userService.getPartUserById(userIds)            
            res.status(200).json(users);
        } catch (error) {
            console.error('Failed to fetch users by IDs:', error);
            res.status(500).json({ message: 'Failed to fetch users' });
        }
    }
};

module.exports = userController;


// const userService = require('../services/userService');
// const multer = require('multer');
// const upload = multer();

// const userController = {
//     async getUserDetails(req, res) {
//         try {
//             const user = await userService.getUserById(req.user.id);
//             if (!user) {
//                 return res.status(404).json({ error: 'User not found' });
//             }
//             res.status(200).json({ user });
//         } catch (error) {
//             console.error('Error fetching user details:', error);
//             res.status(500).json({ error: 'Failed to fetch user details' });
//         }
//     },

//     // async updateUserDetails(req, res) {
//     //     const updates = req.body;
//     //     try {
//     //         const updatedUser = await userService.updateUser(req.user.id, updates);
//     //         res.status(200).json(updatedUser);
//     //     } catch (error) {
//     //         console.error('Error updating user details:', error);
//     //         res.status(500).json({ error: 'Failed to update user details' });
//     //     }
//     // },
//     async updateUserDetails(req, res) {
//         const updates = req.body;
//         if (req.file) {
//             updates.profilePic = req.file.buffer.toString('base64'); // המרה ל-Base64
//         }
//         try {
//             const updatedUser = await userService.updateUser(req.user.id, updates);
//             res.status(200).json(updatedUser);
//         } catch (error) {
//             console.error('Error updating user details:', error);
//             res.status(500).json({ error: 'Failed to update user details' });
//         }
//     },

//     async getUserByGoogleId(req, res) {
//         const { googleId } = req.query;
//         if (!googleId) {
//             return res.status(400).json({ error: 'Google ID is required' });
//         }

//         try {
//             const user = await userService.getUserByGoogleId(googleId);
//             if (!user) {
//                 return res.status(404).json(null);
//             }
//             res.status(200).json(user);
//         } catch (error) {
//             console.error('Error fetching user:', error);
//             res.status(500).json({ error: 'Failed to fetch user' });
//         }
//     },
//     async createUserFromGoogle(req, res) {
//         const { googleId, email, name, profilePic } = req.body;
//         try {
//             const user = await userService.createUser({ googleId, email, name, profilePic });
//             res.status(201).json(user);
//         } catch (error) {
//             console.error('Error creating user:', error);
//             res.status(500).json({ error: 'Failed to create user' });
//         }
//     },
// };

// module.exports = userController;