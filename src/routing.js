import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import FetchApi from './helpers/FetchApi';
import Home from './routes/Home';
import Admin from './routes/Admin';
import Auth from './routes/Auth';
import Item from './routes/Item';

import { connect } from 'react-redux';

class Routing extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/admin" component={Admin} />
          <Route exact path="/auth" component={Auth} />
          <Route exact path="/item" component={Item} />
        </div>
      </Router>
    )
  }
}

function mapStateToProps(state) {
  return {
    
  };
}

export default connect(mapStateToProps)(Routing);
