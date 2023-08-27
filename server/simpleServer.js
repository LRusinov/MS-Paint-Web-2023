const Path = require("path"); // file paths
const Koa = require("koa"); //framework
const serve = require("koa-static"); // access to static files through url
const Router = require("@koa/router"); // routing and handling
const multer = require("@koa/multer"); // disk storage engine 
const cors = require("@koa/cors"); // requests
const fs = require("fs"); //file image

const app = new Koa();
const router = new Router();
const serverPort = 2115;
const uploadDirectory = Path.join(__dirname, "/uploadDirectory");
const editedImagesDirectory = Path.join(__dirname, "/editedImages");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

if(!fs.existsSync(editedImagesDirectory)){
  fs.mkdirSync(editedImagesDirectory);
}

const uploadStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (_req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const editedImagesStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, editedImagesDirectory);
  },
  filename: function (_req, file, cb) {
    const editedFileName = `${Date.now()}_${file.originalname}`;
    cb(null, editedFileName);
  },
});

const imageUpload = multer({
  storage: uploadStorage,
  fileFilter: function (_req, file, cb) {
    const notAllowedTypes = ["image/gif", "image/webp"];
    if (file.mimetype.startsWith("image/") && !notAllowedTypes.includes(file.mimetype)) {
      cb(null, true);
    }
    else {
      cb(new Error("File type is not allowed"), false)
    }
  }
});

const editedImagesUpload = multer({
  storage: editedImagesStorage,
  fileFilter: function (_req, file, cb) {
    const notAllowedTypes = ["image/gif", "image/webp"];
    if (file.mimetype.startsWith("image/") && !notAllowedTypes.includes(file.mimetype)) {
      cb(null, true);
    }
    else {
      cb(new Error("File type is not allowed"), false)
    }
  }
});

router.post("/upload", imageUpload.single("file"), (context) => { //POST for uploading baseImage uploaded to browser from user to the server
  context.body = {
    message: `file ${context.request.file.filename} has been saved on the server`,
    url: context.request.file.filename,
  };
});

router.post("/editedImages", editedImagesUpload.single("file"), (context) => { //POST to upload editedImage to the server
  context.body = {
    message: `file ${context.request.file.filename} has been saved on the server`,
    url: context.request.file.filename,
  };
});

router.get("/download/:filename", async (context) => {
  const { filename } = context.params;
  const editedImagePath = Path.join(editedImagesDirectory, filename);

  if (fs.existsSync(editedImagePath)) {
    context.set("Content-disposition", `attachment; filename=${filename}`);
    context.type = "image/png";
    context.body = fs.createReadStream(editedImagePath);
  } else {
    context.status = 404;
    context.body = "File not found";
  }
});

router.get('/savedImagesNames', (ctx) => {
  const imageNames = getImageNames(editedImagesDirectory);
  //console.log(imageNames);
  //console.log(JSON.stringify(imageNames));
  ctx.response.type = 'application/json';
  ctx.response.body = JSON.stringify(imageNames);
});

router.get('/editedImages/:imageName', async (ctx, next) => {
  const imageName = ctx.params.imageName;

  const files = fs.readdirSync(editedImagesDirectory);
  

  if (files.includes(imageName)) {
    try {
      console.log ("oh shit");
      const imageBuffer = fs.readFileSync(editedImagesDirectory + '\\' + imageName);
      const base64Image = imageBuffer.toString('base64');
      
      ctx.response.type = 'text/plain';
      ctx.response.body = base64Image;
    } catch (error) {
      console.log(error);
      ctx.response.status = 500;
    }
  }
})

function getImageNames(directory) {
  const imageNames = [];

  try {
      const files = fs.readdirSync(directory);
      files.forEach((file) => {
          imageNames.push(file);
      });
  } catch (error) {
      console.error('Error reading directory:', error);
  }

  return imageNames;
}

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(uploadDirectory));
app.use(serve(editedImagesDirectory))

app.listen(serverPort, () => {
  console.log(`Server is working on port ${serverPort}, waiting for image upload.`);
});
