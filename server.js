const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const Role = db.role;

const app = express();

var corsOptions = {
    origin : "*"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Pendekar application." });
});

// routes
require('./app/routes/authRoutes')(app);
require('./app/routes/userRoutes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

db.sequelize.sync({
    alter: true,
    logging: false,
    force: false
}).then(() => {
    console.log('Resync Db');
    // initial();
});


// function initial() {
//     Role.create({
//         id: 1,
//         name: "user"
//     });
//
//     Role.create({
//         id: 2,
//         name: "moderator"
//     });
//
//     Role.create({
//         id: 3,
//         name: "admin"
//     });
// }
