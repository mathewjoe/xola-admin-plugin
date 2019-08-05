/* global chrome */
chrome.runtime.onInstalled.addListener(details => {
    chrome.contextMenus.create({
        title: 'Re-impersonate',
        id: 'reimpersonate'
    });
});

chrome.contextMenus.onClicked.addListener(function (itemData, tab) {
    if (itemData.menuItemId === 'reimpersonate' && /xola[a-z.]*\/seller/.test(tab.url)) {
        chrome.tabs.sendMessage(tab.id, {reimpersonate: true});
    }
});

