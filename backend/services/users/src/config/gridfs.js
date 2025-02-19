const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const initGridFS = () => {
    const connection = mongoose.connection;
    connection.once('open', () => {
        gfs = Grid(connection.db, mongoose.mongo);
        gfs.collection('profiles');
        console.log('GridFS initialized');
    });
};

const getGridFS = () => gfs;

module.exports = { initGridFS, getGridFS };