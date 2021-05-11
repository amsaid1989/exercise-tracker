const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
});

const exerciseSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: String },
});

module.exports = { userSchema, exerciseSchema };
