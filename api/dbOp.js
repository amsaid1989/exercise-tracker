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

function retrieveUserExercises(username, from, to, limit) {
    // Retrieve all the user's exercises within the specified
    // date range
    const query = Exercise.find({
        username: username,
        date: { $gte: from, $lte: to },
    });

    // If a limit is specified and it is not a negative number,
    // use it to the limit the results that are returned from
    // the query.
    return limit > -1 ? query.limit(limit).exec() : query.exec();
}

function addExercise(username, description, duration, date) {
    // If a date is specified, use it to construct a date object.
    // Otherwise, construct a date object for today's date.
    const dateObj = date ? new Date(date) : new Date();

    const doc = new Exercise({
        username: username,
        description: description,
        duration: Number(duration),
        date: dateObj,
        dateString: dateObj.toDateString(), // a date string for display purposes
    });

    return doc.save();
}

module.exports = {
    retrieveUser,
    retrieveAllUsers,
    addNewUser,
    retrieveUserExercises,
    addExercise,
};
