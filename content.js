var selectedSchedule;

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
      runMe();
  });

});

function runMe() {
$("#optionsLink").click(function() {
  chrome.runtime.openOptionsPage();
})
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.storage.sync.set({ scheduleToLoad: A });
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});



var offhours = [
  ["00:00", "23:59", "No class today.", "No class today.","No class today.","No class today."]
];

var date = new Date();
var today = date.getDay();
var now = moment();
var schoolStart = "9:20";
var schoolEnd = "16:30";

console.log("Number for today: " + today);

if (now.isBetween(schoolStart, schoolEnd, null, '[]')) {
  switch (today) {
    case 0:
    $("#schedHeader").text("Saturday");
    $("#currentClass").text("No class today.");
    break;
    case 1:
    $("#schedHeader").text("Monday");
    $("#currentClass").text(scheduleCalc(mondaySchedule)[0]);
    $("#minutesLeft").text(scheduleCalc(mondaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(mondaySchedule)[2]);
    break;
    case 2:
    $("#schedHeader").text("Tuesday");
    $("#currentClass").text(scheduleCalc(tuesdaySchedule)[0]);
    $("#minutesLeft").text(scheduleCalc(tuesdaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(tuesdaySchedule)[2]);
    break;
    case 3:
    $("#schedHeader").text("Wednesday");
    $("#currentClass").text(scheduleCalc(wednesdaySchedule)[0]);
    $("#minutesLeft").text(scheduleCalc(wednesdaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(wednesdaySchedule)[2]);
    break;
    case 4:
    $("#schedHeader").text("Thursday");
    $("#currentClass").text(scheduleCalc(thursdaySchedule)[0]);
    $("#minutesLeft").text(scheduleCalc(thursdaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(thursdaySchedule)[2]);
    break;
    case 5:
    $("#schedHeader").text("Friday");
    $("#currentClass").text(scheduleCalc(fridaySchedule)[0]);
    $("#minutesLeft").text(scheduleCalc(fridaySchedule)[1]);
    $("#nextClass").text(scheduleCalc(fridaySchedule)[2]);
    break;

    case 6:
    $("#schedHeader").text("Saturday");
    $("#currentClass").text("No class today.");
    break;
  }
}/* else {
  $("#schedHeader").text(now.format('dddd'));
  $("#currentClass").text("No class right now.");
}*/
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
    if (now.isBetween(time1, time2, null, '[]')) {
      var minutesRemaining = time2.diff(now, 'minutes') + 2;
      if (minutesRemaining/60 > 1) {
        var hours = 1;
        var minutes = minutesRemaining - 60;
        minutesRemaining = hours + " hour and " + minutes + " minutes left";
      } else if (minutesRemaining == 1) {
          minutesRemaining = "1 minute left";
        } else {
            minutesRemaining = minutesRemaining + " minutes left";
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
      var stuffToReturn = [sched[x][classRef], minutesRemaining, nextClass];
      return stuffToReturn;
    }


  }

}
