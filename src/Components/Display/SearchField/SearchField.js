import React, { Component } from 'react';
import './SearchField.css';
import VBBApiStore from '../../../Stores/VBBApiStore';
import * as VBBApiActions from '../../../Actions/VBBApiActions';

class SearchField extends Component {

  constructor() {
    super();

    this.state = {
      locations: [],
      searchInput: '',
      showSpinner: false,
    };

    this.searchLocations = this.searchLocations.bind(this);
    this.getLocations = this.getLocations.bind(this);

    this.searchLocationsTimeout = null;
  }


  componentWillMount() {
    VBBApiStore.on('change', this.getLocations);
  }

  componentWillUnmount() {
    VBBApiStore.removeListener('change',this.getLocations);
  }

  getLocations() {
    this.setState({
      locations: VBBApiStore.getLocations(),
    });
    console.log(this.state.locations);
  }

  searchLocations(e) {
    e.preventDefault();
    clearTimeout(this.searchLocationsTimeout);

    // check if input is equal to one of the locations
    // that means that the user most likely clicked on that location in the datalist
    const selectedLocation = this.state.locations.find(location => location.name === e.target.value);
    if (selectedLocation) {
      this.setState({
        searchInput: e.target.value,
        locations: [],
      });
      const editedDisplay = {
        key: this.props.key,
        extId: selectedLocation.extId,
        station: selectedLocation.name,
      };
      this.props.handleUpdateDisplay(this.props.index, editedDisplay);
    } else {
      this.setState({
        searchInput: e.target.value,
        showSpinner: true,
      });
      if (this.state.searchInput !== '') {
        this.searchLocationsTimeout = setTimeout(() => {
          VBBApiActions.searchLocations(this.state.searchInput);
        }, 1000);
      }
    }
  }

  render() {
    return (
      <div>
        <input id="searchInput"
               placeholder={"Search a stop or location."}
               list="locationSearchResults"
               onChange={this.searchLocations} />
        <datalist id="locationSearchResults">
          {this.state.locations.map((location) => {
            return <option key={location.extId}
                           data-value={location.extId}
                           onClick={this.handleSelectLocation}>{location.name}</option>
          })}
        </datalist>
      </div>
    );
  }
}

export default SearchField;
