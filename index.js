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
var winner =[];
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

//Choose a random number between 0 and 10, this will be the number that the
//players are trying to guess
//var randomGuess = Math.floor(Math.random() * 10);

//We will use this object to hold all of the player's guesses
var guesses = {};
var users = [];
io.on('connection', function (socket) {


  //console.log(randomQuestion)
  //console.log(Qanswer)
  socket.on('new user', function (id) {
    socket.userId = id;
    users.push(id);
    console.log(users)
    if (users.length == 2 ){

    io.emit('questions', {
      question: randomQuestion
    });

  }

  });

  //io.emit('user2', {
  //  question: randomQuestion
  //});


  socket.on('clean', function (msg) {
    console.log("clean is working")
    var guesses = {};
    users = [];
    randomQuestionIndex = Math.floor((Math.random() * 13) + 1);
    randomQuestion = data[randomQuestionIndex].problem;
    Qanswer = data[randomQuestionIndex].solution[0];
    winner =[];
    console.log(users)

  });

  socket.on('guess', function (guess) {
    //guesses[socket.userId] = parseInt(guess); //parseInt is a helper function
    //console.log(guesses)
    //console.log(socket.userId)
    //This is how you find out how many keys are in an associative array in js
    //var numGuesses = Object.keys(guesses).length;
    // console.log("we've gotten: " + numGuesses + " guesses");
    console.log(Qanswer)
    console.log(guess)
    if (guess != '') {
      console.log(socket.userId)
      if (guess == Qanswer){
      //Determine the winner
       winner = socket.userId;
      io.emit('allUsersHaveGuessed', {
        winner: winner,
        answer: Qanswer
        //winningGuess: guesses[winner]
      });
    }
    else{
      for (var userId in users){
        if (users[userId] != socket.userId){
          winner.push(users[userId])
        }
      }
      io.emit('allUsersHaveGuessed', {
        winner: winner,
        answer: Qanswer
        //winningGuess: guesses[winner]
      });
    }

    }


  });



});
