import AdminRoute from '../Admin';
import HomeRoute from '../Home';
import ItemRoute from '../Item';
import React from 'react';

class Routing extends React.Component {
  render() {
    <Router>
      <Route exact path="/admin" component={AdminRoute} />
      <Route path="/" component={HomeRoute} />
      <Route exact path="/item" component={ItemRoute} />
    </Router>
}}
