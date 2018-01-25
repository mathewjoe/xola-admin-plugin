/*global chrome*/
import 'spectre.css/dist/spectre-icons.min.css';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import CornerButton from '../corner_button/corner_button';
import Icon from "../icon";

class EnvironmentConfig extends Component {
   render() {
      return (
          <div className="tile tile-centered">
             <div className="tile-content">
                <div className="tile-title">{this.props.env.name}</div>
                <div className="tile-subtitle text-gray">{this.props.env.domain}</div>
             </div>
             <div className="tile-action">
                <button className="btn btn-link" onClick={() => this.props.onDeleteConfig()}>
                   <Icon name="trash"/>
                </button>
             </div>
          </div>
      );
   }
}

class EnvironmentConfigList extends Component {
   render() {
      return (
          <div className="env-config-list">
             <h4>Environments</h4>
             {this.renderConfigurations()}
          </div>
      );
   }

   renderConfigurations() {
      return this.props.environments.map((env, idx) => (
          <EnvironmentConfig env={env} key={idx} onDeleteConfig={() => this.props.onDeleteConfig(idx)}/>
      ));
   }
}

class AddEnvironmentConfig extends Component {
   constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.state = {env: {name: '', domain: '', apiKey: ''}};
   }

   render() {
      return (
          <form className="form-horizontal">
             <div className="form-group">
                <input className="form-input" type="text" placeholder="Name" name="name" value={this.state.env.name}
                       onChange={this.handleInputChange}/>
             </div>
             <div className="form-group">
                <input className="form-input" type="text" placeholder="Domain" name="domain"
                       value={this.state.env.domain} onChange={this.handleInputChange}/>
             </div>
             <div className="form-group">
                <input className="form-input" type="text" placeholder="API Key" name="apiKey"
                       value={this.state.env.apiKey} onChange={this.handleInputChange}/>
             </div>
             <div className="form-group">
                <button className="btn btn-block" onClick={this.handleSubmit}>Add New Environment</button>
             </div>
          </form>
      );
   }

   handleSubmit(e) {
      e.preventDefault();
      if (this.state.env.name && this.state.env.domain && this.state.env.apiKey) {
         this.props.onAddConfig(this.state.env);
         this.setState({env: {name: '', domain: '', apiKey: ''}});
      }
   }

   handleInputChange(e) {
      const env = Object.assign(this.state.env);
      env[e.target.getAttribute('name')] = e.target.value;
      this.setState({env});
   }
}

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

   handleAddConfig(newConfig) {
      const environments = Object.assign(this.state.environments);
      environments.push(newConfig);
      this.setState({environments});
      storeOptions(Object.assign(this.state));
   }

   handleDeleteConfig(idx) {
      const environments = Object.assign(this.state.environments);
      environments.splice(idx, 1);
      this.setState({environments});
      storeOptions(Object.assign(this.state));
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
             <EnvironmentConfigList environments={this.state.environments} onDeleteConfig={this.handleDeleteConfig}/>
             <div className="divider"></div>
             <AddEnvironmentConfig onAddConfig={this.handleAddConfig}/>
          </div>
      );
   }
}

function storeOptions(data) {
   chrome.storage.sync.set(data, () => {
   });
}

function getOptions(callback) {
   chrome.storage.sync.get({environments: []}, data => callback(data));
}

export {ConfigurationPage};
