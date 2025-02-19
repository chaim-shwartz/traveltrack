const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const { Readable } = require('stream');

// יצירת חיבור GridFS
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // קביעת שם האוסף ב-GridFS
});

// העלאת קובץ ל-GridFS
async function uploadFile(file) {
    return new Promise((resolve, reject) => {
        const { buffer, originalname } = file;
        const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalname);

        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        const writeStream = gfs.createWriteStream({
            filename,
            content_type: file.mimetype,
        });

        readableStream.pipe(writeStream);

        writeStream.on('close', (file) => {
            resolve(file);
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });
}

// מחיקת קובץ לפי מזהה
async function deleteFile(fileId) {
    return new Promise((resolve, reject) => {
        gfs.remove({ _id: fileId, root: 'uploads' }, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

// קבלת קובץ לפי מזהה
async function getFile(fileId) {
    return new Promise((resolve, reject) => {
        gfs.files.findOne({ _id: mongoose.Types.ObjectId(fileId) }, (err, file) => {
            if (err || !file) return reject('File not found');
            resolve(file);
        });
    });
}

// יצירת Stream לקריאת קובץ
async function getFileStream(fileId) {
    const file = await getFile(fileId);
    return gfs.createReadStream({ _id: file._id });
}

module.exports = {
    uploadFile,
    deleteFile,
    getFile,
    getFileStream,
};