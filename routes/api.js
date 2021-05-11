const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

router.get("/", (req, res) => {
    res.send("List of all users");
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/", (req, res) => {
    res.send("Added new user");
});

module.exports = router;
