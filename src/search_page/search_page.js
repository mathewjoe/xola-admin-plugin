/* global chrome */
import _debounce from 'lodash/debounce';
import _bindAll from 'lodash/bindAll';
import $ from 'jquery';
import './search_page.css';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {SellerTileList} from "./seller_tile";
import {SellerSearchContainer} from "./search_input";
import CornerButton from "../corner_button/corner_button";
import EmptyConfigurations from "./empty_configurations";

class SearchPage extends Component {
   constructor(props) {
      super(props);
      this.state = {
         searchText: '',
         selectedEnv: {},
         sellers: [],
         environments: []
      };
      _bindAll(this, ['handleEnvChange', 'handleSearchTextChange']);
      this.performSearch = _debounce(this.performSearch, 500);
      this.loadEnvironments();
   }

   loadEnvironments() {
      chrome.storage.local.get('environments', data => {
         const environments = data.environments;
         if (environments) {
            this.setState({environments: environments, selectedEnv: environments[0]});
         }
      });
   }

   handleEnvChange(selectedEnv) {
      this.setState({selectedEnv});
      this.performSearch();
   }

   handleSearchTextChange(searchText) {
      this.setState({searchText});
      this.performSearch();
   }

   performSearch() {
      if (!this.state.searchText) return;
      $.ajax({
         url: `${this.state.selectedEnv.baseUrl}/api/users?search=${this.state.searchText}&type=1`,
         headers: {
            'X-API-KEY': this.state.selectedEnv.apiKey,
         },
      })
          .then(response => response.data)
          .then(sellers => this.setState({sellers}));
   }

   render() {
      const searchSection = (
          <div className="container">
             <SellerSearchContainer onEnvChange={this.handleEnvChange}
                                    onSearchTextChange={this.handleSearchTextChange}
                                    selectedEnv={this.state.selectedEnv}
                                    environments={this.state.environments}/>
             <SellerTileList selectedEnv={this.state.selectedEnv}
                             sellers={this.state.sellers}/>
          </div>
      );
      return (
          <div className="container">
             <Link to="/configuration">
                <CornerButton buttonClass="go-to-settings" icon="cog" />
             </Link>
             {this.state.environments.length ? searchSection : <EmptyConfigurations/>}
          </div>
      );
   }
}

export {SearchPage};
