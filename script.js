 var config = {
    apiKey: "AIzaSyD_HsTZnyA-xAQqvB4mpEFSwwFHZPpRL7M",
    authDomain: "real-vs-fake-news.firebaseapp.com",
    databaseURL: "https://real-vs-fake-news.firebaseio.com",
    storageBucket: "real-vs-fake-news.appspot.com",
    messagingSenderId: "454901274668"
  };
 firebase.initializeApp(config);
 var database = firebase.database();
 console.log(database);
    var name = "";
    var age = "";
    var city = "";

  $("#quizquestions").hide();

  $("#startquiz").one("click", function(event){
    event.preventDefault();
    $("#dialog").dialog("close");
    $("#quizquestions").show();

    //set the variables equal to the HTML Id's for inserting text
    name = $("#un").val().trim();
    age = $("#howold").val().trim();
    city = $("#unTwo").val().trim();
  
  database.ref().push({
        name: name,
        age: age,
        city: city,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
   
  database.ref().on("value", function(snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = snapshot.val();
      
      // Getting an array of each key In the snapshot object
      var svArr = Object.keys(sv);
        console.log("svARR");
        console.log(svArr);
      
      // Finding the last user's key
      var lastIndex = svArr.length - 1;
      var lastKey = svArr[lastIndex];
      
      // Using the last user's key to access the last added user object
      var lastObj = sv[lastKey]
      // Console.logging the last user's data
      console.log(lastObj.name);
      console.log(lastObj.age);
      console.log(lastObj.city);
      // Change the HTML to reflect
    // //Also when I refesh the page, it does not reset the values
 //      $("#para2").html(lastObj.name);
 //      $("#para3").html(lastObj.age);
 //      $("#para4").html(lastObj.city);
      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
});
  // Access webhose.io API to retreive News headlines from the onion and push to fakeNewsArray
var Onion = {
  "async": true,
  "crossDomain": true,
  "url": "https://webhose.io/search?token=50a0a1fb-9dde-40e8-a606-06806e8399a4&format=json&q=&site=theonion.com&size=12",
  "dataType": "json",
  "method": "GET",
}
$.ajax(Onion).done(function (response) {
  // console.log(response);
  // console.log(response.posts[0].title);
  getTitles(response, "- The Onion -", fakeNewsArray);
  completedRequests++;
  processResults();
});
  // Create arrays for real news titles and fake news titles
  var fakeNewsArray = [];
  var realNewsArray = [];
  function stop() {
        clearTimeout(processResults);
      if (correctGuess > 5) {
        $("#quizarea").html("<h2>" + "Game Over:" + "</h2>" +"<br>" + "Winner  Winner");
        // $('#quiz').prepend($('<img>',{id:'ron',src:'ronheadshot.jpg'}))
        questionNumber = 0;
        correctGuess = 0;
        incorrectGuess = 0;
        
    } else
    {
        $("#quizarea").html("<h2>" + "Game Over" + "</h2>" +"<br>" + "Loser  Loser");
       	// $('#quiz').prepend($('<img>',{id:'ron',src:'ronheadshot.jpg'}))
        questionNumber = 0;
        correctGuess = 0;
        incorrectGuess = 0;
    };
  }
 // Create a function which runs For Loop.  Remove suffix identifying news source.  Put edited title into appropriate array (real news or fake news)
function getTitles(response, removesuffix, outputArray) {
  for (var i = 0; i < response.posts.length; i++) {
      var title = response.posts[i].title;
      // console.log("before:", title);
      var suffixIndex = title.indexOf(removesuffix);
      if (suffixIndex > 0) {
        title = title.substring(0,suffixIndex);
      }
      if (title.length>0) {
        outputArray.push(title);
        // console.log("after:", title);
      } else {
        // console.log("Rejected:", title);
      }
      
  }
};
// Access webhose.io API to retrieve New headlines from CNN and push to realNewsArray
var CNN = {
  "async": true,
  "crossDomain": true,
  "url": "https://webhose.io/search?token=50a0a1fb-9dde-40e8-a606-06806e8399a4&format=json&q=language:english&site=cnn.com&size=12",
  "dataType": "json",
  "method": "GET",
}
$.ajax(CNN).done(function (response) {
  // console.log(response);
  // console.log(response.posts[0].title);
  getTitles(response, "- CNN", realNewsArray);
  completedRequests++;
  processResults();
});
// Access webhose.io API to retrieve New headlines from TMZ and push to realNewsArray
var TMZ = {
  "async": true,
  "crossDomain": true,
  "url": "https://webhose.io/search?token=50a0a1fb-9dde-40e8-a606-06806e8399a4&format=json&q=&site=tmz.com&size=12",
  "dataType": "json",
  "method": "GET",
}
$.ajax(TMZ).done(function (response) {
  // console.log(response);
  // console.log(response.posts[0].thread.title);
  getTitles(response, "TMZ", realNewsArray);
  completedRequests++;
  processResults();
});
// Define number of Ajax calls and set variable form number of completed Ajax calls
var totalRequests = 3;
var completedRequests = 0;
// Create variable to keep track of correct and incorrect guesses
var correctGuess = 0;
var incorrectGuess = 0;
var questionNumber = 0;
var headlineIndex = undefined;
// Function to be certain all Ajax calls are completed prior to running the remainder of the code
function processResults () {
  if (completedRequests===totalRequests) {
    // Combine real and fake headlines into a single array
    var headlinesArray = fakeNewsArray.concat(realNewsArray);
    headlineIndex = Math.floor(Math.random() * headlinesArray.length);
    console.log(headlinesArray);
    var randomHeadline = headlinesArray[headlineIndex];
    console.log(randomHeadline);
    // Output random headline to HTML
    $("#quizquestions").html(randomHeadline);
    // Clear Quiz Output 
    $("#quizoutput").html("");
    // Record question number
    questionNumber++;
    console.log(questionNumber);
  }
   if (questionNumber === 10) {
      stop();
    
  };
};
  // Enable on click event listeners
  // If REAL button is clicked
    $( "#real_button" ).click(function() {
      if (headlineIndex <= fakeNewsArray.length) {
        $("#quizoutput").html("No!  This is Fake");
        incorrectGuess++;
        console.log(incorrectGuess);
        $("#rightguess").html("Correct Guesses: " + correctGuess);
        $("#wrongguess").html("Wrong Guesses: " + incorrectGuess);
        setTimeout(function(){processResults()}, 500)
      }
      else {
        $("#quizoutput").html("Yes!  This is TRUE")
        correctGuess++;
        console.log(correctGuess);
        $("#rightguess").html("Correct Guesses: " + correctGuess);
        $("#wrongguess").html("Wrong Guesses: " + incorrectGuess);
        setTimeout(function(){processResults()}, 500)
      };
    });
    // If FAKE button is clicked
    $( "#fake_button" ).click(function() {
    if (headlineIndex <= fakeNewsArray.length) {
      $("#quizoutput").html("You're right!  This Is Fake");
      correctGuess++;
      $("#rightguess").html("Correct Guesses: " + correctGuess);
      $("#wrongguess").html("Wrong Guesses: " + incorrectGuess);
      setTimeout(function(){processResults()}, 500)
    } 
      else {
      $("#quizoutput").html("Sorry!  This is True");
      incorrectGuess++;
      $("#rightguess").html("Correct Guesses: " + correctGuess);
      $("#wrongguess").html("Wrong Guesses: " + incorrectGuess);
      setTimeout(function(){processResults()}, 500)
    };
    });
    // After 10 questions, end the quiz
  
