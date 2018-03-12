import React, {Component} from 'react';
import InputWithLoader from "../input_with_loader/input_with_loader";

class EnvironmentSelector extends Component {
   constructor(props) {
      super(props);
      this.handleEnvChange = this.handleEnvChange.bind(this);
   }

   handleEnvChange(e) {
      const envName = e.target.value;
      const selectedEnv = this.props.environments.find(env => env.name === envName);
      this.props.onEnvChange(selectedEnv);
   }

   render() {
      return (
          <div className="form-group">
             <label className="form-label">Environment</label>
             {this.renderEnvironments()}
          </div>
      );
   }

   renderEnvironments() {
      return this.props.environments.map((env, idx) => {
         return (
             <label className="form-radio" key={idx}>
                <input type="radio" name="env" value={env.name} onChange={this.handleEnvChange}
                       checked={this.props.selectedEnv.name === env.name}/>
                <i className="form-icon"></i> {env.name}
             </label>
         );
      });
   }
}

class SearchBar extends Component {
   constructor(props) {
      super(props);
      this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
   }

   handleSearchTextChange(e) {
      this.props.onSearchTextChange(e.target.value);
   }

   render() {
      return (
          <div className="form-group">
             <label className="form-label">Search</label>
             <InputWithLoader name="search" placeholder="Name, Email, Username or Company"
                              onChange={this.handleSearchTextChange} loading={this.props.searching}/>
          </div>
      );
   }
}

class SellerSearchContainer extends Component {
   render() {
      return (
          <div>
             <h3>Impersonator</h3>
             <div>
                <SearchBar onSearchTextChange={this.props.onSearchTextChange} searching={this.props.searching}/>
                <EnvironmentSelector onEnvChange={this.props.onEnvChange}
                                     environments={this.props.environments}
                                     selectedEnv={this.props.selectedEnv}/>
             </div>
          </div>
      );
   }
}

export {SellerSearchContainer};
