const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  name: { type: String, require: true, minLength: 2, maxLength: 255 },
  googleID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  thumbnail: { type: String },

  // local login
  email: { type: String },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
});

module.exports = mongoose.model("User", userSchema);
