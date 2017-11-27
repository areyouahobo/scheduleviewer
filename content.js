var selectedSchedule = "A";
var selectedTheme = "Classic";
var backgroundColor;
var headerColor;
var headerTextColor;
var textColor;
var buttonColor;
var buttonTextColor;
var nameList;
var username;

var fullMoment = moment();
var now = moment({hour: fullMoment.get('hour'), minute: fullMoment.get('minutes')});

chrome.runtime.onUpdateAvailable.addListener(function(details) {
  console.log("updating to version " + details.version);
  chrome.runtime.reload();
});

chrome.runtime.requestUpdateCheck(function(status) {
  if (status == "update_available") {
    console.log("update pending...");
  } else if (status == "no_update") {
    console.log("no update found");
  } else if (status == "throttled") {
    console.log("Oops, I'm asking too frequently - I need to back off.");
  }
});



  chrome.storage.sync.get(['scheduleToLoad', 'selectedTheme', 'backgroundColor', 'headerColor', 'textColor', 'buttonColor', 'buttonTextColor', 'username'], function(data) {
    selectedSchedule = data.scheduleToLoad;
    selectedTheme = data.selectedTheme;
    backgroundColor = data.backgroundColor;
    headerColor = data.headerColor;
    headerTextColor = data.headerTextColor;
    textColor = data.textColor;
    buttonColor = data.buttonColor;
    buttonTextColor = data.buttonTextColor;
    username = data.username;
    runMe();
  });
function runMe() {


$("#optionsLink").click(function() {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason == "install"){
        chrome.storage.sync.set({ scheduleToLoad: A });
    } else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});
$("#releaseStatus").text("Loading...");
init();

if (selectedTheme == "Midnight") {
  $("body").css({"background-color":"black", "color":"white"});
  $("#optionsLink").css({"background-color": "gray", "color":"white", "border-color": "gray"});
}
if (selectedTheme == "Custom") {
  $("body").css({"background-color": backgroundColor, "color": textColor});
  $("#optionsLink").css({"background-color": buttonColor, "color":buttonTextColor, "border-color": buttonColor});
  $("#titleSection").css({"background-color": headerColor, "color": headerTextColor});
}


var offhours = [
  ["00:00", "23:59", "No class today.", "No class today.","No class today.","No class today."]
];

var date = new Date();
var today = date.getDay();

var schoolStart = moment({hour: 9, minute: 20});
var schoolEnd = moment({hour: 16, minute: 30});
console.log(today + " is day");

// console.log("minutes for rn" + ahorita);


if (now.isBetween(schoolStart, schoolEnd, null, '[]')) {
  switch (today) {
    case 0:
    $("#schedHeader").text("Saturday");
    $("#currentClass").text("No class today.");
    break;

    case 1:
    $("#schedHeader").text("Monday");
    $("#currentClass").text(scheduleCalc(mondaySchedule)[0]);
    $("#minutesLeft").text(minutesDisplay(scheduleCalc(mondaySchedule)[1]));
    $("#timeRange").text(scheduleCalc(mondaySchedule)[3]);
    updateEveryMinute(scheduleCalc(mondaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(mondaySchedule)[2]);
    break;

    case 2:
    $("#schedHeader").text("Tuesday");
    $("#currentClass").text(scheduleCalc(tuesdaySchedule)[0]);
    $("#minutesLeft").text(minutesDisplay(scheduleCalc(tuesdaySchedule)[1]));
    $("#timeRange").text(scheduleCalc(tuesdaySchedule)[3]);
    updateEveryMinute(scheduleCalc(tuesdaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(tuesdaySchedule)[2]);
    break;

    case 3:
    $("#schedHeader").text("Wednesday");
    $("#currentClass").text(scheduleCalc(wednesdaySchedule)[0]);
    $("#minutesLeft").text(minutesDisplay(scheduleCalc(wednesdaySchedule)[1]));
    $("#timeRange").text(scheduleCalc(wednesdaySchedule)[3]);
    updateEveryMinute(scheduleCalc(wednesdaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(wednesdaySchedule)[2]);
    break;

    case 4:
    $("#schedHeader").text("Thursday");
    $("#currentClass").text(scheduleCalc(thursdaySchedule)[0]);
    $("#minutesLeft").text(minutesDisplay(scheduleCalc(thursdaySchedule)[1]));
    $("#timeRange").text(scheduleCalc(thursdaySchedule)[3]);
    updateEveryMinute(scheduleCalc(thursdaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(thursdaySchedule)[2]);
    break;

    case 5:
    $("#schedHeader").text("Friday");
    $("#currentClass").text(scheduleCalc(fridaySchedule)[0]);
    $("#minutesLeft").text(minutesDisplay(scheduleCalc(fridaySchedule)[1]));
    $("#timeRange").text(scheduleCalc(fridaySchedule)[3]);
    updateEveryMinute(scheduleCalc(fridaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(fridaySchedule)[2]);
    break;

    case 6:
    $("#schedHeader").text("Saturday");
    $("#currentClass").text("No class today.");
    break;
  }
} else {
  $("#schedHeader").text(now.format('dddd'));
  $("#currentClass").text("No class right now.");
  $("#minutesLeft").text();
}
  if (selectedSchedule == undefined) {
    $("#selectedSchedule").text("Schedule A");
  } else {
    $("#selectedSchedule").text("Schedule " + selectedSchedule);
  }

}

function scheduleCalc(sched) {
  var x = 0;
  var classRef = 2;

  if (selectedSchedule == "A") {
    classRef = 2;
  } else if (selectedSchedule == "B") {
    classRef = 3;
  } else if (selectedSchedule == "C") {
    classRef = 4;
  } else if (selectedSchedule == "D") {
    classRef = 5;
  }

  for (x = 0; x < sched.length; x++) {
    var time1 = moment({hour: sched[x][0].substring(0, sched[x][0].indexOf(":")), minute: sched[x][0].substring(sched[x][0].indexOf(":") + 1)});
    var time2 = moment({hour: sched[x][1].substring(0, sched[x][1].indexOf(":")), minute: sched[x][1].substring(sched[x][1].indexOf(":") + 1)});
    var minutesRemaining = 0;
    if (now.isBetween(time1, time2, null, '[]')) {
      minutesRemaining = time2.diff(now, 'minutes') + 1;
      console.log(minutesRemaining + " is left");
      if (minutesRemaining/60 > 1) {
        var hours = 1;
        var minutes = minutesRemaining - 60;
        minutesRemaining = hours + " " + minutes;
      }
      var nextClass;

      if (x+1 < sched.length) {
        if (sched[x+1][2].indexOf("Pre") == -1) {
          nextClass = "Next Class: " + sched[x+1][classRef];
        } else {
          nextClass = "Next Class: " + sched[x+2][classRef];
        }
      }

      if (nextClass == undefined) {
        nextClass = "You don't have a class after this.";
      }
      // return the current class, time remaining, and the next class
      if (minutesRemaining == undefined) {
        minutesRemaining = 1;
      }

      var stuffToReturn = [sched[x][classRef], minutesRemaining, nextClass, moment(sched[x][0], 'HH:mm').format('hh:mm a') + " - " + moment(sched[x][1], 'HH:mm').add(1, "minutes").format('hh:mm a')];
      console.log(stuffToReturn);
      return stuffToReturn;
    }


  }

}

function updateEveryMinute(currentMinutesLeft) {
  console.log("Dynamic update called!");
  var secondsCalledAt = moment().format("ss");
  console.log(secondsCalledAt);
  setTimeout(function() {
    currentMinutesLeft--;
    $("#minutesLeft").text(currentMinutesLeft + " minutes left");
    var interval = setInterval(function() {
      currentMinutesLeft--;
      $("#minutesLeft").text(currentMinutesLeft + " minutes left");
      $(window).unload(function() {
        clearInterval(interval);
      });
    }, 60000);
}, (59 - secondsCalledAt) * 1000);
}

function minutesDisplay(minutesRemaining) {
  if (minutesRemaining/60 > 1) {
    var hours = 1;
    var minutes = minutesRemaining - 60;
    minutesRemaining = hours + " " + minutes;
  } else if (minutesRemaining == 1) {
      minutesRemaining = "1 minute left";
    } else {
        minutesRemaining = minutesRemaining + " minutes left";
      }
      return minutesRemaining;
}

function init() {
    Tabletop.init( { key: "https://docs.google.com/spreadsheets/d/1YTNGp8Kb9Ey2Jwkvqp09rPi-9lBWwjWtlwWHMvG9zpw/edit?usp=sharing",
                     callback: showInfo,
                     simpleSheet: true } )
  }
function showInfo(data, tabletop) {
  // data[i].Last)
  if (username == undefined) {
    $('#releaseStatus').text("Set your username in settings to see Senior Release Status");
  } else {
    var isClear = true;
    var firstName = username.substring(0, username.indexOf(" "));
    var lastName = username.substring(username.indexOf(" ") + 1);
    var indexOfFirst, indexOfLast;
    for (var i = 0; i < data.length; i++) {
      if (data[i].First.indexOf(firstName) != -1) {
        indexOfFirst = i;
      }
      if (data[i].Last.indexOf(lastName) != -1) {
        indexOfLast = i;
      }
    }
    if (indexOfLast != undefined && indexOfFirst != undefined) {
      if (indexOfFirst == indexOfLast) {
        isClear = false;
      }
    }
    var status = isClear ? "Clear" : "Not clear <br> Click arrow for details";
    console.log(indexOfFirst + " " + indexOfLast);

    $('#releaseStatus').html(firstName + "'s <br> Release Status: <br>" + status);
    // var currentHeight = $("body").height();
    // var moreHeight = $("#releaseStatus").height();
    // $("body").height(currentHeight + moreHeight);
  }
    console.log(data);
  }
