(function () {
  const reimporsonateEl = document.createElement('script');
  reimporsonateEl.src = chrome.extension.getURL('content_scripts/reimpersonate.js');

  function __reimpersonate() {
    (document.head || document.documentElement).appendChild(reimporsonateEl);
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.reimpersonate) {
        __reimpersonate();
    }
  });
})();
