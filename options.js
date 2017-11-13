// $(function() {
//   $("#save").click(save_options());
// });
function save_options() {

  var mondaySchedule, tuesdaySchedule, wednesdaySchedule, thursdaySchedule, fridaySchedule;

  var scheduleToLoad = $("#scheduleToLoad").val();
  chrome.storage.sync.set({
    // syntax
    scheduleToLoad: scheduleToLoad
      // favoriteColor: color,
      // likesColor: likesColor
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = "Schedule " + scheduleToLoad + " selected!";
      setTimeout(function() {
        status.textContent = '';
      }, 3000);
    });


// $("#selectedSchedule").text(savedSched());
// console.log(chrome.storage.sync.get(scheduleToLoad, function() {}));
}
document.getElementById('save').addEventListener('click',
    save_options);
