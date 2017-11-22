var selectedSchedule;
var selectedTheme;

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



$(function checkSettings() {
  chrome.storage.sync.get('scheduleToLoad', function(data) {
      console.log("The value is " + data.scheduleToLoad);
      selectedSchedule = data.scheduleToLoad;
      chrome.storage.sync.get('selectedTheme', function(data) {
          console.log("Selected Theme " + data.theme);
          selectedTheme = data.theme;
          runMe();
      });
  });

});

function runMe() {
$("#optionsLink").click(function() {
  chrome.runtime.openOptionsPage();
})
chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason == "install"){
        chrome.storage.sync.set({ scheduleToLoad: A });
    } else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

init();

if (selectedTheme == "Dark") {
  $("body").css("background-color", "black");
}


var offhours = [
  ["00:00", "23:59", "No class today.", "No class today.","No class today.","No class today."]
];

var date = new Date();
var today = date.getDay();
var now = moment();
var schoolStart = moment({hour: 9, minute: 20});
var schoolEnd = moment({hour: 16, minute: 30});



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
    var time1 = moment(sched[x][0], "hh:mm");
    var time2 = moment(sched[x][1], "hh:mm");
    var now = moment();
    var rightNow = moment(now);
    if (rightNow.isBetween(time1, time2, null, '[]')) {
      var minutesRemaining = time2.diff(now, 'minutes') + 2;
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
          try {
          nextClass = "Next Class: " + sched[x+2][classRef];
        } catch (e) {
            nextClass = "";
          }
        }
      }

      if (nextClass == undefined) {
        nextClass = "You don't have a class after this.";
      }
      // return the current class, time remaining, and the next class
      var stuffToReturn = [sched[x][classRef], minutesRemaining, nextClass, moment(sched[x][0], 'HH:mm').format('hh:mm a') + " - " + moment(sched[x][1], 'HH:mm').add(1, "minutes").format('hh:mm a')];
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
    Tabletop.init( { key: "https://docs.google.com/spreadsheets/d/1itsGeLY5A7tokzq45vtFHJ6QszcF7OT5_92MgR8OoZs/edit?usp=sharing",
                     callback: showInfo,
                     simpleSheet: true } )
  }
function showInfo(data, tabletop) {
    console.log(data);
  }
