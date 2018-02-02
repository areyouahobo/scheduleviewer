var selectedSchedule = "A";
var selectedTheme = "Classic";
var backgroundColor, headerColor, headerTextColor, textColor, buttonColor, buttonTextColor, nameList, username, accessedToDo;
var oneRun = false;
var fullMoment = moment();
var now = moment({
	hour: fullMoment.get('hour'),
	minute: fullMoment.get('minutes')
});
var dayName = fullMoment.format("dddd");
var local = (function() {
	var setData = function(key, obj) {
		var values = JSON.stringify(obj);
		localStorage.setItem(key, values);
	}
	var getData = function(key) {
		if (localStorage.getItem(key) != null) {
			return JSON.parse(localStorage.getItem(key));
		} else {
			return false;
		}
	}
	var updateDate = function(key, newData) {
		if (localStorage.getItem(key) != null) {
			var oldData = JSON.parse(localStorage.getItem(key));
			for (keyObj in newData) {
				oldData[keyObj] = newData[keyObj];
			}
			var values = JSON.stringify(oldData);
			localStorage.setItem(key, values);
		} else {
			return false;
		}
	}
	return {
		set: setData,
		get: getData,
		update: updateDate
	}
})();
chrome.runtime.onUpdateAvailable.addListener(function(details) {
	chrome.runtime.reload();
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
chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == "install") {
		chrome.storage.sync.set({
			scheduleToLoad: A
		});
	}
});
$(function() {
	$("#releaseStatus").text("Loading...");
	setTimeout(function() {
		if ($("#releaseStatus").text() == "Loading...") {
			$("#releaseStatus").text("Loading... (still)");
		}
	}, 5000);
	$("#arrowDrop").click(function() {
		if ($(this).text() == ">") {
			$("#releaseStatus").fadeOut(function() {
				$("#releaseDetails").css({
					"visibility": "visible",
					"display": "inline"
				});
				$("#arrowDrop").text("<");
			});
		} else if ($(this).text() == "<") {
			$("#releaseDetails").fadeOut(function() {
				$("#releaseStatus").css({
					"visibility": "visible",
					"display": "inline"
				});
				$("#arrowDrop").text(">");
			});
		}
	});
	// HOW TO SAVE AND GE`T
	// var a = {'test':123};
	// local.set('valueA', a);
	// localStorage.removeItem(key);
	console.log(local.get('listOfToDos'));
	$.each(local.get('listOfToDos'), function(key, value) {
		if (value.indexOf("^") != -1) {
			value = value.substring(0, value.length - 1);
			$("ul#list").append('<li class="checked">' + value + "</li>");
		} else {
			$("ul#list").append('<li id="new">' + value + "</li>");
			$("#new").removeClass("checked");
			$("#new").removeAttr("new");
		}
	});
	$("#list li").click(function() {
		$(this).toggleClass("checked");
		saveToDo();
	});
});

function saveToDo() {
	var saveToDo = {};
	var listElements = $("#list li").length;
	$.each($("ul#list li"), function(index) {
		var entry = $("ul#list li").eq(index).text();
		saveToDo[index] = entry;
		if ($(this).hasClass('checked')) {
			saveToDo[index] += "^";
			console.log($(this).text() + " has class");
		}
	});
	local.set('listOfToDos', saveToDo, "cool");
	console.log(local.get('listOfToDos'));
}

function runMe() {
	if (!oneRun) {
		init();
	}
	$("#optionsLink").click(function() {
		chrome.runtime.openOptionsPage();
	});
	$("#todo-clear").click(function() {
		$.each($("ul#list li"), function(index) {
			if ($(this).hasClass('checked')) {
				$(this).remove();
			}
		});
		saveToDo();
	});
	$("#todo").click(function() {
		if ($("body").width() == "200") {
			$("html, body").width("375px");
			$(".todos").css({
				"visibility": "visible",
				"display": "inline-block"
			});
			$("#todoHeader").css({
				"visibility": "visible",
				"display": "inline-block"
			});
		} else if ($("body").width() == "375") {
			$("html, body").width("200px");
			$(".todos").css({
				"visibility": "hidden",
				"display": "none"
			});
			$("#todoHeader").css({
				"visibility": "hidden",
				"display": "none"
			});
		}
	});
	$("#todo-add").keypress(function(event) {
		var pressed = event.which;
		if (pressed == 13) {
			$("#list").append('<li>' + $("#todo-add").val() + "</li>");
			$("#todo-add").val("");
			$("ul#list li").click(function() {
				$(this).toggleClass("checked");
			});
			saveToDo();
		}
	});
	$("ul li").click(function() {
		$(this).toggleClass("checked");
	});
	if (selectedTheme == "Midnight") {
		$("body").css({
			"background-color": "black",
			"color": "white"
		});
		$("#optionsLink").css({
			"background-color": "gray",
			"color": "white",
			"border-color": "gray"
		});
		$("#todo-clear").css({
			"background-color": "gray",
			"color": "white",
			"border-color": "gray"
		});
		$("#todo").css({
			"background-color": "#000",
			"color": "white",
			"border-color": "white"
		});
		$("#todo-add").css({
			"background-color": "#000",
			"color": "white",
			"border": "0px"
		});
		$("#divider").css({
			"background-color": "#FFF"
		});
		$("ul li").hover(function() {
			$(this).css({
				"background-color": "gray"
			});
		}, function() {
			$(this).css({
				"background-color": "black"
			});
		});
	}
	if (selectedTheme == "Custom") {
		$("body").css({
			"background-color": backgroundColor,
			"color": textColor
		});
		$("#todo").css({
			"background-color": backgroundColor,
			"color": textColor
		});
		$("#divider").css({
			"background-color": headerColor,
			"color": headerTextColor
		});
		$("#optionsLink").css({
			"background-color": buttonColor,
			"color": buttonTextColor,
			"border-color": buttonColor
		});
		$("#todo-clear").css({
			"background-color": buttonColor,
			"color": buttonTextColor,
			"border-color": buttonColor
		});
		$("#titleSection").css({
			"background-color": headerColor,
			"color": headerTextColor
		});
		$("#todo").css({
			"background-color": "#F9F9F9",
			"color": "black",
			"border": "0"
		});
	}
	var date = new Date();
	var today = date.getDay();
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
	if ($("#currentClass").text() != "Nothing right now") {
		if (selectedSchedule == undefined) {
			$("#selectedSchedule").text("Schedule A");
		} else {
			$("#selectedSchedule").text("Schedule " + selectedSchedule);
		}
	}
}

function createView(sched) {
	$("#schedHeader").text(dayName);
	try {
		$("#currentClass").text(scheduleCalc(sched)[0]);
	} catch (TypeError) {
		$("#currentClass").text("Nothing right now");
	}
	try {
		$("#timeRange").text(scheduleCalc(sched)[3]);
	} catch (TypeError) {}
	try {
		$("#nextClass").text(scheduleCalc(sched)[2]);
	} catch (TypeError) {
		$("#nextClass").html("First Classes:<div align=\"left\" style=\"left:46px; position: relative;\">A - English<br>B - Government<br>C - SRD<br>D - Comp Sci<br></div>");
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
		var time1 = moment({
			hour: sched[x][0].substring(0, sched[x][0].indexOf(":")),
			minute: sched[x][0].substring(sched[x][0].indexOf(":") + 1)
		});
		var time2 = moment({
			hour: sched[x][1].substring(0, sched[x][1].indexOf(":")),
			minute: sched[x][1].substring(sched[x][1].indexOf(":") + 1)
		});
		var minutesRemaining = 0;
		if (now.isBetween(time1, time2, null, '[]')) {
			minutesRemaining = time2.diff(now, 'minutes') + 1;
			var nextClass;
			if (x + 1 < sched.length) {
				if (sched[x + 1][2].indexOf("Pre") == -1) {
					nextClass = "Next Class: " + sched[x + 1][classRef];
				} else {
					nextClass = "Next Class: " + sched[x + 2][classRef];
				}
			}
			if (nextClass == undefined) {
				nextClass = "No upcoming class";
			}
			// return the current class, time remaining, and the next class
			minutesRemaining = minutesRemaining == undefined ? 1 : minutesRemaining;
			var hoursRemaining = minutesRemaining > 60 ? Math.floor(minutesRemaining / 60) : 0;
			minutesRemaining = hoursRemaining > 0 ? minutesRemaining - (hoursRemaining * 60) : minutesRemaining;
			var stuffToReturn = [sched[x][classRef], minutesRemaining, nextClass,
				moment(sched[x][0], 'HH:mm').format('hh:mm a') + " - " + moment(sched[x][1], 'HH:mm').add(1, "minutes").format('hh:mm a')
			];
			var secondsCalledAt = moment().format("ss");
			var hourString = " hours,";
			var minuteString = " minutes left";
			if (hoursRemaining == 1) {
				hourString = " hour,";
			}
			if (minutesRemaining == 1) {
				minuteString = " minute left";
			}
			if (hoursRemaining > 0) {
				$("#minutesLeft").html(hoursRemaining + hourString + "<br>" + minutesRemaining + minuteString);
			} else {
				$("#minutesLeft").text(minutesRemaining + minuteString);
			}
			setTimeout(function() {
				fullMoment = moment();
				now = moment({
					hour: fullMoment.get('hour'),
					minute: fullMoment.get('minutes')
				});
				runMe();
			}, (60 - secondsCalledAt) * 1000);
			return stuffToReturn;
		}
	}
}

function minutesDisplay(minutesRemaining) {
	if (minutesRemaining / 60 > 1) {
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
	Tabletop.init({
		key: "https://docs.google.com/spreadsheets/d/1YTNGp8Kb9Ey2Jwkvqp09rPi-9lBWwjWtlwWHMvG9zpw/edit?usp=sharing",
		callback: showInfo,
		simpleSheet: true
	})
}

function showInfo(data, tabletop) {
	// data[i].Last)
	if (!oneRun) {
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
			if (indexOfLast != undefined && indexOfFirst != undefined) {
				isClear = !(indexOfFirst == indexOfLast);
			}
			var status = isClear ? "Clear" : "Not clear, click arrow to see details";
			var details;
			var reasons = "";
			if (!isClear) {
				$("#arrowDrop").css({
					"visibility": "visible",
					"display": "inline"
				});
				details = data[indexOfLast].Reason;
				var listOfDetails = details.split("%");
				for (var i = 0; i < listOfDetails.length; i++) {
					if (listOfDetails[i] == "") {
						listOfDetails[i] = "<br>";
					}
					if (listOfDetails[i].indexOf("Paquette") != -1) {
						listOfDetails[i] = "Paquette";
					}
					reasons += listOfDetails[i];
				}
			}
		}
		if (firstName != undefined && status != undefined) {
			$('#releaseStatus').html(firstName + "'s Status:<br>" + status);
			$('#releaseDetails').html('<span style="font-style: oblique;">Details:</span>' + reasons);
		} else {
			$('#releaseStatus').text("Set your username in settings to see Senior Release Status");
		}
		var lines = (reasons.match(new RegExp("<br>", "g")) || []).length;
		var lineHeight = $("#releaseDetails").css("line-height");
		var detailsHeight = $("#nextClass").offset().bottom - $("#arrowDrop").offset().top;
		$("#releaseDetails").height(detailsHeight);
		var setter = detailsHeight / (lines + 1) + "px";
		$('#releaseDetails').css({
			"line-height": setter + "px",
			"font-size": setter / 2 + "px"
		});
	}
	oneRun = true;
}
