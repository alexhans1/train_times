import React, { Component } from 'react';
import './Display.css';
import SearchField from './SearchField/SearchField';
import Filter from './Filter/Filter';
import * as VBBApiActions from '../../Actions/VBBApiActions';
import VBBApiStore from "../../Stores/VBBApiStore";


class Display extends Component {

  constructor() {
    super();

    this.state = {
      departures: [],
      lastUpdated: null,
    };

    this.getDepartures = this.getDepartures.bind(this);
    this.handleSetProducts = this.handleSetProducts.bind(this);
  }

  componentWillMount() {
    VBBApiStore.on('departureChange', this.getDepartures);
  }

  componentWillUnmount() {
    VBBApiStore.removeListener('departureChange', this.getDepartures);
  }

  componentDidMount() {
    if (this.props.display.extId) {
      VBBApiActions.getDepartures(this.props.index, this.props.display.products);
    }
  }

  getDepartures() {
    const now = new Date();
    this.setState({
      departures: VBBApiStore.getDepartures(this.props.index).sort((a, b) => { return (a.rtTime || a.time) > (b.rtTime || b.time) }),
      lastUpdated: now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes(),
    });
  }

  handleRemoveDisplay() {
    VBBApiActions.removeDisplay(this.props.index);
  }

  handleSetProducts(productType) {
    let tmpProducts = this.props.display.products;
    const index = tmpProducts.findIndex(({type}) => type === productType);
    tmpProducts[index].active = !tmpProducts[index].active;
    this.props.display.products = tmpProducts;
    VBBApiActions.updateDisplay(this.props.index, this.props.display);
  }

  render() {

    let rows = [];
    for (let i = 0; i < 6; i++) {
      if (this.state.departures[i]) {
        const departure = this.state.departures[i];
        const hasRealTimeData = !!(departure.rtDate && departure.rtTime);
        const now = new Date();
        const departureTime = new Date((departure.rtDate || departure.date) + ' ' + (departure.rtTime || departure.time));
        let timeUntilDeparture = Math.round((departureTime - now) / 1000 / 60);
        if (timeUntilDeparture < -100) timeUntilDeparture += 24 * 60; // adjust for day break
        if (timeUntilDeparture <= 0 && timeUntilDeparture >= -100) timeUntilDeparture = '';
        rows.push(
          <tr key={i} className="display-row">
            <td className="gray-side-bar"/>
            <td>{departure.line || departure.name}</td>
            <td>{departure.direction}</td>
            <td  data-toggle="tooltip"
                 data-placement="bottom"
                 title={hasRealTimeData ? null : 'Time according to schedule. Real time data currently not available.'}>
              {timeUntilDeparture}<span id={'realTimeNote'}>{hasRealTimeData ? '' : '*'}</span>
            </td>
            <td className="gray-side-bar"/>
          </tr>
        );
      } else {
        rows.push(
          <tr key={i} className="display-row">
            <td className="gray-side-bar"/>
            <td/>
            <td/>
            <td/>
            <td className="gray-side-bar"/>
          </tr>
        )
      }
    }

    return (
      <div className="col-12 col-lg-6 mb-3">
        <table cellPadding="0" cellSpacing="0">
          <tbody>
          <tr className="white-bars">
            <td/>
            <td>Line</td>
            <td>Destination</td>
            <td colSpan="2" className={"d-flex justify-content-between"}>
              Departure in
              <button id={"removeDisplay"} className="btn btn-outline-dark" onClick={this.handleRemoveDisplay.bind(this)}>x</button>
            </td>
          </tr>
          {rows.map((row) => {
            return row;
          })}
          <tr className="white-bars">
            <td/>
            <td colSpan="2">
              <div className={"d-flex justify-content-between"}>
                <SearchField display={this.props.display}
                             products={this.state.products}
                             index={this.props.index} />
                {(this.props.display.lines.length) ? <Filter display={this.props.display}
                                                             index={this.props.index}/> : null}
              </div>
            </td>
            <td colSpan="2">
              {this.props.display.products.map((product) => {
                const className = 'productType' + (product.active ? ' active' : '');
                return (
                  <span key={product.type}
                        onClick={() => { this.handleSetProducts(product.type) }}
                        className={className}>
                    {product.type}
                  </span>
                )
              })}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    );
  }
}

export default Display;
