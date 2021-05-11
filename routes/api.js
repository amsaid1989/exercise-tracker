const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const dbOp = require("../api/dbOp");

router.get("/", (req, res) => {
    dbOp.retrieveAllUsers()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            res.json({ error: `Error retrieving users: ${err}` });
        });
});

router.get("/:_id/logs", (req, res) => {
    const id = req.params["_id"];
    const from =
        new Date(req.query["from"]).toString() === "Invalid Date"
            ? new Date(0)
            : new Date(req.query["from"]);
    const to =
        new Date(req.query["to"]).toString() === "Invalid Date"
            ? new Date()
            : new Date(req.query["to"]);
    const limit = Number(req.query["limit"]) || -1;

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

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/", (req, res) => {
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
            }
        });
});

router.post("/:_id/exercises", (req, res) => {
    const id = req.params["_id"];
    const description = req.body["description"];
    const duration = req.body["duration"];
    const date = req.body["date"];

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
                            date: doc.get("dateString"),
                            duration: doc.get("duration"),
                            description: doc.get("description"),
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
