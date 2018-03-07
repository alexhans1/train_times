import React, { Component } from 'react';
import './Display.css';
import SearchField from './SearchField/SearchField';

class Display extends Component {

  handleRemoveDisplay() {
    this.props.handleRemoveDisplay(this.props.index);
  }

  render() {
    return (
      <div className="col-12 col-lg-6 mb-3">
        <table cellPadding="0" cellSpacing="0">
          <tbody>
          <tr className="white-bars">
            <td/>
            <td>Linie</td>
            <td>Ziel</td>
            <td colSpan="2">Abfahrt in</td>
          </tr>
          <tr className="display-row">
            <td className="gray-side-bar"/>
            <td>M5</td>
            <td>S+U Hauptbahnhof</td>
            <td>3 min</td>
            <td className="gray-side-bar"/>
          </tr>
          <tr className="display-row">
            <td className="gray-side-bar"/>
            <td>M8</td>
            <td>U-Bahnhof Schwarzkopfstr.</td>
            <td>14 min</td>
            <td className="gray-side-bar"/>
          </tr>
          <tr className="display-row">
            <td className="gray-side-bar"/>
            <td/>
            <td/>
            <td/>
            <td className="gray-side-bar"/>
          </tr>
          <tr className="white-bars">
            <td/>
            <td colSpan="4">
              <SearchField key={this.props.key}
                           index={this.props.index}
                           handleUpdateDisplay={this.props.handleUpdateDisplay} />
            </td>
          </tr>
          </tbody>
        </table>
        <span id="removeDisplay">
          <button className="btn btn-outline-danger" onClick={this.handleRemoveDisplay.bind(this)}>x</button>
        </span>
      </div>

    );
  }
}

export default Display;
