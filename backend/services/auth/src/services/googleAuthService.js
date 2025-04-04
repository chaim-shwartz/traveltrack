// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const jwt = require('jsonwebtoken');
// const knex = require('../config/knex');

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: '/auth/google/callback',
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 let user = await knex('users').where({ google_id: profile.id }).first();
//                 console.log(user);
                
//                 if (!user) {
//                     [user] = await knex('users')
//                         .insert({
//                             google_id: profile.id,
//                             email: profile.emails[0].value,
//                             name: profile.displayName,
//                             profile_pic: profile.photos[0].value,
//                             preferred_language: 'en',
//                             nickname: null,
//                         })
//                         .returning('*');
//                 }
//                 const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//                 done(null, { user, token });
//             } catch (error) {
//                 done(error, null);
//             }
//         }
//     )
// );

// module.exports = passport;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { generateToken } = require('../utils/jwtUtils');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {                
                const userServiceUrl = `${process.env.USERS_SERVICE_URL}/users/google`;
                
                // Try to fetch the user by Google ID
                let user;
                try {
                    const response = await axios.get(userServiceUrl, {
                        params: { googleId: profile.id },
                    });
                    user = response.data; 
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        const createResponse = await axios.post(userServiceUrl, {
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            name: profile.displayName,
                            profilePic: profile.photos[0].value,
                        });
                        user = createResponse.data;
                    } else {
                        throw error; 
                    }
                }                
                const token = generateToken({ id: user._id })
                // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                done(null, { user, token });
            } catch (error) {
                console.error('Error in Google authentication:', error);
                done(error, null);
            }
        }
    )
);

module.exports = passport;
