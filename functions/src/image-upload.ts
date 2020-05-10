
import * as functions from 'firebase-functions';
const path = require("path");
const os = require("os");
const mkdirp = require('mkdirp-promise');
const spawn = require('child-process-promise').spawn;
const rimraf = require("rimraf");
import { firestore } from './init';


const { Storage } = require('@google-cloud/storage');

const gcs = new Storage();


export const resizeThumbnail = functions.storage.object()
    .onFinalize(async (object, context) => {

        const fileFullPath = object.name || '',
            contentType = object.contentType || '',
            fileDir = path.dirname(fileFullPath),
            fileName = path.basename(fileFullPath),
            tempLocalDir = path.join(os.tmpdir(), fileDir);

        const frags = fileFullPath.split('/'),
            userId = frags[1];


        console.log("Thumbnail generation started: ", fileFullPath, fileFullPath, fileName);
        console.log('fileDir:', fileDir);
        console.log('fileName:', fileName);
        console.log('contentType:', contentType);

        if (!contentType.startsWith("image/") || fileName.startsWith("thumb_")) {
            console.log("Exiting image processing.");
            return null;
        }

        // Download the original file uploaded by the user
        await mkdirp(tempLocalDir);

        const bucket = gcs.bucket(object.bucket);


        const originalImageFile = bucket.file(fileFullPath);

        const tempLocalFile = path.join(os.tmpdir(), fileFullPath);

        console.log('Downloading image to: ', tempLocalFile);

        await originalImageFile.download({ destination: tempLocalFile });




        // Generate a thumbnail using ImageMagick

        const outputFilePath = path.join(fileDir, 'thumb_' + fileName);

        const outputFile = path.join(os.tmpdir(), outputFilePath);

        console.log('Generating a thumbnail to:', outputFile);

        await spawn('convert', [tempLocalFile, '-thumbnail', '510x287 >', outputFile],
            { capture: ['stdout', 'stderr'] });

        // Upload the Thumbnail to storage

        const metadata = {
            contentType: object.contentType,
            cacheControl: 'public,max-age=2592000, s-maxage=2592000'
        };

        console.log('Uploading the thumbnail to storage:', outputFile, outputFilePath);

        const uploadedFiles = await bucket.upload(outputFile, { destination: outputFilePath, metadata });

        // delete local files to avoid filling up the file system over time
        rimraf.sync(tempLocalDir);

        //delete other files

        await bucket.getFiles({prefix:'profilePhotos/'+userId}).then((data: any) => {

            const files = data[0];
            files.forEach((file: any) => {
                    if (!file) return;
                    if (file.name == outputFilePath) return;
                    console.log('files deleting:::::', file.name);
                    file.delete();
                })

        });


        // create link to uploaded file
        const thumbnail = uploadedFiles[0];

        const url = await thumbnail.getSignedUrl({ action: 'read', expires: new Date(3000, 0, 1) });

        console.log('Generated signed url:', url);

        // save thumbnail link in database



        console.log('saving url to database: ' + userId);

       return firestore.doc(`users/${userId}`).update({ photoURL: url });

    })
