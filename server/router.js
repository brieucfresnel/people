const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const fileUpload = require('express-fileupload');
const People = require('./data/data');

const db = new sqlite3.Database('db/persons');

module.exports = router;
let resetDB = false; // Set this to true to reset database data


/*
* Drops the table then populates it with 3 elements
*/

function populateDB() {
    db.run('DELETE FROM person');
    let persons = [];
    var stmt = db.prepare("INSERT INTO person (firstname, lastname, avatar, score) VALUES(?,?,?,?)");
    for(let i = 0 ; i < People.getPersons().length ; i++) {
        person = People.getPerson(i);
        stmt.run(person.firstname, person.lastname, person.avatar, person.score);
    }
}

/*
* Initializing db
*/

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS person(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, firstname VARCHAR, lastname VARCHAR, avatar VARCHAR, score INT)");
    if(resetDB)
        populateDB();
});

/*
* Middleware
*/

router
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
    extended: true
}));

/*
* GET requests
*/

router.get("/", (req, res) => {
   res.json("Hello world!");
});

router.get("/persons", (req, res) => {
    db.all( "SELECT * FROM person", (err, rows) => {
        res.json(rows);
    });
});

router.get('/persons/:id', (req, res) => {
    db.get(
        "SELECT * FROM person WHERE id=?",
        req.params.id,
        (err, row) => {
            res.json(row)
        }
    );
});

/*
* POST, UPDATE, DELETE requests
*/

router.post('/upload', (req, res) => {
    if (!req.files)
        return res.status(500).send({ msg: "file is not found" })

    // accessing the file
    const myFile = req.files.file;

    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/data/img/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        console.log(myFile.name);
        return res.send({name: myFile.name});
    });
})

router.post('/person',(req, res) => {
    db.run("INSERT INTO person (firstname, lastname, avatar, score) VALUES(?,?,?,?)", [req.body.firstname, req.body.lastname, req.body.avatar, req.body.score]);
    res.redirect(303, '/persons');
});

router.delete('/person/:id', (req, res) => {
    db.run('DELETE FROM person WHERE id=?', [req.params.id]);
    res.redirect(303, "/persons");
});

/*
* 400 Errors handling
*/

router.use((req, res) => {
    res.status(400);
    res.json({
       error: "Bad request"
    });
});
