var manifestData = chrome.runtime.getManifest();
$("#versionDisplay").text("Version " + manifestData.version);
function save_options() {

  var mondaySchedule, tuesdaySchedule, wednesdaySchedule, thursdaySchedule, fridaySchedule;

  var scheduleToLoad = $("#scheduleToLoad").val();
  var selectedTheme = $("#theme").val();
  console.log(selectedTheme + " was loaded or something");
  chrome.storage.sync.set({
    // syntax
    scheduleToLoad: scheduleToLoad,
    selectedTheme: selectedTheme
      // favoriteColor: color,
      // likesColor: likesColor
    }, function() {
      var status = document.getElementById('status');
      status.textContent = "Settings saved!";
      setTimeout(function() {
        status.textContent = '';
      }, 3000);
    });


// $("#selectedSchedule").text(savedSched());
// console.log(chrome.storage.sync.get(scheduleToLoad, function() {}));
}
document.getElementById('save').addEventListener('click',
    save_options);
