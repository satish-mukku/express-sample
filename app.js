var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();

var getData = function () {
  var db = new sqlite3.Database('beacon');
  db.serialize(function () {
    db.run('CREATE TABLE users (info TEXT)');
    var stmt = db.prepare('INSERT INTO users VALUES (?)');
    for (var i = 0; i < 10; i++) {
      stmt.run('User_' + i);
    }
    stmt.finalize();
  });
  db.close();
}

app.get('/', function (req, res) {
  getData();
  res.send('Hello World!');
});

app.get('/users', function (req, res) {
  var db = new sqlite3.Database('beacon');
  var lists = [];
  db.all("SELECT * FROM users", function (err, rows) {
    if (err) return cb(err);
    var contador = 0;
    rows.forEach(function (row) {
      lists[contador] = row.info;
      console.log(row);
    });
    db.close();
  });
  res.send('User List' + lists.toString());
});

app.listen(3000, function () {
  console.log('Server is running');
});