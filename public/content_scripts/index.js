const s = document.createElement('script');
s.src = chrome.extension.getURL('content_scripts/reimpersonate.js');

function __reimpersonate() {
   (document.head || document.documentElement).appendChild(s);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   if (request.reimpersonate) {
      __reimpersonate();
   }
});


