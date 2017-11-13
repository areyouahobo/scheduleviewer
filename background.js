// chrome.browserAction.onClicked.addListener(function(tab) {
//    chrome.tabs.executeScript(null, {file: "content.js"});
// });

// ,
// "default_popup": "popup.html"
// chrome.browserAction.onClicked.addListener(function(tab) { alert('icon clicked')});
chrome.browserAction.setPopup({popup: "popup.html"});
