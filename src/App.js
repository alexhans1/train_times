import React, { Component } from 'react';
import Display from './Components/Display/Display';
import './App.css';

class App extends Component {
  constructor() {
    super();
    if (!localStorage.getItem('stations')) {
      // initialize with the two example events
      localStorage.setItem('stations', JSON.stringify([]));
    }
    this.state = {
      savedDisplays: JSON.parse(localStorage.getItem('stations')),
    };
  }

  handleAddDisplay() {
    let tmpState = this.state.savedDisplays;
    tmpState.push({
      key: Date.now(),
    });
    localStorage.setItem('stations', JSON.stringify(tmpState));
    this.setState({
      savedDisplays: tmpState,
    });
  }

  handleUpdateDisplay(index, editedDisplay) {
    let tmpState = this.state.savedDisplays;
    tmpState[index] = editedDisplay;
    localStorage.setItem('stations', JSON.stringify(tmpState));
    this.setState({
      savedDisplays: tmpState,
    });
  }

  handleRemoveDisplay(index) {
    let tmpState = this.state.savedDisplays;
    tmpState.splice(index, 1);
    localStorage.setItem('stations', JSON.stringify(tmpState));
    this.setState({
      savedDisplays: tmpState,
    });
  }

  render() {
    return (
      <div className={"container-fluid"}>
        <div className="row">
          {this.state.savedDisplays.map((display, index) => {
            return <Display key={display.key} station={display.station} index={index}
                            handleUpdateDisplay={this.handleUpdateDisplay.bind(this)}
                            handleRemoveDisplay={this.handleRemoveDisplay.bind(this)}/>
          })}
          <div className="col-12 col-lg-6 mb-3 d-flex justify-content-center align-items-center">
            <button className="btn btn-outline-success btn-lg"
                    onClick={this.handleAddDisplay.bind(this)}>+</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
