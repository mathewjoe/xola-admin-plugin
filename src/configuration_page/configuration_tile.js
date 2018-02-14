import React, {Component} from "react";
import Icon from "../icon";

class EnvironmentTile extends Component {
   render() {
      return (
          <div className="tile tile-centered">
             <div className="tile-content">
                <div className="tile-title">{this.props.env.name}</div>
                <div className="tile-subtitle text-gray">{this.props.env.baseUrl}</div>
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

class EnvironmentTileList extends Component {
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
          <EnvironmentTile env={env} key={idx} onDeleteConfig={() => this.props.onDeleteConfig(idx)}/>
      ));
   }
}

export {EnvironmentTileList};
