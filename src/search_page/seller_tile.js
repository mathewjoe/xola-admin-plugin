import './seller_tile.css';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {RegularIcon} from "../icon";
import Icon from "../icon";
import CopyField from "./copy_field";

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
      const modifiedBaseUrl = selectedEnv.baseUrl.split('/').join('@');
      const generatorPath = `/generator/${seller.id}/${selectedEnv.apiKey}/${modifiedBaseUrl}`;
      return (
          <a href={impersonateUrl} target="_blank" onClick={() => this.props.onImpersonate(this.props.seller)}>
             <div className="seller-tile tile">
                <div className="tile-icon">
                   <img src={imgUrl} className="avatar" alt={seller.name}/>
                </div>
                <div className="tile-content">
                   <div className="tile-title">
                      <CopyField displayText={seller.name} copyText="Copy ID" clipboardText={seller.id}/>
                   </div>
                   <div className="title-subtitle">
                      <CopyField displayText={seller.email} clipboardText={seller.email}/>
                      <div className="app-links">
                         <a href={impersonateUrl} target="_blank" className="chip">Impersonate</a>
                         <a href={adminAppUrl} target="_blank" className="chip">Admin</a>
                         {
                            selectedEnv.checkoutUrl
                                ? <a href={selectedEnv.checkoutUrl + '#seller/' + seller.id} target="_blank" className="chip">
                                   Checkout </a>
                                : ""
                         }
                        <Link to={generatorPath}>
                           <a href="#" className="chip">
                              Fake Gen
                           </a>
                        </Link>
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
