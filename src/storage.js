/* global chrome */
import _extend from 'lodash/extend';
import {ENV} from "./env";

const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 1 day

const Storage = {
   save(data = {}) {
      chrome.storage.local.set(data);
   },

   loadEnvironments() {
      return new Promise((resolve, reject) => {
         chrome.storage.local.get({environments: [], lastUsedEnv: ''}, data => {
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

   fetchCheckoutUrls() {
      this.loadEnvironments()
          .then(({environments}) => {
             environments.forEach(env => {
                if (env.checkoutUrl) return;
                ENV.getCheckoutUrl(env).then(checkoutUrl => {
                   if (checkoutUrl) {
                      env.checkoutUrl = checkoutUrl;
                      this.saveEnvironment(env);
                   }
                });
             });
          });
   },

   refreshSellers() {
      this.loadEnvironments()
          .then(({environments}) => {
             environments.forEach((env) => {
                let sellers = [];
                if (env.bookmarks) sellers = sellers.concat(env.bookmarks);
                if (env.recentlyAccessed) sellers = sellers.concat(env.recentlyAccessed);

                const promises = sellers.map(seller => {
                   const currentTime = (new Date()).getTime();
                   if (!seller.lastFetchedAt) {
                      seller.lastFetchedAt = currentTime;
                   }
                   const diff = currentTime - seller.lastFetchedAt;
                   if (diff > UPDATE_INTERVAL) {
                      seller.lastFetchedAt = currentTime;
                      return ENV.getSeller(seller, env).then(resp => {
                         _extend(seller, resp);
                      });
                   }
                   return Promise.resolve();
                });
                Promise.all(promises).then(() => this.saveEnvironment(env));
             });
          });
   }
};

export {Storage};
