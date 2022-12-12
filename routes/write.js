var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var bodyParser = require('body-parser');

var config = {
    authentication: {
      options: {
        userName: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
      },
      type: 'default'
    },
    server: process.env.DATABASE_SERVER,
    options: {
      database: process.env.DATABASE,
      encrypt: true,
      trustServerCertificate: false,
    }
  };  

function writeToDB(fname, lname, email) {
    var connection = new Connection(config);
    var sql = "INSERT INTO users (fname, lname, email) VALUES (" + fname + ")";
    connection.connect();
    connection.on('connect', function (err) {
        if (err) {
            console.log(err);
            res.send("Connection Error from write.js");
        }
        else {
            console.log("Connected");
            var request = new Request(sql, function (err) {
                if (err) {
                    console.log(sql);
                    console.log(err);
                    console.log(err.message);                   // "Hello"
                    console.log(err.name);                      // "AggregateError"
                    console.log(err.errors);                    // [ Error: "some error" ]}
                } else {
                    console.log('we did it joe');
                }
            });

            connection.execSql(request);
        }
    })
};

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', urlencodedParser, (req, res) => {
    var fname = '\'' + req.body.fname + '\'';
    var lname = '\'' + req.body.lname + '\'';
    var email = '\'' + req.body.email + '\'';
    var doc = [String(fname), String(lname), String(email)];
    var arr = doc.toString();
    var spaced = arr.replace(/,/g, ', ');
    console.log('Got doc:', doc);
    writeToDB(arr);
    var msg = "You added the entry: " + spaced;
    msg = msg.replaceAll(',',' ');
    msg = msg.replaceAll('\'','');
    res.render("submission", { output: msg });
    // document.getElementById('output').innerHTML = arr;
});

module.exports = router;
module.exports.writeToDB = writeToDB;