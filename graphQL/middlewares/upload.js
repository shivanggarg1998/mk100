import multer from 'multer';
import uuid from 'uuid/v1';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';

let credentials = new AWS.SharedIniFileCredentials({
    profile: 'mk100'
});
AWS.config.credentials = credentials;

var s3 = new AWS.S3();
export const uploadsToS3 = (files) => {
    console.log(files);
    return new Promise((resolve, reject) => {
        let temp = [];
        if (files.length === 0 || !files) {
            resolve([])
        }

        files.map((item) => {
            // console.log(item);
            item.then((data) => {
                var params = {
                    Bucket: 'sellers.mk100',
                    Key: uuid() + data.filename,
                    Body: data.stream,
                    ACL: 'public-read'
                };
                console.log("Uploading");


                s3.upload(params, function (err, data) {
                    if (err) {
                        console.log('error in callback');
                        reject(err);
                    }
                    console.log('Success');
                    temp.push(data.Location);
                    if (temp.length === files.length) {
                        resolve(temp);
                    }

                });
            });

        });


    });


};

export const uploadToS3 = (filename, stream, isEdit) => {
    var tempname = (!isEdit || isEdit == undefined) ? uuid() + filename : filename;
    var params = {
        Bucket: 'sellers.mk100',
        Key: tempname,
        Body: stream,
        ACL: 'public-read'
    };
    var url;
    return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
            if (err) {
                console.log('error in callback');
                console.log(err);
                reject(err);
            }
            console.log('success');
            resolve(data.Location);
        });
    });


};

