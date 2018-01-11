/* global chrome */
import _debounce from 'lodash/debounce';
import _bindAll from 'lodash/bindAll';
import $ from 'jquery';
import 'spectre.css/docs/dist/spectre.min.css';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {SellerTileCollection} from "./sellerTile";
import {SellerSearchContainer} from "./search";

const DEFAULT_ENVIRONMENTS = [{
   name: 'local',
   domain: 'xola.local',
   apiKey: ''
}, {
   name: 'prod',
   domain: 'xola.com',
   apiKey: ''
}];

class SearchPage extends Component {
   constructor(props) {
      super(props);
      const environments = DEFAULT_ENVIRONMENTS;
      this.state = {
         searchText: '',
         selectedEnv: environments[0],
         sellers: [],
         environments: environments
      };
      _bindAll(this, ['handleEnvChange', 'handleSearchTextChange']);
      this.performSearch = _debounce(this.performSearch, 500);
      this.loadEnvironments();
   }

   loadEnvironments() {
      chrome.storage.sync.get('environments', data => {
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
         url: `${this.state.selectedEnv.domain}/api/users?search=${this.state.searchText}&type=1`,
         headers: {
            'X-API-KEY': this.state.selectedEnv.apiKey,
         },
      })
          .then(response => response.data)
          .then(sellers => this.setState({sellers}));
   }

   render() {
      return (
          <div className="container">
             <Link to="/configuration">Configuration</Link>
             <SellerSearchContainer onEnvChange={this.handleEnvChange}
                                    onSearchTextChange={this.handleSearchTextChange}
                                    selectedEnv={this.state.selectedEnv}
                                    environments={this.state.environments}/>
             <hr/>
             <SellerTileCollection selectedEnv={this.state.selectedEnv}
                                   sellers={this.state.sellers}/>
          </div>
      );
   }
}

export {SearchPage};
