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
    this.defaultProducts = [
      {
        type: 'S',
        value: 0,
        active: true,
      },
      {
        type: 'U',
        value: 1,
        active: true,
      },
      {
        type: 'B',
        value: 3,
        active: true,
      },
      {
        type: 'T',
        value: 2,
        active: true,
      },
      {
        type: 'F',
        value: 4,
        active: true,
      },
    ];
    this.displays.forEach((display, index) => {
      if (!display.products) {
        this.displays[index].products = this.defaultProducts;
      }
    });
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

  async getDeparturesOverApi (displayIndex, products) {
    // calculate products value
    let productsValue = 0;
    products.forEach((product) => {
      productsValue += product.active ? Math.pow(2, product.value) : 0;
    });
    if (productsValue === 31) productsValue = '';

    try {
      await fetch(this.baseUrl + '/vbb/getDepartures/' + this.displays[displayIndex].extId + '/' + productsValue)
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

  getDefaultProducts () {
    return this.defaultProducts;
  }

  handleAction(action) {
    switch (action.type){
      case "SEARCH_LOCATION": {
        this.searchLocations(action.input, action.displayIndex);
        break;
      }
      case "GET_DEPARTURES": {
        this.getDeparturesOverApi(action.displayIndex, action.products);
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
