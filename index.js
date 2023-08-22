const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
require("dotenv").config();
require("./config/passport"); // 使用require可自動執行程式碼（Module Wrapper）
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

mongoose
  // .connect("mongodb://localhost:27017/exampleDB")
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.plq2nyf.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("成功連結mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

// 設定Middlewares及排版引擎
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(flash());
app.use((req, res, next) => {
  // res.locals設定的屬性，可以在ejs中使用(message.ejs)
  res.locals.success_msg = req.flash("successmsg");
  res.locals.error_msg = req.flash("errormsg");
  res.locals.error = req.flash("error");
  next();
});

// 啟動passport的驗證功能
app.use(passport.initialize());
// 讓passport可以使用session
app.use(passport.session());

// 設定routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  return res.render("index", { user: req.user });
});

app.listen(8080, () => {
  console.log("Server running on port 8080...");
});
