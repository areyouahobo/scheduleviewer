var selectedSchedule = "A";
var selectedTheme = "Classic";
var backgroundColor, headerColor, headerTextColor, textColor, buttonColor, buttonTextColor, nameList, username;

var fullMoment = moment();
var now = moment({hour: fullMoment.get('hour'), minute: fullMoment.get('minutes')});
var dayName = fullMoment.format("dddd");

chrome.runtime.requestUpdateCheck(function(status) {
  if (status == "update_available") {
    console.log("Update available");
  } else if (status == "no_update") {
    console.log("No updates needed");
  }
});

chrome.runtime.onUpdateAvailable.addListener(function(details) {
  console.log("Updating to " + details.version);
  chrome.runtime.reload();
});

chrome.storage.sync.get(['scheduleToLoad', 'selectedTheme', 'backgroundColor', 'headerColor',
  'textColor', 'buttonColor', 'buttonTextColor', 'username'], function(data) {
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

var date = new Date();
var today = date.getDay();

if (now.isBetween(schoolStart, schoolEnd, null, '[]')) {
  switch (today) {
    case 0:
    $("#schedHeader").text("Sunday");
    $("#currentClass").text("No class today.");
    break;

    case 1:
    createView(mondaySchedule);
    break;

    case 2:
    createView(tuesdaySchedule);
    break;

    case 3:
    createView(wednesdaySchedule);
    break;

    case 4:
    createView(thursdaySchedule);
    break;

    case 5:
    createView(fridaySchedule);
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

function createView(sched) {
  $("#schedHeader").text(dayName);
  $("#currentClass").text(scheduleCalc(sched)[0]);
  var mins = minutesDisplay(scheduleCalc(sched)[1]);
  var minsToDisplay = mins;
  var query = /[0-9][\s][0-9]/;

  if (query.test(mins)) {
    minsToDisplay = mins[0] + " hour and " + mins.substring(mins.indexOf(" ") + 1);
    if (minsToDisplay.indexOf("minutes") != -1) {
      minsToDisplay = minsToDisplay.replace("minutes", "minute");
    }
  }

  $("#minutesLeft").text(minsToDisplay);
  $("#timeRange").text(scheduleCalc(sched)[3]);
  updateEveryMinute(scheduleCalc(sched)[1]);
  $("#nextClass").text(scheduleCalc(sched)[2]);
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
    var time1 = moment({hour: sched[x][0].substring(0, sched[x][0].indexOf(":")),
      minute: sched[x][0].substring(sched[x][0].indexOf(":") + 1)});
    var time2 = moment({hour: sched[x][1].substring(0, sched[x][1].indexOf(":")),
      minute: sched[x][1].substring(sched[x][1].indexOf(":") + 1)});
    var minutesRemaining = 0;

    if (now.isBetween(time1, time2, null, '[]')) {
      minutesRemaining = time2.diff(now, 'minutes') + 1;

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
      minutesRemaining = minutesRemaining == undefined ? 1 : minutesRemaining;

      var stuffToReturn = [sched[x][classRef], minutesRemaining, nextClass,
        moment(sched[x][0], 'HH:mm').format('hh:mm a') + " - " + moment(sched[x][1], 'HH:mm').add(1, "minutes").format('hh:mm a')];

      return stuffToReturn;
    }
  }
}

function updateEveryMinute(currentMinutesLeft) {
  var secondsCalledAt = moment().format("ss");

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
  console.log(data);
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
    console.log(indexOfFirst + " " + indexOfLast);
    if (indexOfLast != undefined && indexOfFirst != undefined) {
      isClear = !(indexOfFirst == indexOfLast);
    }
    console.log("isClear = " + isClear);

    var status = isClear ? "Clear" : "Not clear <br> See <a href=\"https:\/\/docs.google.com/spreadsheets/d/1re8tmdTfL0bM2Sz5ZP-op6u61KzGKNuXynn1xdEItac/edit#gid=947522328\" target=\"_blank\">here</a> for details.";

    $('#releaseStatus').html(firstName + "'s <br> Release Status: <br>" + status);
  }
}
