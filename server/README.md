 This server serves as an endpoint to upload images from a Cloud Paint.
 It is written in javascript and uses the Koa middleware.
 In order for the server to work you need to have the following;
    1. Node.js and NPM.
    2. Installed dependencies:
        2.1 Koa
        2.2 Koa Static
        2.3 Koa Router
        2.4 Koa Multer
        2.5 Koa CORS
     You can install these dependencies by either running the command 'npm install' from the package.json
     or manually instaling them with the command: 'npm install koa koa-static @koa/router @koa/multer @koa/cors.'
 The server has basic functionalities for uploading and downloading files:
    It has two end-points for file upload
        1. uploadDirectory - every item that has been uploaded to the Cloud Paint gets saved here with the original file name.
        2. editedImages - every image that has been edited and the user wishes to send to the server gets saved here with the current time and original file name.
    The upload directory accept images through POST requests to http://localhost:2115/upload and the editedImages directory accepts images through http://localhost:2115/editedImages.
    Images can be download through a GET request to http://localhost:2115/download/:filename where :filename is the name of the file to be downloaded.