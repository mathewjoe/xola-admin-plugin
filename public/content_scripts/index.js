(function() {
   const reimporsonateEl = document.createElement('script');
   reimporsonateEl.src = chrome.extension.getURL('content_scripts/reimpersonate.js');

   const faker = document.createElement('script');
   faker.src = 'https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.js';
   const bookingGenerator = document.createElement('script');
   bookingGenerator.src = chrome.extension.getURL('content_scripts/booking_generator.js');


   function __reimpersonate() {
      (document.head || document.documentElement).appendChild(reimporsonateEl);
   }

   function __bookingGenerator() {
      (document.head || document.documentElement).appendChild(faker);
      (document.head || document.documentElement).appendChild(bookingGenerator);
  }

   chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.reimpersonate) {
         __reimpersonate();
      } else if (request.generateDemoBooking) {
        const text = prompt("You are about to generate bookings for a demo, Type GENERATE to proceed creating demo bookings", "");
        if(text && text.trim().toUpperCase() === 'generate'.trim().toUpperCase()) {
          __bookingGenerator()
        }
      }
   });
})();
