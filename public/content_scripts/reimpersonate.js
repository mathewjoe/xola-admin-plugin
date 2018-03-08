if (window.app && window.seller) {
   const apiKey = window.app.getApiKey();
   window.location = `${document.location.origin}/seller#seller=${window.seller.id}#apiKey=${apiKey}`;
   window.location.reload();
}
