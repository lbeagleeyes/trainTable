
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

var name = "";
var destination = "";
var firstTrain = "";
var frequency = "";

//on submit button click
function addTrain() {
  event.preventDefault();

  name = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = $("#firstTrainTime").val().trim();
  frequency = $("#frequency").val().trim();

  database.ref('/trains/').push({
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  });
}

database.ref('/trains').on("child_added", function (trainEntry) {

  console.log(trainEntry.key);

  var row = new $('<tr>', {
    id: trainEntry.key
  });

  var train = trainEntry.val();
  var firstTrain = train.firstTrain;
  var frequency = train.frequency;
  var nextInfo = calculateNextTrain(firstTrain, frequency);

  row.append($('<td>').text(train.name));
  row.append($('<td>').text(train.destination));
  row.append($('<td>').text(train.frequency));

  var nextTrainTime = new $('<td>', {
    id: trainEntry.key + "-nextTrain",
    text: nextInfo[0]
  });
  row.append(nextTrainTime);

  var minutesLeft = new $('<td>', {
    id: trainEntry.key + "-inMins",
    text: nextInfo[1]
  });
  row.append(minutesLeft);

  $('#trainList').append(row);

});

function updateTrainInfo() {

  database.ref('/trains').on("value", function (snapshot) {
    console.log(snapshot.val());
    var trains = snapshot.val();

    Object.keys(trains).forEach(function (trainId) {
      var train = trains[trainId];

      var nextInfo = calculateNextTrain(train.firstTrain, train.frequency);
      $('#' + trainId + '-nextTrain').text(nextInfo[0]);
      $('#' + trainId + '-inMins').text(nextInfo[1]);

    })
  });
}

function calculateNextTrain(firstTrain, frequency) {

  var timeSinceFirst = moment().diff(moment(firstTrain, "HH:mm"), "minutes");
  var minsRemainding = timeSinceFirst % frequency;
  var minsLeft = frequency - minsRemainding;
  var nextTrainTime = moment().add(minsLeft, 'minutes').format('HH:mm');
  return [nextTrainTime, minsLeft];

}

$(document).ready(function () {

  setInterval(updateTrainInfo, 60000);

});