import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routing from './routing';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <Routing />
        </Provider>
      </div>
    );
  }
}

export default App;
