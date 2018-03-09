/* global chrome */
import $ from "jquery";

const Storage = {
   save(data = {}) {
      chrome.storage.local.set(data);
   },

   loadEnvironments() {
      return new Promise((resolve, reject) => {
         chrome.storage.local.get({environments: [], lastUsedEnv: ''}, data => {
            const environments = data.environments;
            if (environments && environments.length) {
               this.fetchCheckoutUrls(environments);
            }
            resolve(data);
         });
      });
   },

   saveEnvironment(updatedEnv) {
      chrome.storage.local.get({environments: []}, data => {
         const environments = data.environments;
         const index = environments.findIndex(env => env.name === updatedEnv.name);
         if (index !== -1) {
            environments.splice(index, 1, updatedEnv);
            chrome.storage.local.set({environments});
         }
      });
   },

   addEnvironment(newEnv) {
      chrome.storage.local.get({environments: []}, data => {
         const environments = data.environments;
         environments.push(newEnv);
         chrome.storage.local.set({environments});
      });
   },

   deleteEnvironment(deletedEnv) {
      chrome.storage.local.get({environments: []}, data => {
         const environments = data.environments;
         const index = environments.findIndex(env => env.name === deletedEnv.name);
         if (index !== -1) {
            environments.splice(index, 1);
            chrome.storage.local.set({environments});
         }
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
   },

   fetchCheckoutUrls(environments) {
      environments.forEach(env => {
         if (env.checkoutUrl) return;
         this.getCheckoutUrl(env).then(checkoutUrl => {
            if (checkoutUrl) {
               env.checkoutUrl = checkoutUrl;
               this.saveEnvironment(env);
            }
         });
      });
   }
};

export {Storage};
