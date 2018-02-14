/*global chrome*/
import 'spectre.css/dist/spectre-icons.min.css';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import CornerButton from '../corner_button/corner_button';
import {EnvironmentTileList} from "./configuration_tile";
import {AddEnvironmentForm} from "./add_environment_form";

class ConfigurationPage extends Component {
   constructor(props) {
      super(props);
      this.handleAddConfig = this.handleAddConfig.bind(this);
      this.handleDeleteConfig = this.handleDeleteConfig.bind(this);
      this.onLoad = this.onLoad.bind(this);
      this.state = {
         environments: []
      };
      getOptions(this.onLoad);
   }

   updateEnvironments(environments) {
      this.setState({environments});
      storeOptions(Object.assign(this.state));
   }

   handleAddConfig(newConfig) {
      const environments = Object.assign(this.state.environments);
      environments.push(newConfig);
      this.updateEnvironments(environments);
   }

   handleDeleteConfig(idx) {
      const environments = Object.assign(this.state.environments);
      environments.splice(idx, 1);
      this.updateEnvironments(environments);
   }

   onLoad(data) {
      this.setState(data);
   }

   render() {
      return (
          <div>
             <Link to="/">
                <CornerButton icon="arrow-left"/>
             </Link>
             <EnvironmentTileList environments={this.state.environments} onDeleteConfig={this.handleDeleteConfig}/>
             <div className="divider"></div>
             <AddEnvironmentForm onAddConfig={this.handleAddConfig}/>
          </div>
      );
   }
}

function storeOptions(data) {
   chrome.storage.local.set(data, () => {});
}

function getOptions(callback) {
   chrome.storage.local.get({environments: []}, data => callback(data));
}

export {ConfigurationPage};
