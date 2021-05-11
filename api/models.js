const mongoose = require("mongoose");
const { userSchema, exerciseSchema } = require("./schemas");

const User = new mongoose.model("User", userSchema);

const Exercise = new mongoose.model("Exercise", exerciseSchema);

module.exports = { User, Exercise };
