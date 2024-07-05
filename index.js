const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const app = express();
const s3 = new AWS.S3({
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
    region: 'YOUR_REGION'
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'YOUR_BUCKET_NAME',
        acl: 'public-read',
        key: function (req, file, cb) {
            const folderName = req.body.foldername || 'default-folder';
            const fileName = `${folderName}/${Date.now().toString()}_${path.basename(file.originalname)}`;
            cb(null, fileName);
        }
    })
});

app.post('/upload', upload.single('image'), (req, res) => {
    const tag = req.body.tag;
    const folderName = req.body.foldername || 'default-folder';
    const imageUrl = req.file.location;

    const response = {
        tag: tag,
        folderName: folderName,
        imageUrl: imageUrl
    };

    res.json(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
