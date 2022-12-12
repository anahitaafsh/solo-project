var express = require('express');
var router = express.Router();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

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

router.get('/', function (req, res, next) {
  var connection = new Connection(config);
  connection.connect();
  connection.on('connect', function (err) {
    if (err) {
      console.log(err);
      res.send(err.message);
    }
    else {
      console.log("Connected");
      var request = new Request("SELECT * FROM users FOR JSON AUTO;", function (err, rowCount) {
        if (err) {
          console.log(err);
        } else {
          console.log(rowCount + ' rows');
        }
      });

      var result = "";

      request.on('row', function (columns) {
        columns.forEach(function (column) {
          result += column.value + " \n";
        });
      });

      request.on('requestCompleted', function () {
        var newMsg = prettifyText(result);
        res.render('read', {message: newMsg});
      });

      connection.execSql(request);
    }
  })
});

function prettifyText(msg) {
  var x = msg.replace(/[0-9]/g, '');
  x = x.replaceAll('{','');
  x = x.replaceAll('}','');
  x = x.replaceAll('[','');
  x = x.replaceAll(']','');
  x = x.replaceAll('"','');
  x = x.replaceAll(':,','');
  x = x.replaceAll('id', '\n');
  x = x.replaceAll('fname:','  ');
  x = x.replaceAll('lname:','  ');
  x = x.replaceAll('email:','  ');
  x = x.replaceAll(',','');
  // console.log(typeof x);
  console.log(process.env.DATABASE_USERNAME);
  return x;
};

module.exports = router;
module.exports.prettifyText = prettifyText;