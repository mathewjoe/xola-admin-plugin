import React from 'react';
import './corner_button.css';
import {LargeIcon} from '../icon';

export default function CornerButton(props) {
   const buttonClass = props.buttonClass || '';
   return (
       <div className={`corner ${buttonClass}`}>
          <LargeIcon name={props.icon}/>
       </div>
   );
};
