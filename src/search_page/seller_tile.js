import './seller_tile.css';
import React, {Component} from 'react';
import {RegularIcon} from "../icon";
import Icon from "../icon";

class SellerTile extends Component {
   handleToggleBookmark = (e) => {
      e.preventDefault();
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
          <a href={impersonateUrl} target="_blank">
             <div className="seller-tile tile tile-centered">
                <div className="tile-icon">
                   <img src={imgUrl} className="avatar" alt={seller.name}/>
                </div>
                <div className="tile-content">
                   <div className="tile-title">{seller.name}</div>
                   <div className="title-subtitle">
                      <div>{seller.email}</div>
                      <div className="admin-app-link"><a href={adminAppUrl} target="_blank">Open Admin App</a></div>
                   </div>
                </div>
                <div className="tile-action">
                   <button className="btn btn-link" onClick={(e) => this.handleToggleBookmark(e)}>
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
      return <SellerTile selectedEnv={this.props.selectedEnv} seller={seller}
                         toggleBookmark={this.props.toggleBookmark} key={seller.id}/>
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
