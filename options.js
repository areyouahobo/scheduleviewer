var manifestData = chrome.runtime.getManifest();
$("#versionDisplay").text("Version " + manifestData.version);
chrome.storage.local.get(['scheduleToLoad', 'selectedTheme', 'backgroundColor', 'headerColor', 'textColor', 'buttonColor', 'buttonTextColor', 'username'], function(data) {
    selectedSchedule = data.scheduleToLoad;
    selectedTheme = data.selectedTheme;
    backgroundColor = data.backgroundColor;
    headerColor = data.headerColor;
    headerTextColor = data.headerTextColor;
    textColor = data.textColor;
    buttonColor = data.buttonColor;
    buttonTextColor = data.buttonTextColor;
    username = data.username;
});
$(function(ready){
  var namesToAdd = '';
for (var i=0; i< names.length; i++){
   namesToAdd += '<option value="'+ names[i] + '">' + names[i] + '</option>';
}
$('#nameSelect').append(namesToAdd);

  if (username != undefined) {
    $('#nameSelect').val(username);
  }

  if (selectedSchedule == undefined) {
    selectedSchedule = "A";
  }
  if (selectedTheme == undefined) {
    selectedTheme = "Classic";
  }
  $("#scheduleToLoad").val(selectedSchedule);
  $("#theme").val(selectedTheme);
  if (headerColor != undefined) {
    $("#backgroundPick").val(backgroundColor);
    $("#headerPick").val(headerColor);
    $("#headerTextPick").val(headerTextColor);
    $("#textPick").val(textColor);
    $("#buttonColorPick").val(buttonColor);
    $("#buttonTextPick").val(buttonTextColor);
  }
  if ($("#theme").val() == "Custom") {
    $(".customPicks").css({"visibility":"visible", "display":"block"});
    $("#colorSelection").css({"visibility":"visible", "display":"block"});
  }

    $('#theme').change(function() {
        if ($(this).val() == 'Custom') {
      $(".customPicks").css({"visibility":"visible", "display":"block"});
      $("#colorSelection").css({"visibility":"visible", "display":"block"});
    } else {
      $(".customPicks").css({"visibility":"hidden", "display":"none"});
      $("#colorSelection").css({"visibility":"hidden", "display":"none"});
    }
    });
});
function save_options() {

  var mondaySchedule, tuesdaySchedule, wednesdaySchedule, thursdaySchedule, fridaySchedule;

  var scheduleToLoad = $("#scheduleToLoad").val();
  var selectedTheme = $("#theme").val();
  var backgroundColor = $("#backgroundPick").val();
  var headerColor = $("#headerPick").val();
  var headerTextColor = $("#headerTextPick").val();
  var textColor = $("#textPick").val();
  var buttonColor = $("#buttonColorPick").val();
  var buttonTextColor = $("#buttonTextPick").val();
  var username = $('#nameSelect').val();
  chrome.storage.sync.set({
    // syntax
    scheduleToLoad: scheduleToLoad,
    selectedTheme: selectedTheme,
    backgroundColor: backgroundColor,
    headerColor: headerColor,
    headerTextColor: headerTextColor,
    textColor: textColor,
    buttonColor: buttonColor,
    buttonTextColor: buttonTextColor,
    username: username


      // favoriteColor: color,
      // likesColor: likesColor
    }, function() {
      var status = document.getElementById('status');
      status.textContent = "Settings saved!";
      setTimeout(function() {
        status.textContent = '';
      }, 3000);
    });

}
document.getElementById('save').addEventListener('click',
    save_options);
