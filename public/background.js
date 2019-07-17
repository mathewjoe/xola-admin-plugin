/* global chrome */
chrome.runtime.onInstalled.addListener(details => {
    chrome.contextMenus.create({
        title: 'Re-impersonate',
        id: 'reimpersonate'
    });
});

chrome.contextMenus.onClicked.addListener(function (itemData, tab) {
    if (/xola[a-z.]*\/seller/.test(tab.url)) {
        if (itemData.menuItemId === 'reimpersonate') {
            chrome.tabs.sendMessage(tab.id, {action: 'reimpersonate'})
        }
    }
});

