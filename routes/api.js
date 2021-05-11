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
                            description: doc.get("description"),
                            duration: doc.get("duration"),
                            date: doc.get("date"),
                        });
                    })
                    .catch((err) => {
                        res.render("error", {
                            errorMsg: `Error: failed to add exercise (${err})`,
                        });
                    });
            }
        })
        .catch((err) => {
            console.error(err);

            if (err.reason.toString().includes("12 bytes")) {
                res.render("error", {
                    errorMsg: `Error: ID "${id}" not valid`,
                });
            }
        });
});

module.exports = router;
