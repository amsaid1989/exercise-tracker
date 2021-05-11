const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
});

// The exerciseSchema stores the date twice. Once as a date
// object and the other as a string that is used mainly for
// display purposes.
const exerciseSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date },
    dateString: { type: String },
});

module.exports = { userSchema, exerciseSchema };
