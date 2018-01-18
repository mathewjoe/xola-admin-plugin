import './seller_tile.css';
import React, {Component} from 'react';

class SellerTile extends Component {
   render() {
      return (
          <a href={`${this.props.selectedEnv.domain}/seller#seller=${this.props.seller.id}#apiKey=${this.props.selectedEnv.apiKey}`} target="_blank">
             <div className="tile tile-centered">
                <div className="tile-icon">
                   <img src={`${this.props.selectedEnv.domain}/api/users/${this.props.seller.id}/picture?size=small`}
                        className="avatar avatar-sm"
                        alt={this.props.seller.name}/>
                </div>
                <div className="tile-content">
                   <div className="tile-title">{this.props.seller.name}</div>
                   <div className="title-subtitle">{this.props.seller.email}</div>
                </div>
             </div>
          </a>
      );
   }
}

class SellerTileCollection extends Component {
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

export { SellerTileCollection };
