(function () {
  const reimporsonateEl = document.createElement('script')
  reimporsonateEl.src = chrome.extension.getURL('content_scripts/reimpersonate.js')
  const bookingGeneratorInjectorEl = document.createElement('script')
  bookingGeneratorInjectorEl.src = chrome.extension.getURL('content_scripts/booking_generator_injector.js')

  function __reimpersonate () {
    (document.head || document.documentElement).appendChild(reimporsonateEl)
  }

  function __bookingGenerator () {
    setTimeout(function () {
      const messengerDivEl = document.getElementById('demo-booking-generator')
      chrome.extension.sendMessage({
        action: 'backgroundDemoBookingGenerator',
        baseUrl: messengerDivEl.getAttribute('baseUrl'),
        apiKey: messengerDivEl.getAttribute('apiKey'),
        sellerId: messengerDivEl.getAttribute('sellerId')
      })
    }, 1000)
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
      case 'reimpersonate':
        __reimpersonate()
        break
      case 'generateDemoBooking':
        let isOnXola = /^https:\/\/xola.com/.test(document.location.origin)
        let isOnC02 = /^https:\/\/c02.xola.com/.test(document.location.origin)
        let isOnStable = /^https:\/\/c01.xola.com/.test(document.location.origin)
        let isOnSilent = /^https:\/\/silent.xola.com/.test(document.location.origin)
        let isOnDirect = /^https:\/\/direct.xola.com/.test(document.location.origin)
        if (!(isOnXola || isOnC02 || isOnStable || isOnSilent || isOnDirect)) {
          (document.head || document.documentElement).appendChild(bookingGeneratorInjectorEl)
          if (confirm('You are about to generate demo bookings?')) {
            __bookingGenerator()
          }
        } else {
          alert('Demo bookings cannot be made on production')
        }
        break
      default:
        break
    }
  })
})()
