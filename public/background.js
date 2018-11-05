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
        title: 'Generate Bookings',
        id: 'generateBookings',
        documentUrlPatterns: bookingGeneratorWhitelist
    })
})

chrome.contextMenus.onClicked.addListener(function (itemData, tab) {
    if (/xola[a-z.]*\/seller/.test(tab.url)) {
        if (itemData.menuItemId === 'reimpersonate') {
            chrome.tabs.sendMessage(tab.id, {action: 'reimpersonate'})
        } else if (itemData.menuItemId === 'generateBookings') {
            chrome.tabs.sendMessage(tab.id, {action: 'generateBookings'})
        }
    }
})

