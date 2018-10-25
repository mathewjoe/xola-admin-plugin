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
         chrome.tabs.sendMessage(tab.id, {action: "reimpersonate"});
      } else if(itemData.menuItemId === "generateDemoBooking") {
        const isOnC02 = /^https:\/\/c02.xola.com/.test(tab.url);
        const isOnStable = /^https:\/\/stable.xola.com/.test(tab.url);
        const isOnSilent = /^https:\/\/silent.xola.com/.test(tab.url);
        const isOnDirect = /^https:\/\/direct.xola.com/.test(tab.url);
        if (isOnC02 || isOnStable || isOnSilent || isOnDirect) {
           alert("Do not create demo bookings on Prod");
        } else {
           chrome.tabs.sendMessage(tab.id, {action: "generateDemoBooking"});
        }
      }
   }
});

