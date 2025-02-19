// const knex = require('../config/knex');

// const userService = {
//     async getUserById(userId) {        
//         return knex('users').where({ id: userId }).first()
//         .select(
//             'id',
//             'email',
//             'name',
//             'nickname',
//             'profile_pic as profilePic',
//             'preferred_language as preferredLanguage',
//             'created_at as createdAt',
//             'updated_at as updatedAt'
//         );
//     },
//     async updateUser(userId, updates) {
//         return knex('users').where({ id: userId }).update({
//             nickname: updates.nickname,
//             preferred_language: updates.preferredLanguage,
//             profile_pic: updates.profilePic,
//         });
//     },
//     async getUserByGoogleId(googleId) {
//         return knex('users').where({ google_id: googleId }).first();
//     },
//     async createUserFromGoogle({ googleId, email, name, profilePic }) {
//         const [user] = await knex('users')
//             .insert({
//                 google_id: googleId,
//                 email,
//                 name,
//                 profile_pic: profilePic,
//                 preferred_language: 'en',
//                 nickname: null,
//             })
//             .returning('*');
//         return user;
//     },
// };

// module.exports = userService;




const User = require('../models/userModel');

const userService = {
    async getUserById(userId) {
        return await User.findById(userId).exec();
    },
    async getUserByEmail(userEmail) {
        return await User.findOne({ email: userEmail });
    },
    async getPartUserById(userIds) {
        return await User.find({ _id: { $in: userIds } }).select('email name _id');
    },
    async updateUser(userId, updates) {
        return await User.findByIdAndUpdate(userId, updates, { new: true }).exec();
    },
    async getUserByGoogleId(googleId) {
        return await User.findOne({ googleId }).exec();
    },
    async createUserFromGoogle({ googleId, email, name, profilePic }) {
        return await User.create({ googleId, email, name, profilePic });
    },
};

module.exports = userService;