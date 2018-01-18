import React from 'react';
import './corner_button.css';

export default function CornerButton(props) {
   const buttonClass = props.buttonClass || '';
   return (
       <div className={`corner ${buttonClass}`}>
          <i className={`fas fa-${props.iconClass}`}></i>
       </div>
   );
};
