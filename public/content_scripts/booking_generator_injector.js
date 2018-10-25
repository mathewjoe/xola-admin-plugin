const bookingGeneratorInjectorDiv = document.createElement("div");
bookingGeneratorInjectorDiv.setAttribute("class", "demo-booking-generator");
bookingGeneratorInjectorDiv.setAttribute("id", "demo-booking-generator");
bookingGeneratorInjectorDiv.setAttribute("sellerId", window.seller.id);
bookingGeneratorInjectorDiv.setAttribute("apiKey", window.app.getApiKey());
bookingGeneratorInjectorDiv.setAttribute("baseUrl", document.location.origin);
(document.head || document.documentElement).appendChild(bookingGeneratorInjectorDiv);
