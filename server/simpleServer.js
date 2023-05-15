const Path = require("path"); // file paths
const Koa = require("koa"); //framework
const serve = require("koa-static");
const Router = require("@koa/router"); // routing and handling
const multer = require("@koa/multer"); // file upload
const cors = require("@koa/cors"); // requests

const app = new Koa();
const router = new Router();

const serverPort = 2115;

const uploadDirectory = Path.join(__dirname, "/uploadFiles");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.get("/", async (context) => {
  context.body = "File upload server!";
});


router.post("/upload", upload.single("file"), (context) => {
  context.body = {
    message: `file ${context.request.file.filename} has saved on the server`,
    url: `http://localhost:${serverPort}/${context.request.file.originalname}`,
  };
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(uploadDirectory));

app.listen(serverPort, () => {
  console.log(`app starting at port ${serverPort}`);
});
