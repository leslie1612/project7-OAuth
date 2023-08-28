const router = require("express").Router();
const Post = require("../models/post-model");

// 確認使用者是否已登入過，若有，才可進入/profile
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};

router.get("/", authCheck, async (req, res) => {
  console.log("進入/profile");
  let postFound = await Post.find({ author: req.user._id }); // 找到目前登入者製作的post
  //   console.log(postFound);
  return res.render("profile", { user: req.user, posts: postFound }); // deserializeUser()
});

// 340.製作post
router.get("/post", authCheck, (req, res) => {
  return res.render("post", { user: req.user });
});

router.post("/post", authCheck, async (req, res) => {
  let { title, content } = req.body;
  let newPost = new Post({
    title,
    content,
    author: req.user._id,
  });
  try {
    let save = await newPost.save();
    return res.redirect("/profile");
  } catch (e) {
    req.flash("errormsg", "標題與內容皆須填寫");
    return res.redirect("/profile/post");
  }
});

// 修改post

router.post("/modify", authCheck, async (req, res) => {
  console.log("進入/profile/modify");
  let { title } = req.body;
  await Post.findOneAndUpdate(
    {
      _id: req.body._id,
    },
    { $set: { title } }
  );

  return res.redirect("/profile");
});

module.exports = router;
