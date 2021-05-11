const mongoose = require("mongoose");
const { userSchema } = require("./schemas");

const User = new mongoose.model("User", userSchema);

module.exports = { User };
