import React, { Component } from 'react';
import Display from './Components/Display/Display';
import './App.css';
import VBBApiStore from './Stores/VBBApiStore';
import * as VBBApiActions from './Actions/VBBApiActions';

class App extends Component {
  constructor() {
    super();
    this.state = {
      savedDisplays: JSON.parse(localStorage.getItem('displays')) || [],
      now: null,
    };
    this.REFRESH_INTERVAL = 45 * 1000;

    this.getDisplays = this.getDisplays.bind(this);
  }

  componentWillMount() {
    VBBApiStore.on('displayChange', this.getDisplays);
  }

  componentWillUnmount() {
    VBBApiStore.removeListener('displayChange', this.getDisplays);
  }

  componentDidMount() {
    // initialize get departures interval
    VBBApiStore.updateAllLines();
    setInterval(() => {
      VBBApiStore.updateAllDisplayDepartures();
    }, this.REFRESH_INTERVAL);
    setInterval(() => {
      const date = new Date();
      this.setState({
        now: (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
        (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' +
        (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(),
      });
    })
  }

  getDisplays() {
    this.setState({
      savedDisplays: VBBApiStore.getDisplays(),
    });
  }

  static handleAddDisplay() {
    VBBApiActions.addDisplay({
      key: Date.now(),
      products: VBBApiStore.getDefaultProducts(),
      lines: [],
    });
  }

  render() {
    return (
      <div className={"container-fluid"}>
        <div className={"row d-flex justify-content-around"}>
          <span/>
          <span className={"time"}>{this.state.now}</span>
          <div className={"row d-flex justify-content-around align-items-center"}>
            <div className={"d-flex flex-column"}>
              <span className={"vbbCredit text-center"}>Powered by VBB GmbH</span>
              <span className={"vbbLiability"}>The correctness of the data cannot be guaranteed.</span>
            </div>
            <img className={"vbbLogo"} src="https://upload.wikimedia.org/wikipedia/commons/1/16/VBB-Logo.svg" alt=""/>
          </div>
        </div>
        <div className="row">
          {this.state.savedDisplays.map((display, index) => {
            return <Display key={display.key}
                            display={display}
                            index={index}/>
          })}
          <div className="col-12 col-lg-6 mb-3 d-flex justify-content-center align-items-center">
            <button className="btn btn-outline-success btn-lg"
                    onClick={App.handleAddDisplay.bind(this)}>+</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
