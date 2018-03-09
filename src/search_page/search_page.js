import _debounce from 'lodash/debounce';
import $ from 'jquery';
import './search_page.css';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {SellerTileList} from "./seller_tile";
import {SellerSearchContainer} from "./search_input";
import CornerButton from "../corner_button/corner_button";
import EmptyConfigurations from "./empty_configurations";
import {Storage} from "../storage";

class SearchPage extends Component {
   constructor(props) {
      super(props);
      this.state = {
         searchText: '',
         selectedEnv: {},
         sellers: [],
         environments: [],
         recentlyAccessedLimit: 5,
      };
      this.performSearch = _debounce(this.performSearch, 200);
      this.performBackendSearch = _debounce(this.performBackendSearch, 300);
      Storage.loadEnvironments().then(this.onLoadEnvironments);
   }

   onLoadEnvironments = (data) => {
      const environments = data.environments;
      if (environments && environments.length) {
         const lastUsedEnv = environments.find(env => env.name === data.lastUsedEnv);
         const selectedEnv = lastUsedEnv ? lastUsedEnv : environments[0];
         this.setState({environments: environments});
         this.setupEnvironment(selectedEnv);
      }
   };

   setupEnvironment(selectedEnv) {
      this.setState({
         selectedEnv: selectedEnv,
         sellers: this.getSellers(selectedEnv)
      });
   }

   getSellers(selectedEnv) {
      let sellers = [];
      selectedEnv = selectedEnv || this.state.selectedEnv;
      if (selectedEnv) {
         if (selectedEnv.bookmarks && selectedEnv.bookmarks.length) {
            sellers = sellers.concat(selectedEnv.bookmarks);
         }
         if (selectedEnv.recentlyAccessed && selectedEnv.recentlyAccessed.length) {
            selectedEnv.recentlyAccessed.forEach(storedSeller => {
               const exists = sellers.some(seller => seller.id === storedSeller.id);
               if (!exists) sellers.push(storedSeller);
            });
         }
      }
      return sellers;
   }

   handleEnvChange = (selectedEnv) => {
      Storage.save({lastUsedEnv: selectedEnv.name});
      this.setupEnvironment(selectedEnv);
      this.performSearch();
   };

   handleSearchTextChange = (searchText) => {
      this.setState({searchText});
      this.performSearch();
   };

   toggleBookmark = (bookmarkedSeller) => {
      const selectedEnv = Object.assign(this.state.selectedEnv);
      if (!selectedEnv.bookmarks) {
         selectedEnv.bookmarks = [];
      }
      const index = selectedEnv.bookmarks.findIndex(seller => seller.id === bookmarkedSeller.id);
      if (index === -1) {
         selectedEnv.bookmarks.push(bookmarkedSeller);
      } else {
         selectedEnv.bookmarks.splice(index, 1);
      }
      this.setState({selectedEnv});
      Storage.saveEnvironment(selectedEnv);
   };

   processRecentlyAccessed(impersonatedSeller, recentlyAccessed = []) {
      let index = recentlyAccessed.findIndex(s => s.id === impersonatedSeller.id);
      if (index !== -1) {
         recentlyAccessed.splice(index, 1);
      }
      impersonatedSeller.lastImpersonated = new Date();
      recentlyAccessed.splice(0, 0, impersonatedSeller); // insert this seller at the start of this list
      recentlyAccessed.splice(this.state.recentlyAccessedLimit, 1); // maintain list limit
   }

   onImpersonate = (impersonatedSeller) => {
      const selectedEnv = Object.assign(this.state.selectedEnv);
      if (!selectedEnv.recentlyAccessed) {
         selectedEnv.recentlyAccessed = [];
      }
      this.processRecentlyAccessed(impersonatedSeller, selectedEnv.recentlyAccessed);
      this.setState({selectedEnv});
      Storage.saveEnvironment(selectedEnv);
   };

   performBackendSearch() {
      $.ajax({
         url: `${this.state.selectedEnv.baseUrl}/api/users`,
         data: {
            search: this.state.searchText,
            type: 1
         },
         headers: {
            'X-API-KEY': this.state.selectedEnv.apiKey,
         },
      })
          .then(response => response.data)
          .then(sellers => {
             let filtered = Object.assign(this.state.sellers);
             // Remove any duplicate sellers
             sellers = sellers.filter(seller => !filtered.find(filteredSeller => filteredSeller.id === seller.id));
             filtered = filtered.concat(sellers);
             this.setState({sellers: filtered});
          });
   }

   performSearch() {
      if (this.state.searchText) {
         let filtered = [];
         if (this.state.sellers) {
            filtered = this.state.sellers.filter(pinnedSeller => {
               return pinnedSeller.username.includes(this.state.searchText)
                   || pinnedSeller.email.includes(this.state.searchText)
                   || pinnedSeller.name.includes(this.state.searchText);
            });
         }
         this.setState({sellers: filtered});
         this.performBackendSearch();
      } else {
         // Clear search results, reset to stored bookmarks
         this.setState({sellers: this.getSellers()});
      }
   }

   render() {
      const searchSection = (
          <div className="container">
             <SellerSearchContainer onEnvChange={this.handleEnvChange}
                                    onSearchTextChange={this.handleSearchTextChange}
                                    selectedEnv={this.state.selectedEnv}
                                    environments={this.state.environments}/>
             <SellerTileList selectedEnv={this.state.selectedEnv}
                             sellers={this.state.sellers}
                             toggleBookmark={this.toggleBookmark}
                             onImpersonate={this.onImpersonate}/>
          </div>
      );
      return (
          <div className="search-page container">
             <Link to="/configuration">
                <CornerButton buttonClass="go-to-settings" icon="cog" />
             </Link>
             {this.state.environments.length ? searchSection : <EmptyConfigurations/>}
          </div>
      );
   }
}

export {SearchPage};
