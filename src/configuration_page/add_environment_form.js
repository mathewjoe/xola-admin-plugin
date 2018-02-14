import $ from "jquery";
import React, {Component} from "react";

const PROTOCOL = {HTTPS: 'https://', HTTP: 'http://'};

class AddEnvironmentForm extends Component {
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
            get baseUrl() {
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
                   <input type="radio" name="useApiKey" checked={!this.state.useApiKey}
                          onChange={() => this.setState({useApiKey: false})}/>
                   <i className="form-icon"></i> Email & Password
                </label>
                <label className="form-radio">
                   <input type="radio" name="useApiKey" checked={this.state.useApiKey}
                          onChange={() => this.setState({useApiKey: true})}/>
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
         url: `${env.baseUrl}/api/users/me`,
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
                   baseUrl: this.state.env.baseUrl,
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

export {AddEnvironmentForm};
