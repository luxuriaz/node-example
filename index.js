// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var fs = require("fs");
var content = fs.readFileSync("file.json");
var data = JSON.parse(content);
var randomQuestionIndex = Math.floor((Math.random() * 13) + 1);
var randomQuestion = data[randomQuestionIndex].problem;
var Qanswer = data[randomQuestionIndex].solution[0];
var winner = [];
server.listen(port, function() {
  console.log('Server listening at port %d', port);
});


app.use(express.static(__dirname + '/public'));

var guesses = {};
var users = [];
io.on('connection', function(socket) {

  socket.on('new user', function(id) {
    socket.userId = id;
    users.push(id);
    console.log(users)
    if (users.length == 2) {

      io.emit('questions', {
        question: randomQuestion
      });
    }
  });

  socket.on('clean', function(msg) {
    console.log("clean is working")
    var guesses = {};
    users = [];
    randomQuestionIndex = Math.floor((Math.random() * 13) + 1);
    randomQuestion = data[randomQuestionIndex].problem;
    Qanswer = data[randomQuestionIndex].solution[0];
    winner = [];
    console.log(users)
  });

  socket.on('guess', function(guess) {
    console.log(Qanswer)
    console.log(guess)
    if (guess != '') {
      console.log(socket.userId)
      if (guess == Qanswer) {
        winner = socket.userId;
        io.emit('allUsersHaveGuessed', {
          winner: winner,
          answer: Qanswer
        });
      } else {
        for (var userId in users) {
          if (users[userId] != socket.userId) {
            winner.push(users[userId])
          }
        }
        io.emit('allUsersHaveGuessed', {
          winner: winner,
          answer: Qanswer
        });
      }
    }
  });
});
