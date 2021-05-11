require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Connected to DB successfully");

        // Setting the view engine
        app.set("views", "./views");
        app.set("view engine", "pug");

        app.use(cors());
        app.use(express.static("public"));

        // Connect the server to the routers
        app.use("/", indexRouter);
        app.use("/api/users", apiRouter);

        const listener = app.listen(process.env.PORT || 3000, () => {
            console.log(
                "Your app is listening on port " + listener.address().port
            );
        });
    })
    .catch((err) => {
        console.log("Error connecting to the database:", err);
    });
