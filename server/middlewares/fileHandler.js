const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // Save the files to 'uploads' directory( the problem now is even if signup is unsucessful the image is 
                                //getting stored in uploads folder which will create memory overhead ithink work on this later)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

// Middleware to Handle File Cleanup
const cleanUpFile = (req, res, next) => {
    if (res.locals.signupSuccess === false && req.file) {
        const filePath = path.join(__dirname, '../uploads', req.file.filename);
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
    next();
};

module.exports = { upload, cleanUpFile };
