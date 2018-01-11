import React, { Component } from 'react';
import { SENSITIVE_TYPE } from './constants';
import ReactRuler from '../components/index';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  init = () => {
    console.log(1111);
  }
  render() {
    this.init();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="content">
          {
            Object.values(SENSITIVE_TYPE).map((item, index) => {
              return item.step ?
                <ReactRuler
                  value={item.value}
                  handleDragChange={this.handleDragChange}
                  start={item.min}
                  end={item.max}
                  step={item.step}
                /> : null
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
