
setInterval(() => {
    var currentTime = moment().format('hh:mm');
    $("#currentTime").html(currentTime);
}, 1000);

var config = {
    apiKey: "AIzaSyCf4PoXA9NacNeUUV6pIlZWcRTaB4eu50U",
    authDomain: "traintime-eb3e0.firebaseapp.com",
    databaseURL: "https://traintime-eb3e0.firebaseio.com",
    projectId: "traintime-eb3e0",
    storageBucket: "traintime-eb3e0.appspot.com",
    messagingSenderId: "45777814848",
    appId: "1:45777814848:web:49021fe45f7a11e3f6a6a5"
  };
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var firstTrainTime = $("#firstTrain-input").val().trim();
    var trainFreq = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        destination: trainDest,
        firstTrain: firstTrainTime,
        frequency: trainFreq
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var name = childSnapshot.val().name;
    var dest = childSnapshot.val().destination;
    var freq = childSnapshot.val().firstTrain;
    var first = childSnapshot.val().frequency;



    var timeTill = first.split(":");
    var trainTime = moment()
        .hours(timeTill[0])
        .minutes(timeTill[1]);

    var maxMoment = moment.max(moment(), trainTime);
    var minsAway;
    var arrival;

    if (maxMoment === trainTime) {
        arrival = trainTime.format("hh:mm A");
        minsAway = trainTime.diff(moment(), "minutes");
    } else {

        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % freq;
        minsAway = freq - tRemainder;

        arrival = moment()
            .add(minsAway, "m")
            .format("hh:mm A");
    }




    $("#train-schedule> tbody").append(
        $("<tr>").append(
            $("<td>").text(name),
            $("<td>").text(dest),
            $("<td>").text(freq),
            $("<td>").text(arrival),
            $("<td>").text(minsAway)
        )
    );
});