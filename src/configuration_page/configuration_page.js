import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import CornerButton from '../corner_button/corner_button';
import {EnvironmentTileList} from "./configuration_tile";
import {AddEnvironmentForm} from "./add_environment_form";
import {Storage} from "../storage";

class ConfigurationPage extends Component {
   constructor(props) {
      super(props);
      this.state = {
         environments: []
      };
      Storage.loadEnvironments().then(this.onLoad);
   }

   handleAddEnv = (newEnv) => {
      const environments = this.state.environments.slice();
      environments.push(newEnv);
      Storage.addEnvironment(newEnv);
      this.setState({environments});
   };

   handleDeleteEnv = (deletedEnv) => {
      const environments = this.state.environments.slice();
      const index = environments.findIndex(env => env.name === deletedEnv.name);
      if (index !== -1) {
         environments.splice(index, 1);
         Storage.deleteEnvironment(deletedEnv);
         this.setState({environments});
      }
   };

   onLoad = (data) => {
      this.setState({environments: data.environments});
   };

   render() {
      return (
          <div className="configuration-page">
             <Link to="/">
                <CornerButton icon="arrow-left"/>
             </Link>
             <EnvironmentTileList environments={this.state.environments} onDeleteEnv={this.handleDeleteEnv}/>
             <div className="divider"></div>
             <AddEnvironmentForm onAddEnv={this.handleAddEnv}/>
          </div>
      );
   }
}

export {ConfigurationPage};
