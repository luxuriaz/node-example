$(function () {
  var socket = io();


  socket.on('questions', function (msg){
    console.log("question emit working")
    console.log(msg.question)
    var question = msg.question;
    $('#questionDiv').append(question);
    $('#questionDiv').show();
    $('#guessForm').show();
    $('#waitingDiv').hide();
    //return false;
  });


  //Deal with getting username
  $('#userIdForm').submit(function() {
    console.log($('#userIdInput').val());
    socket.emit('new user', $('#userIdInput').val());
    $('#gameDiv').show();
    $('#waitingDiv').show();
    $('#guessForm').hide();
    $('#logInDiv').hide();
    //$('#resultsDiv').append("TTEST");
    return false; //This tell jquery to not refresh the page
  });



  //Deal with getting the guess
  $('#guessForm').submit(function() {
    socket.emit('guess', $('#guessInput').val());
    //$('#guessForm').hide();
    //$('#waitingDiv').show();
    return false;
  });



  //This will be called when all users have guessed
  socket.on('allUsersHaveGuessed', function(msg) {
    $('#gameDiv').hide();
    $('#resultsDiv').append("The answer was: " + msg.answer + "<br>Winner: " + msg.winner);
    $('#waitingDiv').hide();
    $('#guessForm').hide();
    $('#resultsDiv').show();
    socket.emit('clean',"clean");


  });
});
