const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const indexRouter = require("./routes");
const userRouter = require("./routes/user");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
// app.use(morgan("combined"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);

app.use("/", indexRouter);
app.use("/user", userRouter);

// app.use((req, res, next) => {
//   res.status(404).send("Not Found");
// });

const bodyParser = require("body-parser");
app.use(bodyParser.raw());
app.use(bodyParser.text());

const multer = require("multer");
const fs = require("fs");

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "multipart.html"));
});

// 파일 하나만 보낼 때.
// app.post("/upload", upload.single("image"), (req, res) => {
//   console.log(req.file, req.body);
//   res.send("ok");
// });

// 파일 여러개
// app.post("/upload", upload.array("many"), (req, res) => {
//   console.log(req.files, req.body);
//   res.send("ok");
// });

app.post(
  "/upload",
  upload.fields([{ name: "image1" }, { name: "image2" }]),
  (req, res) => {
    console.log(req.files, req.body);
    res.send("ok");
  }
);

// app.post("/uploads", upload.none(), (req, res) => {
//   console.log(req.body);
//   res.send("ok");
// });

app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  next();
});

app.get("/", (req, res, next) => {
  req.session.id = "hello";
  res.sendFile(path.join(__dirname, "./index.html"));
  console.log("GET / 요청에서만 실행됩니다.");
});

app.post("/", (req, res) => {
  res.send("hello exporess");
});

app.get("/category/Javascript", (req, res) => {
  res.send("hello Javascript");
});

app.get("/category/:name", (req, res) => {
  console.dir(req.query, { colors: true, depth: 2 });
  res.send(`hello ${req.params.name} wildcard`);
});

app.get("/about", (req, res, next) => {
  res.send("hello about");
  next();
});

app.get("*", (req, res) => {
  // res.send("Hello everybody");
  console.log("this is * wildcard");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  // console.log("익스프레스 서버 실행");
  console.log(app.get("port"), "번 포트에서 대기 중");
});
