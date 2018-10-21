import React from 'react';
import ReactDOM from 'react-dom';
import 'spectre.css/docs/dist/spectre.min.css';
import './index.css';
import {SearchPage} from './search_page/search_page';
import {ConfigurationPage} from "./configuration_page/configuration_page";
import {BookingGeneratorPage} from './booking_gen_page/booking_gen_page'

import {
   BrowserRouter as Router,
   Route,
   Switch
} from 'react-router-dom';
import {Storage} from "./storage";

class App extends React.Component {
   componentDidMount() {
      Storage.fetchCheckoutUrls();
      Storage.refreshSellers();
   }

   render() {
      return (
          <Router>
             <Switch>
                <Route path="/generator/:sellerId/:apiKey/:url" render={
                   (props) => <BookingGeneratorPage sellerId={props.match.params.sellerId}  {...props} />
                }/>
                <Route path="/search" component={SearchPage}/>
                <Route path="/configuration" component={ConfigurationPage}/>
                <Route component={SearchPage}/>
             </Switch>
          </Router>
      );
   }
}

ReactDOM.render(<App />, document.getElementById('root'));
