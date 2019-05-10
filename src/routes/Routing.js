import AdminRoute from '../Admin/index';
import HomeRoute from '../Home/index';
import React from 'react';

class Routing extends React.Component {
  render() {
    <Router>
      <Route exact path="/admin" component={AdminRoute} />
      <Route path="/" component={HomeRoute} />
    </Router>
}}
