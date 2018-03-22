import React, { Component } from 'react';
import './Filter.css';
import * as VBBApiActions from '../../../Actions/VBBApiActions';

class Filter extends Component {

  render() {
    return(
      <div className="dropdown">
        <button className="btn btn-sm btn-secondary-outline dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="fas fa-filter"/>
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {this.props.display.lines.map((line, index) => {
            return (
              <a key={index} className="dropdown-item" style={{cursor: 'pointer'}} onClick={() => {
                this.props.display.destinationId = line.destinationId;
                VBBApiActions.updateDisplay(this.props.index, this.props.display);
              }}>{line.direction}</a>
            )
          })}
        </div>
      </div>
    );
  }
}

export default Filter;
