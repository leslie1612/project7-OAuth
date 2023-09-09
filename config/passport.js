const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

// 27,39 done()執行時，Passport會透過express-session套件去自動執行passport.serializeUser()
// 這裡的done 和27,39done()是不一樣的東西
// user會被自動帶入Google Strategy的done的第二個參數(foundUser, savedUser)
passport.serializeUser((user, done) => {
  console.log("Serialized(序列化)使用者");
  done(null, user._id); // 將mongoDB的id存在session，並且將id簽名後，以cookie的形式給使用者
});

passport.deserializeUser(async (_id, done) => {
  try {
    console.log("deserialize使用者，使用Serialized儲存的id找到資料庫的資料");
    let foundUser = await User.findOne({ _id }).exec();
    done(null, foundUser); // 將req.user這個屬性設定為foundUser
  } catch (e) {
    console.log(e);
  }
});

// google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      //**修改這裡

      // callbackURL: "http://localhost:8080/auth/google/redirect",
      callbackURL: "https://test-oauth-hgsy.onrender.com/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入google strategy");
      //   console.log(accessToken);
      //   console.log(refreshToken);
      console.log(profile);
      // 確認使用者是否已儲存在資料庫
      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        console.log("使用者已經註冊過，無需存入資料");
        done(null, foundUser);
      } else {
        console.log("偵測到新用戶，需將資料存入資料庫");
        try {
          let newUser = new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.emails[0].value,
          });
          let savedUser = await newUser.save();
          console.log("成功創建新用戶");
          done(null, savedUser);
        } catch (e) {
          console.log(e);
        }
      }
    }
  )
);

// 339. local strategy
passport.use(
  //  login.ejs 中的form中一定要設定成username,password
  new LocalStrategy(async (username, password, done) => {
    console.log("進入local strategy");
    let foundUser = await User.findOne({ email: username }).exec();
    // 找到使用者且有password屬性（排除google登入的使用者）
    if (foundUser && foundUser.password) {
      let result = await bcrypt.compare(password, foundUser.password);
      if (result) {
        console.log("使用者已經註冊過，比對帳密正確");
        done(null, foundUser); // 帶入passport.serializeUser()、passport.deserializeUser(）
      } else {
        console.log("使用者已經註冊過，比對帳密錯誤");
        done(null, false);
      }
    } else {
      console.log("沒找到使用者");
      done(null, false); // 若沒找到使用者，執行done()
    }
  })
);
