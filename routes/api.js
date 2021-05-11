const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const dbOp = require("../api/dbOp");

router.get("/", (req, res) => {
    // Returns a JSON object that contains all users that
    // are currently stored in the database
    dbOp.retrieveAllUsers()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            res.render("error", { errorMsg: `Error retrieving users: ${err}` });
        });
});

router.get("/:_id/logs", (req, res) => {
    const id = req.params["_id"];

    // If the date input is empty or not valid, start the search
    // from the Unix epoch. Otherwise, start the search from the
    // date specified
    const from =
        new Date(req.query["from"]).toString() === "Invalid Date"
            ? new Date(0)
            : new Date(req.query["from"]);

    // If the date input is empty or not valid, set the search
    // 'to' paramerter to today's date. Otherwise, set it to the
    // specified date
    const to =
        new Date(req.query["to"]).toString() === "Invalid Date"
            ? new Date()
            : new Date(req.query["to"]);

    // Set the limit to the number specified or to -1 which will
    // be used to indicate that no limit is specified
    const limit = Number(req.query["limit"]) || -1;

    // The search for the user exercises begins with retrieving the
    // user from the database using the ID provided. If the ID is
    // not valid or it doesn't exist, the function returns an error.
    //
    // Otherwise, it retrieves the username, then uses it to search
    // for all the exercises that are assigned to that username within
    // the date range specified.
    //
    // It then returns a JSON object that combines data from the user
    // document and the exercises. The object includes the user ID,
    // username, a count of the exercises found, and a log of the
    // exercises found
    dbOp.retrieveUser(id)
        .then((user) => {
            if (user.length === 0) {
                res.render("error", {
                    errorMsg: `Error: ID "${id}" not found`,
                });
            } else {
                dbOp.retrieveUserExercises(user[0].username, from, to, limit)
                    .then((logs) => {
                        res.json({
                            _id: user[0]["_id"],
                            username: user[0].username,
                            count: logs.length,
                            log: logs.map((entry) => {
                                // Go over the logs array and map its items
                                // to a new array of objects that includes
                                // a description of the exercise, its duration,
                                // and the date string stored for it in the
                                // database.
                                return {
                                    description: entry.description,
                                    duration: entry.duration,
                                    date: entry.dateString,
                                };
                            }),
                        });
                    })
                    .catch((err) => {
                        console.error(err);

                        res.render("error", {
                            errorMsg: `Error retrieving logs for user ${id}`,
                        });
                    });
            }
        })
        .catch((err) => {
            console.error(err);

            res.render("error", {
                errorMsg: `Error: failed to add exercise (${err})`,
            });
        });
});

// Parse the body of the post requests and store its contents
// in the 'body' JSON object of the request
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/", (req, res) => {
    // Add a new user to the database and return a JSON object
    // containing the new user's data. If the operation fails,
    // return an error with information on what caused the error.
    dbOp.addNewUser(req.body.username)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);

            if (err.code === 11000) {
                res.render("error", {
                    errorMsg: `Error adding user: username ${req.body.username} already exists`,
                });
            } else {
                res.render("error", { errorMsg: `Error adding user: ${err}` });
            }
        });
});

router.post("/:_id/exercises", (req, res) => {
    // Adds a new exercise and assigns it to the specified user.
    // If the operation is successful, then it returns a JSON object
    // with the data of the new exercise. Otherwise, it returns an
    // error with information on what caused the problem.

    // Retrieve the parameters from the request body
    const id = req.params["_id"];
    const description = req.body["description"];
    const duration = req.body["duration"];
    const date = req.body["date"];

    // Start by retrieving the user using the specified ID. If this
    // fails, return an error with information on what caused the
    // failure.
    //
    // Otherwise, use the username of the retrieved user, assign an
    // exercise to it, and save it in the database. If adding an
    // exercise fails, return an error with information on what
    // caused the issue. Otherwise, return a JSON object combining
    // information from the user and the new exercise.
    dbOp.retrieveUser(id)
        .then((user) => {
            if (user.length === 0) {
                res.render("error", {
                    errorMsg: `Error: ID "${id}" not found`,
                });
            } else {
                dbOp.addExercise(user[0].username, description, duration, date)
                    .then((doc) => {
                        res.json({
                            _id: user[0]["_id"],
                            username: user[0].username,
                            date: doc.dateString,
                            duration: doc.duration,
                            description: doc.description,
                        });
                    })
                    .catch((err) => {
                        console.error(err);

                        res.render("error", {
                            errorMsg: `Error: failed to add exercise (${err})`,
                        });
                    });
            }
        })
        .catch((err) => {
            console.error(err);

            res.render("error", {
                errorMsg: `Error: can't retrieve user with ID ${id}`,
            });
        });
});

module.exports = router;
