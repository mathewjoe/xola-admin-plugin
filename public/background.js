/* global chrome */
chrome.runtime.onInstalled.addListener(details => {
    chrome.contextMenus.create({
        title: 'Re-impersonate',
        id: 'reimpersonate'
    })

    const bookingGeneratorWhitelist = [
        'http://xola.local/seller',
        'https://sandbox1.xola.com/seller',
        'https://staging1.xola.com/seller',
    ];

    chrome.contextMenus.create({
        title: 'Generate Demo Bookings',
        id: 'generateDemoBooking',
        documentUrlPatterns: bookingGeneratorWhitelist
    })
})

chrome.contextMenus.onClicked.addListener(function (itemData, tab) {
    if (/xola[a-z.]*\/seller/.test(tab.url)) {
        if (itemData.menuItemId === 'reimpersonate') {
            chrome.tabs.sendMessage(tab.id, {action: 'reimpersonate'})
        } else if (itemData.menuItemId === 'generateDemoBooking') {
            chrome.tabs.sendMessage(tab.id, {action: 'generateDemoBooking'})
        }
    }
})

