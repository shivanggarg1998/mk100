import multer from 'multer';
import uuid from 'uuid/v1';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';

let credentials = new AWS.SharedIniFileCredentials({
    profile: 'mk100'
});
AWS.config.credentials = credentials;

var s3 = new AWS.S3();

var upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'sellers.mk100',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, uuid() + file.originalname);
        }
    })
});

let fileUploader = upload.single('file');

export default function saveToS3(router) {
    router.post('/upload', function (req, res, next) {

        fileUploader(req, res, function (err) {
            if (err) {
                res.json({
                    message: "Unable to Upload Image",
                    success: false,
                });
            } else {
                console.log(req.file);
                res.json({
                    url: req.file.location,
                    success: true
                });
            }
        });
    });

    return router;
}

