const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passort");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config();
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8010);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

app.use(morgan("dev"));
