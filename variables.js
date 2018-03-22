var mondaySchedule, tuesdaySchedule, wednesdaySchedule, thursdaySchedule, fridaySchedule;

var date = new Date();
var today = date.getDay();

var schoolStart = moment({hour: 9, minute: 20});
var schoolEnd = moment({hour: 16, minute: 30});

var offhours = [
  ["00:00", "23:59", "No class today.", "No class today.","No class today.","No class today."]
];

// mondaySchedule = [
// //     start, end, A, B, C, D
//   ["9:20","10:09","English", "Government", "SRD", "Comp Sci"],
//   ["10:10","10:14","Pre-Math", "Pre-English", "Pre-Gov", "Pre-SRD"],
//   ["10:15","10:54","Math", "English", "Government", "SRD"],
//   ["10:55","10:59","Pre-SRD", "Pre-Comp Sci", "Pre-Math", "Pre-Gov"],
//   ["11:00","11:39","SRD", "Comp Sci", "Math", "Government"],
//   ["11:40","12:29","Project Time", "Project Time", "Project Time", "Project Time"],
//   ["12:30","13:29","Lunch", "Lunch", "Lunch", "Lunch"],
//   ["13:30","14:09","Comp Sci", "SRD", "English", "Math"],
//   ["14:10","14:14","Pre-Gov", "Pre-Math", "Pre-Comp Sci", "Pre-English"],
//   ["14:15","14:44","Government", "Math", "Comp Sci", "English"],
//   ["14:45","15:59","Project Time", "Project Time", "Project Time", "Project Time"],
//   ["16:00","16:29","Clubs", "Clubs", "Clubs", "Clubs"],
// ];
//
// tuesdaySchedule = [
//   ["9:20","10:09","English", "Government", "SRD", "Comp Sci"],
//   ["10:10","10:14","Pre-Math", "Pre-English", "Pre-Gov", "Pre-SRD"],
//   ["10:15","10:54","Math", "English", "Government", "SRD"],
//   ["10:55","10:59","Pre-SRD", "Pre-Comp Sci", "Pre-Math", "Pre-Gov"],
//   ["11:00","11:39","SRD", "Comp Sci", "Math", "Government"],
//   ["11:40","11:44","Pre-Comp Sci", "Pre-SRD", "Pre-English", "Pre-Math"],
//   ["11:45","12:29","Comp Sci", "SRD", "English", "Math"],
//   ["12:30","13:29","Lunch", "Lunch", "Lunch", "Lunch"],
//   ["13:30","14:09","Government", "Math", "Comp Sci", "English"],
//   ["14:10","15:59","Project Time", "Project Time", "Project Time", "Project Time"],
//   ["16:00","16:29","Clubs", "Clubs", "Clubs", "Clubs"],
// ];
//
// wednesdaySchedule = [
//   ["9:20","10:09","English", "Government", "SRD", "Comp Sci"],
//   ["10:10","10:14","Pre-Math", "Pre-English", "Pre-Gov", "Pre-SRD"],
//   ["10:15","10:54","Math", "English", "Government", "SRD"],
//   ["10:55","10:59","Pre-SRD", "Pre-Comp Sci", "Pre-Math", "Pre-Gov"],
//   ["11:00","11:39","SRD", "Comp Sci", "Math", "Government"],
//   ["11:40","12:29","Project Time", "Project Time", "Project Time", "Project Time"],
//   ["12:30","13:29","Lunch", "Lunch", "Lunch", "Lunch"],
//   ["13:30","14:09","Comp Sci", "SRD", "English", "Math"],
//   ["14:10","14:14","Pre-Gov", "Pre-Math", "Pre-Comp Sci", "Pre-English"],
//   ["14:15","14:49","Government", "Math", "Comp Sci", "English"],
//   ["14:50", "16:29", "Senior Release", "Senior Release", "Senior Release", "Senior Release"],
// ];
//
// thursdaySchedule = [
//   ["9:20","10:09","English", "Government", "SRD", "Comp Sci"],
//   ["10:10","10:14","Pre-Math", "Pre-English", "Pre-Gov", "Pre-SRD"],
//   ["10:15","10:54","Math", "English", "Government", "SRD"],
//   ["10:55","10:59","Pre-SRD", "Pre-Comp Sci", "Pre-Math", "Pre-Gov"],
//   ["11:00","11:39","SRD", "Comp Sci", "Math", "Government"],
//   ["11:40","11:44","Pre-Comp Sci", "Pre-SRD", "Pre-English", "Pre-Math"],
//   ["11:45","12:29","Comp Sci", "SRD", "English", "Math"],
//   ["12:30","13:29","Lunch", "Lunch", "Lunch", "Lunch"],
//   ["13:30","14:09","Government", "Math", "Comp Sci", "English"],
//   ["14:10","15:59","Project Time", "Project Time", "Project Time", "Project Time"],
//   ["16:00","16:29","Satellite", "Satellite", "Satellite", "Satellite"],
// ];
//
// fridaySchedule = [
//   ["9:20","10:29","Titan Time", "Titan Time", "Titan Time", "Titan Time"],
//   ["10:30","11:09","English", "Government", "SRD", "Comp Sci"],
//   ["11:10","11:49","Math", "English", "Government", "SRD"],
//   ["11:50","12:29","SRD", "Comp Sci", "Math", "Government"],
//   ["12:30","13:29","Lunch", "Lunch", "Lunch", "Lunch"],
//   ["13:30","14:09","Comp Sci", "SRD", "English", "Math"],
//   ["14:10","14:49","Government", "Math", "Comp Sci", "English"],
//   ["14:50", "16:29", "Senior Release", "Senior Release", "Senior Release", "Senior Release"],
// ];

var names = [
"Paige Adams",
"Evan	Allen",
"Hunter	Avila",
"Syed Baber",
"Jim Bacani",
"Johnathan Bates",
"Robert	Beno",
"Hannah Bernett",
"Maison Bertrand",
"Zachary Blakley",
"Daniel Bock",
"Emily Booth",
"Matthew Brantley",
"Seeret Brar",
"Daniel Brooks",
"Greg Carlin",
"Taylor Carson",
"Caden Casanova",
"Jasmine Cao",
"Angelica Castillo",
"Sophia Caton",
"Daniel Choi",
"Elliott Coldwell",
"Purvi Contractor",
"Lindsey Crews",
"Eric Davis",
"Micah Day",
"Angela Dearen",
"Robert Dooley",
"John Doyle",
"Dominique Duncan",
"Noah Farber",
"Alex Faulkenbury",
"Mizuki Feist",
"Cassie Fochtman",
"Olivia George",
"Rohan Golla",
"Jordan Grant",
"Samuel Green",
"Marie Guerin",
"Alanna Headley",
"Alan Holmes",
"Brandon Huynh",
"Kyle Jackson",
"Nicole Jennings",
"Philip Kaltenbach",
"Amin Kedwaii",
"Mia Kloepfer",
"Heather Kurtzman",
"Kari Lance",
"James Lemon",
"Chris Livingston",
"Samuel Lowrance",
"Emily Lu",
"Jonathan Main",
"Usaid Malik",
"Devyn Mandala",
"Emma Martinez",
"Alex Matthews",
"Brendan McMahan",
"Dillon McMahan",
"Aava Mobasseri",
"Sean Newman",
"Annette Nguyen",
"Trent Norvell",
"Alex Oliver",
"Cedrick Patton",
"Darian Payma",
"Michael Raab",
"Saatvi Rajgopal",
"David Reeder",
"Jake Reilly",
"Heidi Riddle",
"Luke Ritchie",
"Myles Ritter",
"Zane Salamah",
"Jacob Schwab",
"Margaret Seastrand",
"Emily Seaton",
"Joshua Shaffer",
"Benjamin Simon",
"David Smerkous",
"Eli Smith",
"Nicolas Smith",
"Linnea Stahl",
"Larry Stanley",
"Sam Stidd",
"Katelynn Summers",
"Ben Tackett",
"Andrew Tackett",
"Ethan Tiscareno",
"Danteh Trevino",
"Alon Tzur",
"Juani Vargas",
"Rhyse Vogt",
"Riley Walker",
"Emily Ward",
"Andrew Ware",
"Jordan Wisor",
"Gracyn Womeldorph",
"Ryan York",
"Jacelyn	Young"
];

// HOW TO SAVE AND GET
// var a = {'test':123};
// local.set('valueA', a);
// localStorage.removeItem(key);

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
