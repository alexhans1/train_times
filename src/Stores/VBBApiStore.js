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
      await fetch('http://localhost:3100/vbb/searchLocations/' + input)
      .then(res => res.json())
      .then(locations => {
        this.displays[displayIndex].locations = locations;
        this.emit('change');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  getLocations (displayIndex) {
    return this.displays[displayIndex].locations ||[];
  }

  handleAction(action) {
    switch (action.type){
      case "SEARCH_LOCATION": {
        this.searchLocations(action.input, action.displayIndex);
        break;
      }
      // case "GET_DEPARTURES": {
      //   this.createEvent(action.institution, action.eventType, action.date, action.password, action.image);
      //   break;
      // }
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
