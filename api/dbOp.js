const mongoose = require("mongoose");
const { User, Exercise } = require("./models");

function retrieveUser(id) {
    return User.find({ _id: id }).select("username").exec();
}

function retrieveAllUsers() {
    return User.find({}).select("username").exec();
}

function addNewUser(username) {
    const doc = new User({ username });

    return doc.save();
}

function addExercise(username, description, duration, date) {
    const dateObj = date ? new Date(date) : new Date();

    const doc = new Exercise({
        username: username,
        description: description,
        duration: Number(duration),
        date: dateObj.toDateString(),
    });

    return doc.save();
}

module.exports = { retrieveUser, retrieveAllUsers, addNewUser, addExercise };
