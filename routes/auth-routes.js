const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

// 會員登入
router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

// 會員登出
router.get("/logout", (req, res) => {
  req.logout((e) => {
    if (e) {
      return res.send(e);
    }
    return res.redirect("/");
  });
});

// 338.註冊本地會員
router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});
// 提交註冊會員表單 with sign.ejs
router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  if (password.length < 8) {
    req.flash("errormsg", "密碼長度過短，至少需8個數字或英文字");
    return res.redirect("/auth/signup");
  }

  // 確認信箱是否被註冊過
  const foundEmail = await User.findOne({ email }).exec();
  if (foundEmail) {
    req.flash("errormsg", "此信箱已被註冊過，請使用其他信箱，或用此信箱登入");
    return res.redirect("/auth/signup");
  }
  //   if ("abc") {
  //     console.log("yes"); // yes
  //   }

  // 註冊新會員
  // 1.將密碼hash
  let hashedPassword = await bcrypt.hash(password, 12); // bcrypt.hash() return a Promise
  // 2.建立新用戶資料
  let newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  // 3.儲存到mongoDB
  await newUser.save();
  req.flash("successmsg", "成功註冊會員！現在可登入系統");
  return res.redirect("/auth/login");
});

// 透過login.ejs表單送出本地會員登入
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "登入失敗，帳號或密碼不正確", // 會被自動帶入到 index.js 中的res.locals.error = req.flash("error");
  }),
  (req, res) => {
    console.log("正確,進入redirect");
    return res.redirect("/profile"); // 登入成功後，被重新導向是/profile
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    // "google"表示使用google strategy

    scope: ["profile", "email"],
    prompt: "select_account",
  })
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  //   console.log(req.user); // deserializeUser()內部自動設定req.user的值是done()的第二個參數的值
  console.log("進入redirect區域");
  return res.redirect("/profile");
  // passport.authenticate()是middleware，表示有使用google驗證後才可使用的route
});

module.exports = router;
