const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
app.set("port", process.env.PORT || 3000);

// app.use(morgan("dev"));
app.use(morgan("combined"));
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

app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  next();
});

app.get("/", (req, res, next) => {
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
  res.send(`hello ${req.params.name} wildcard`);
});

app.get("/about", (req, res) => {
  res.send("hello express");
});

// app.get("*", (req, res) => {
//   res.send("Hello everybody");
// });

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  // console.log("익스프레스 서버 실행");
  console.log(app.get("port"), "번 포트에서 대기 중");
});
