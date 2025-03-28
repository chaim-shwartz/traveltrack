const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profilePic: { type: String, required: true }, // String instead of ObjectId
    preferredLanguage: { type: String, default: 'en' },
    nickname: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
