const Path = require("path"); // file paths
const Koa = require("koa"); //framework
const serve = require("koa-static"); // access to static files through url
const Router = require("@koa/router"); // routing and handling
const multer = require("@koa/multer"); // disk storage engine 
const cors = require("@koa/cors"); // requests

const app = new Koa();
const router = new Router();
const serverPort = 2115;
const uploadDirectory = Path.join(__dirname, "/uploadFiles");

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (_req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
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

router.post("/upload", upload.single("file"), (context) => {
  context.body = {
    message: `file ${context.request.file.filename} has been saved on the server`,
    url: `http://localhost:${serverPort}/${context.request.file.originalname}`,
  };
});

// router.post("/upload", upload.single("file"), (context) => {
//   const response = {
//     success: false,
//     message: ""
//   };

//   if (context.request.file) {
//     response.success = true;
//     response.message = `File ${context.request.file.filename} has been saved on the server`;
//   } else {
//     response.message = "File upload failed";
//   }

//   context.body = response;
// });

const fs = require("fs");

router.get("/download/:filename", async (context) => {
  const { filename } = context.params;

  const editedImagePath = Path.join(uploadDirectory, filename);

  if (fs.existsSync(editedImagePath)) {
    context.set("Content-disposition", `attachment; filename=${filename}`);
    context.type = "image/png";
    context.body = fs.createReadStream(editedImagePath);
  } else {
    context.status = 404;
    context.body = "File not found";
  }
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(uploadDirectory));

app.listen(serverPort, () => {
  console.log(`app starting at port ${serverPort}`);
});
