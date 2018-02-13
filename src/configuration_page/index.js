/*global chrome*/
import $ from 'jquery';
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

const PROTOCOL = {HTTPS: 'https://', HTTP: 'http://'};

class AddEnvironmentConfig extends Component {
   constructor(props) {
      super(props);
      this.state = this.getDefaultState();
   }

   getDefaultState() {
      return {
         env: {
            name: '',
            protocol: PROTOCOL.HTTPS,
            domain: '',
            apiKey: '',
            email: '',
            password: '',
            get url() {
               return this.protocol + this.domain;
            }
         },
         useApiKey: false,
         loading: false,
         error: false
      };
   }

   render() {
      const emailIdFields = (
          <div className="form-group">
             <div className="form-group">
                <input className={"form-input" + (this.state.error ? " is-error" : "")} type="text"
                       placeholder="Email"
                       name="email"
                       value={this.state.env.email} onChange={this.handleInputChange}/>
             </div>
             <div className="form-group">
                <input className={"form-input" + (this.state.error ? " is-error" : "")} type="password"
                       placeholder="Password"
                       name="password"
                       value={this.state.env.password} onChange={this.handleInputChange}/>
                {this.state.error ?
                    <p className="form-input-hint">Unable to verify credentials. Please check your domain and
                       credentials.</p> : ""}
             </div>
          </div>
      );
      const apiKeyField = (
          <div className="form-group">
             <input className={"form-input" + (this.state.error ? " is-error" : "")} type="text"
                    placeholder="API Key"
                    name="apiKey"
                    value={this.state.env.apiKey} onChange={this.handleInputChange}/>
             {this.state.error ?
                 <p className="form-input-hint">Unable to verify credentials. Please check your domain and
                    credentials.</p> : ""}
          </div>
      );
      return (
          <form>
             <div className="form-group">
                <input className="form-input" type="text" placeholder="Name (eg: production)" name="name"
                       value={this.state.env.name}
                       onChange={this.handleInputChange}/>
             </div>
             <div className={"form-group input-group" + (this.state.error ? " has-error" : "")}>
                <select name="protocol" className="form-select" value={this.state.env.protocol}
                        onChange={this.handleInputChange}>
                   {Object.keys(PROTOCOL).map(key => <option value={PROTOCOL[key]}>{PROTOCOL[key]}</option>)}
                </select>
                <input className="form-input" type="text" placeholder="Domain (eg: xola.com)" name="domain"
                       value={this.state.env.domain} onChange={this.handleInputChange}/>
             </div>
             <div className="form-group">
                <label className="form-radio">
                   <input type="radio" name="useApiKey" checked={!this.state.useApiKey} onChange={() => this.setState({useApiKey: false})}/>
                   <i className="form-icon"></i> Email & Password
                </label>
                <label className="form-radio">
                   <input type="radio" name="useApiKey" checked={this.state.useApiKey} onChange={() => this.setState({useApiKey: true})}/>
                   <i className="form-icon"></i> API Key
                </label>
             </div>
             {this.state.useApiKey ? apiKeyField : emailIdFields}
             <div className="form-group">
                <button className={"btn btn-block" + (this.state.loading ? " loading" : "")}
                        onClick={this.handleSubmit}>
                   Add New Environment
                </button>
             </div>
          </form>
      );
   }

   testConnection(env) {
      const headers = {};
      if (env.apiKey) {
         headers["X-API-KEY"] = env.apiKey;
      } else {
         headers["Authorization"] = "Basic " + btoa(`${env.email}:${env.password}`)
      }

      return $.ajax({
         url: `${env.url}/api/users/me`,
         headers
      });
   }

   handleSubmit = (e) => {
      e.preventDefault();
      if (this.state.env.name && this.state.env.domain && (this.state.env.apiKey || this.state.env.email)) {
         this.setState({loading: true});
         this.testConnection(this.state.env)
             .then((resp) => {
                this.props.onAddConfig({
                   name: this.state.env.name,
                   domain: this.state.env.url,
                   apiKey: resp.apiKey
                });
                this.setState(this.getDefaultState());
             })
             .catch(() => {
                this.setState({loading: false, error: true});
             });
      }
   };

   handleInputChange = (e) => {
      const env = Object.assign(this.state.env);
      env[e.target.getAttribute('name')] = e.target.value;
      this.setState({env});
   };
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
