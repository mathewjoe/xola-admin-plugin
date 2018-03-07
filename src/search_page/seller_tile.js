import './seller_tile.css';
import React, {Component} from 'react';

class SellerTile extends Component {
   render() {
      const impersonateUrl = `${this.props.selectedEnv.baseUrl}/seller#seller=${this.props.seller.id}#apiKey=${this.props.selectedEnv.apiKey}`;
      const adminAppUrl = `${this.props.selectedEnv.baseUrl}/admin#sellers/${this.props.seller.id}#apiKey=${this.props.selectedEnv.apiKey}`;
      const imgUrl = `${this.props.selectedEnv.baseUrl}/api/users/${this.props.seller.id}/picture?size=small`;
      return (
          <a href={impersonateUrl} target="_blank">
             <div className="seller-tile tile tile-centered">
                <div className="tile-icon">
                   <img src={imgUrl} className="avatar avatar-sm" alt={this.props.seller.name}/>
                </div>
                <div className="tile-content">
                   <div className="tile-title">{this.props.seller.name}</div>
                   <div className="title-subtitle">
                      <div>{this.props.seller.email}</div>
                      <div className="admin-app-link"><a href={adminAppUrl} target="_blank">Open Admin App</a></div>
                   </div>
                </div>
             </div>
          </a>
      );
   }
}

class SellerTileList extends Component {
   renderSeller(seller) {
      return <SellerTile selectedEnv={this.props.selectedEnv} seller={seller} key={seller.id}/>
   }

   renderSellers() {
      return this.props.sellers.map(seller => this.renderSeller(seller));
   }

   render() {
      return (
          <div className="seller-list">
             {this.renderSellers()}
          </div>
      );
   }
}

export { SellerTileList };
