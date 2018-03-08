import React, { Component } from 'react';
import './Display.css';
import SearchField from './SearchField/SearchField';
import * as VBBApiActions from '../../Actions/VBBApiActions';
import VBBApiStore from "../../Stores/VBBApiStore";


class Display extends Component {

  constructor() {
    super();

    this.state = {
      departures: [],
      lastUpdated: null,
    };

    this.REFRESH_INTERVAL = 60 * 1000;
    this.getDepartures = this.getDepartures.bind(this);
  }

  componentWillMount() {
    VBBApiStore.on('departureChange', this.getDepartures);
  }

  componentWillUnmount() {
    VBBApiStore.removeListener('departureChange', this.getDepartures);
  }

  componentDidMount() {
    if (this.props.display.extId) {
      VBBApiActions.getDepartures(this.props.index);
      setInterval(() => {
        console.info('Refreshing');
        VBBApiActions.getDepartures(this.props.index);
      }, this.REFRESH_INTERVAL)
    }
  }

  getDepartures() {
    const now = new Date();
    this.setState({
      departures: VBBApiStore.getDepartures(this.props.index),
      lastUpdated: now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes(),
    });
  }

  handleRemoveDisplay() {
    VBBApiActions.removeDisplay(this.props.index);
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
          {this.state.departures.map((departure, index) => {
            const hasRealTimeData = !!(departure.rtDate && departure.rtTime);
            const now = new Date();
            const departureTime = new Date((departure.rtDate || departure.date) + ' ' + (departure.rtTime || departure.time));
            let timeUntilDeparture = Math.round((departureTime - now) / 1000 / 60);
            if (timeUntilDeparture < -100) timeUntilDeparture += 24 * 60; // adjust for day break
            if (timeUntilDeparture <= 0 && timeUntilDeparture >= -100) timeUntilDeparture = '';
            return (
              <tr key={index} className="display-row">
                <td className="gray-side-bar"/>
                <td>{departure.line || departure.name}</td>
                <td>{departure.direction}</td>
                <td>{timeUntilDeparture}<span id={'realTimeNote'}>{hasRealTimeData ? 'R' : 'S'}</span></td>
                <td className="gray-side-bar"/>
              </tr>
            )
          })}
          <tr className="white-bars">
            <td/>
            <td colSpan="2">
              <SearchField display={this.props.display}
                           REFRESH_INTERVAL={this.REFRESH_INTERVAL}
                           index={this.props.index} />
            </td>
            <td colSpan="2">
              {this.state.lastUpdated}
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
