(function () {
  const reimporsonateEl = document.createElement('script')
  reimporsonateEl.src = chrome.extension.getURL('content_scripts/reimpersonate.js')
  const bookingGeneratorInjectorEl = document.createElement('script')
  bookingGeneratorInjectorEl.src = chrome.extension.getURL('content_scripts/booking_generator_injector.js')

  function __reimpersonate () {
    (document.head || document.documentElement).appendChild(reimporsonateEl)
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
      case 'reimpersonate':
        __reimpersonate()
        break
      case 'generateBookings':
        (document.head || document.documentElement).appendChild(bookingGeneratorInjectorEl)

        let message = "How many bookings do you want to generate? (Max: 100) \n\nNote: The actual number of bookings generated could be lower than this number because of lack of availability, API errors etc..\n"
        let requiredCount = prompt(message, '50');
        if (requiredCount) {
          setTimeout(function () {
            const messengerDivEl = document.getElementById('demo-booking-generator')
            chrome.extension.sendMessage({
              action: 'backgroundBookingGenerator',
              baseUrl: messengerDivEl.getAttribute('baseUrl'),
              apiKey: messengerDivEl.getAttribute('apiKey'),
              sellerId: messengerDivEl.getAttribute('sellerId'),
              requiredCount: requiredCount
            })
          }, 1000)
        }
        break
    }
  })
})()
