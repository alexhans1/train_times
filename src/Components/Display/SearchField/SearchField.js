import React, { Component } from 'react';
import './SearchField.css';
import VBBApiStore from '../../../Stores/VBBApiStore';
import * as VBBApiActions from '../../../Actions/VBBApiActions';

class SearchField extends Component {

  constructor(props) {
    super();

    this.state = {
      locations: [],
      searchInput: props.display.station || '',
      showSpinner: false,
      showSearchResults: false,
    };

    this.searchLocations = this.searchLocations.bind(this);
    this.getLocations = this.getLocations.bind(this);
    this.handleSelectLocation = this.handleSelectLocation.bind(this);

    this.searchLocationsTimeout = null;
  }

  componentWillMount() {
    VBBApiStore.on('locationChange', this.getLocations);
  }

  componentWillUnmount() {
    VBBApiStore.removeListener('locationChange', this.getLocations);
  }

  getLocations() {
    this.setState({
      locations: VBBApiStore.getLocations(this.props.index),
    });
  }

  searchLocations(e) {
    e.preventDefault();
    clearTimeout(this.searchLocationsTimeout);

    this.setState({
      searchInput: e.target.value,
      showSpinner: true,
    });
    if (this.state.searchInput !== '') {
      this.searchLocationsTimeout = setTimeout(() => {
        VBBApiActions.searchLocations(this.state.searchInput, this.props.index);
      }, 1000);
    }
  }

  handleSelectLocation(locationId) {
    const selectedLocation = this.state.locations.find(location => location.id === locationId);
    if (selectedLocation) {
      this.setState({
        searchInput: selectedLocation.name,
        locations: [],
      });


      let updatedDisplay = this.props.display;
      updatedDisplay.id = selectedLocation.id;
      updatedDisplay.station = selectedLocation.name;
      delete updatedDisplay['locations'];
      VBBApiActions.updateDisplay(this.props.index, updatedDisplay);
      VBBApiActions.getLines(this.props.index);
    }
  }

  render() {
    let searchResultsList = null;
    if (this.state.showSearchResults && this.state.locations.length) {
      searchResultsList = <div id={"searchResults"}>
        <ul>
          {this.state.locations.map((location) => {
            return <li key={location.extId}
                       value={location.id}
                       onClick={() => this.handleSelectLocation(location.id)}>
              {location.name}
            </li>
          })}
        </ul>
      </div>
    }

    return (
      <div onClick={() => { this.setState({ showSearchResults: true }) }}
           onBlur={() => { this.setState({ showSearchResults: true }) }}>
        <input id="searchInput"
               placeholder={"Search a stop or location."}
               value={this.state.searchInput}
               onClick={() => { this.setState({ showSearchResults: true }) }}
               onChange={this.searchLocations} />
        {searchResultsList}
      </div>
    );
  }
}

export default SearchField;
