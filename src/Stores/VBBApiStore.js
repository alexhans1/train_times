import {EventEmitter} from "events";
import dispatcher from "../dispatcher";

class VBBApiStore extends EventEmitter {
  constructor() {
    super();
    if (!localStorage.getItem('displays')) {
      // initialize with the two example events
      localStorage.setItem('displays', JSON.stringify([]));
    }
    this.displays = JSON.parse(localStorage.getItem('displays')) || [];
    this.baseUrl = (process.env.NODE_ENV === 'production') ? 'https://berlin-train-times.herokuapp.com'
      : 'http://localhost:3100';
  }

  addDisplay (newDisplay) {
    try {
      this.displays.push(newDisplay);
      localStorage.setItem('displays', JSON.stringify(this.displays));
      this.emit('displayChange');
    } catch (ex) {
      console.error(ex);
    }
  }

  removeDisplay (displayIndex) {
    try {
      this.displays.splice(displayIndex, 1);
      localStorage.setItem('displays', JSON.stringify(this.displays));
      this.emit('displayChange');
    } catch (ex) {
      console.error(ex);
    }
  }

  updateDisplay (displayIndex, updatedDisplay) {
    try {
      this.displays[displayIndex] = updatedDisplay;
      localStorage.setItem('displays', JSON.stringify(this.displays));
      this.emit('displayChange');
    } catch (ex) {
      console.error(ex);
    }
  }

  getDisplays () {
    return this.displays;
  }

  async searchLocations (input, displayIndex) {
    try {
      await fetch(this.baseUrl + '/vbb/searchLocations/' + input)
      .then(res => res.json())
      .then(locations => {
        this.displays[displayIndex].locations = locations;
        this.emit('locationChange');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  getLocations (displayIndex) {
    return this.displays[displayIndex].locations || [];
  }

  async getDeparturesOverApi (displayIndex) {
    try {
      await fetch(this.baseUrl + '/vbb/getDepartures/' + this.displays[displayIndex].extId)
      .then(res => res.json())
      .then(departures => {
        this.displays[displayIndex].departures = departures;
        this.emit('departureChange');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  getDepartures (displayIndex) {
    return this.displays[displayIndex].departures || [];
  }

  handleAction(action) {
    switch (action.type){
      case "SEARCH_LOCATION": {
        this.searchLocations(action.input, action.displayIndex);
        break;
      }
      case "GET_DEPARTURES": {
        this.getDeparturesOverApi(action.displayIndex);
        break;
      }
      case "ADD_DISPLAY": {
        this.addDisplay(action.newDisplay);
        break;
      }
      case "REMOVE_DISPLAY": {
        this.removeDisplay(action.displayIndex);
        break;
      }
      case "UPDATE_DISPLAY": {
        this.updateDisplay(action.displayIndex, action.updatedDisplay);
        break;
      }
      // case "DELETE_EVENT": {
      //   this.deleteEvent(action.id);
      //   break;
      // }
      default: {
        // do nothing
      }
    }
  }
}

const vbbApiStore = new VBBApiStore();

dispatcher.register(vbbApiStore.handleAction.bind(vbbApiStore));

export default vbbApiStore;
