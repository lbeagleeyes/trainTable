


// Initialize Firebase
var config = {
  apiKey: "AIzaSyCoja7tz_bLX3YpuxzCn6uGZZ9kqeuRscE",
  authDomain: "test-7c940.firebaseapp.com",
  databaseURL: "https://test-7c940.firebaseio.com",
  projectId: "test-7c940",
  storageBucket: "test-7c940.appspot.com",
  messagingSenderId: "469826221255"
};
firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var name = "";
var destination = "";
var firstTrain = "";
var frequency = "";

// Capture Button Click
function addTrain() {
  event.preventDefault();

  // Grabbed values from text boxes
  name = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = $("#firstTrainTime").val().trim();
  frequency = $("#frequency").val().trim();


  // Code for handling the push
  database.ref().push({
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
  });

}

database.ref().on("child_added", function (childSnapshot) {

  console.log(childSnapshot.key);

  var row = new $('<tr>', {
    id:childSnapshot.key
  });

  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

  var nextInfo = calculateNextTrain(firstTrain, frequency);


  row.append($('<td>').text(childSnapshot.val().name));
  row.append($('<td>').text(childSnapshot.val().destination));

  var nextTrainTime = new $('<td>', {
    id:childSnapshot.key+"-nextTrain",
    text:nextInfo[0]
  });

  row.append(nextTrainTime);

  var minutesLeft = new $('<td>', {
    id:childSnapshot.key+"-inMins",
    text: nextInfo[1]
  });

  row.append(minutesLeft);

  $('#trainList').append(row);

});

// function updateTrainInfo() {
//   database.ref().on("value", function(snapshot) {
//     console.log(snapshot.val());


//     var nextInfo = calculateNextTrain(snapshot.val().firstTrain, snapshot.val().frequency);

//     var key = snapshot.key;

//     $('#'+key+'-nextTrain').text = nextInfo[0];

//     $('#'+key+'-inMins').text = nextInfo[1];

//   });
  
// }

function calculateNextTrain(firstTrain, frequency) {
  var currentTime = moment().format('HH:mm');
  var timeSinceFirst = moment().diff(moment(firstTrain, "HH:mm"), "minutes");

  var minsRemainding = timeSinceFirst % frequency;

  var minsLeft = frequency - minsRemainding;

  var nextTrainTime = moment().add(minsLeft, 'minutes').format('HH:mm');

  return [nextTrainTime, minsLeft];
}

// $(document).ready(function() {

//     setInterval(updateTrainInfo, 60000);
// });