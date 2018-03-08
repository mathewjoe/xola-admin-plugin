import './copy_field.css';
import React from 'react';
import Clipboard from "clipboard";
import $ from "jquery";

export default class CopyField extends React.Component {
   componentDidMount() {
      new Clipboard('.copy-container');
   }

   handleCopy = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = $(e.currentTarget);
      target.addClass('copying');
      setTimeout(() => target.removeClass('copying'), 1000);
   };

   render() {
      return <div className="copy-container" data-clipboard-text={this.props.clipboardText} onClick={this.handleCopy}>
         {this.props.displayText}
         <span className="copy-link" data-after-copy="Copied!">{this.props.copyText || "Copy"}</span>
      </div>;
   }
}
