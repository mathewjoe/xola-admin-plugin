import './seller_tile.css';
import React, {Component} from 'react';
import {RegularIcon} from "../icon";
import Icon from "../icon";

class SellerTile extends Component {
   handleToggleBookmark = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.props.toggleBookmark(this.props.seller);
   };

   render() {
      const selectedEnv = this.props.selectedEnv;
      const seller = this.props.seller;
      const isBookmarked = selectedEnv.bookmarks && selectedEnv.bookmarks.find(bookmark => bookmark.id === seller.id);
      const impersonateUrl = `${selectedEnv.baseUrl}/seller#seller=${seller.id}#apiKey=${selectedEnv.apiKey}`;
      const adminAppUrl = `${selectedEnv.baseUrl}/admin#sellers/${seller.id}#apiKey=${selectedEnv.apiKey}`;
      const imgUrl = `${selectedEnv.baseUrl}/api/users/${seller.id}/picture?size=small`;
      return (
          <a href={impersonateUrl} target="_blank" onClick={() => this.props.onImpersonate(this.props.seller)}>
             <div className="seller-tile tile tile-centered">
                <div className="tile-icon">
                   <img src={imgUrl} className="avatar" alt={seller.name}/>
                </div>
                <div className="tile-content">
                   <div className="tile-title">{seller.name}</div>
                   <div className="title-subtitle">
                      <div>{seller.email}</div>
                      <div className="app-links">
                         <a href={adminAppUrl} target="_blank">Impersonate</a>
                         <a href={impersonateUrl} target="_blank">Admin</a>
                         {
                            selectedEnv.checkoutUrl
                                ? <a href={selectedEnv.checkoutUrl + '#seller/' + seller.id} target="_blank">
                                   Checkout </a>
                                : ""
                         }
                      </div>
                   </div>
                </div>
                <div className="tile-action">
                   <button className="btn btn-link" onClick={this.handleToggleBookmark}>
                      {isBookmarked ? <Icon name="star"/> : <RegularIcon name="star"/>}
                   </button>
                </div>
             </div>
          </a>
      );
   }
}

class SellerTileList extends Component {
   renderSeller(seller) {
      return <SellerTile seller={seller} key={seller.id} {...this.props} />
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
