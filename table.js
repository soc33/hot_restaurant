// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Empty Arrays for Tables and Waitlist
var currentTables = [];
var waitlist = [];
// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/add", function (req, res) {
    res.sendFile(path.join(__dirname, "add.html"));
});

app.get("/view", function (req, res) {
    res.sendFile(path.join(__dirname, "tables.html"));
});
// Displays all reservations
app.get("/api/reservations", function (req, res) {
    return res.json(currentTables);
});
// Clears Tables
app.post("/api/clear", function (req, res) {
    currentTables = [];
    waitlist = [];
});
// Displays all waitlists
app.get("/api/waitlist", function (req, res) {
    return res.json(waitlist);
});
app.post("/add", function (req, res) {

    //New Table is created with the form data
    var newTable = req.body;

    //Checks uniqueID, if it is already there it will give an error, otherwise it checks the space
    if (!isThere(newTable, currentTables) && !isThere(newTable, waitlist)) {
        if (currentTables.length < 5) {
            //If there is space it will add it to the currentTables array and returns true
            currentTables.push(newTable);
            console.log("Added to Reservations");
            console.log(newTable);
            // res.json(newTable);
            res.send(true);
        } else {
            //If there isn't space it will add the table to the waitlist after verifying the UniqueID
            waitlist.push(newTable);
            console.log("Added to Waitlist");
            console.log(newTable);
            // res.json(newTable);
            res.send(false);
        }
    } else {
        res.send("Error");
    }
});
// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
//Checks if the UniqueID is Unique
function isThere(x, z) {
    var isThere = false;
    for (var i = 0; i < z.length; i++) {
        if (parseInt(x.uniqueID) === parseInt(z[i].uniqueID)) {
            isThere = true;
        }
    }
    return isThere;
}