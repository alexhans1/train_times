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
    };

    this.getDisplays = this.getDisplays.bind(this);
  }

  componentWillMount() {
    VBBApiStore.on('displayChange', this.getDisplays);
  }

  componentWillUnmount() {
    VBBApiStore.removeListener('displayChange', this.getDisplays);
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
    });
  }

  render() {
    return (
      <div className={"container-fluid"}>
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
