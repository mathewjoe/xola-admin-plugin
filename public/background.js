/* global chrome */
chrome.runtime.onInstalled.addListener(details => {
   chrome.contextMenus.create({
      title: 'Re-impersonate',
      id: 'reimpersonate'
   });
  chrome.contextMenus.create({
    title: 'Generate Demo Bookings',
    id: 'generateDemoBooking'
  });
});

chrome.contextMenus.onClicked.addListener(function(itemData, tab) {
   if (/xola[a-z.]*\/seller/.test(tab.url)) {
      if (itemData.menuItemId === "reimpersonate") {
         chrome.tabs.sendMessage(tab.id, {reimpersonate: true});
      } else if(itemData.menuItemId === "generateDemoBooking") {
        chrome.tabs.sendMessage(tab.id, {generateDemoBooking: true});
      }
   }
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse){
    if(request.msg == "startFunc") func();
  }
);