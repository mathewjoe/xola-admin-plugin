import React from 'react';
import {XXLIcon} from "../icon";

export default function EmptyConfigurations(props) {
   return (
       <div className="empty">
          <div className="empty-icon">
             <XXLIcon name="cog"/>
          </div>
          <p className="empty-title h5">You have no environments configured</p>
       </div>
   );
}
