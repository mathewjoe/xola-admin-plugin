import $ from "jquery";

const ENV = {
   getHeaders(env) {
      const headers = {};
      if (env.apiKey) {
         headers["X-API-KEY"] = env.apiKey;
      } else {
         headers["Authorization"] = "Basic " + btoa(`${env.email}:${env.password}`)
      }
      return headers;
   },

   getAdmin(env) {
      return $.ajax({
         url: `${env.baseUrl}/api/users/me`,
         headers: this.getHeaders(env)
      });
   },

   getSeller(seller, env) {
      return $.ajax({
         url: `${env.baseUrl}/api/users/${seller.id}`,
         headers: this.getHeaders(env)
      });
   },

   getCheckoutUrl(env) {
      return $.ajax(`${env.baseUrl}/checkout.js`)
          .then(resp => {
             const matches = /xola\.checkoutUrl.*(http.*)';/.exec(resp);
             if (matches) {
                let url = matches[1];
                url = url.replace(/\\x([a-fA-F0-9]{2})/g, function(a, b) {
                   return String.fromCharCode(parseInt(b, 16));
                });
                return url.toString();
             }
          });
   }
};

export {ENV};
