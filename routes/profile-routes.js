const router = require("express").Router();
const Post = require("../models/post-model");
const User = require("../models/user-model");

// 確認使用者是否已登入過，若有，才可進入/profile
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("yes");
    next();
  } else {
    console.log("nono");
    return res.redirect("/auth/login");
  }
};

router.get("/", authCheck, async (req, res) => {
  console.log("進入/profile");
  let postFound = await Post.find({ author: req.user._id }); // 找到目前登入者製作的post

  let newUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { date: new Date() },
    { new: true }
  ).exec();

  return res.render("profile", {
    user: newUser,
    posts: postFound,
  }); // deserializeUser()
});

// 所有貼文
router.get("/all", authCheck, async (req, res) => {
  console.log("進入all posts");
  let allPosts = await Post.find({}).populate("author").exec();
  return res.render("all-posts", { user: true, posts: allPosts });
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
router.put("/:id", authCheck, async (req, res) => {
  console.log("進入put");
  let { title, content } = req.body;
  await Post.findOneAndUpdate(
    {
      _id: req.body._id,
    },
    { $set: { title, content } }
  );

  return res.redirect("/profile");
});

// 刪除post
router.delete("/:id", authCheck, async (req, res) => {
  console.log("進入delete");
  await Post.deleteOne({
    _id: req.params.id,
  }).exec();

  return res.redirect("/profile");
});

module.exports = router;
