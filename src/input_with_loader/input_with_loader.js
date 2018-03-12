import './input_with_loader.css';
import React from 'react';
import Loader from "./loader";

export default function InputWithLoader(props) {
   return (
       <div className="input-with-loader">
          <input className="form-input" type="text" name={props.name} placeholder={props.placeholder} tabIndex={1}
                 autoFocus={true} onChange={props.onChange}/>
          {props.loading && <Loader/>}
       </div>
   );
}
