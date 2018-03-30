import {EventEmitter} from "events";
import dispatcher from "../dispatcher";

const parseResponse = (res) => {
  if (res.error) {
    console.error(res.message);
    return [];
  }
  return res;
};

class VBBApiStore extends EventEmitter {
  constructor() {
    super();
    try {
      if (!localStorage.getItem('displays')) {
        // initialize with the two example events
        localStorage.setItem('displays', JSON.stringify([]));
      }
    } catch (ex) {
      console.error(ex);
      localStorage.setItem('displays', JSON.stringify([]));
    }
    this.baseUrl = (process.env.NODE_ENV === 'production') ? 'https://berlin-train-times.herokuapp.com'
      : 'http://localhost:3100';
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
  }

  async addDisplay (newDisplay) {
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
      this.getDeparturesOverApi(displayIndex);
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
        locations = parseResponse(locations);
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
    console.info('Refreshing display #' + (displayIndex + 1));

    const display = this.displays[displayIndex];
    let fetchUrl = this.baseUrl + '/vbb/getDepartures/' + display.extId;

    // calculate products value
    let productsValue = 0;
    display.products.forEach((product) => {
      productsValue += product.active ? Math.pow(2, product.value) : 0;
    });
    if (productsValue === 31) productsValue = '';
    if (productsValue) {
      fetchUrl += '/' + productsValue;
    }
    if (display.destinationId) {
      fetchUrl += '?direction=' + display.destinationId;
    }
    try {
      await fetch(fetchUrl)
      .then(res => res.json())
      .then(departures => {
        departures = parseResponse(departures);
        this.displays[displayIndex].departures = departures;
        this.emit('departureChange');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  updateAllDisplayDepartures () {
    this.displays.forEach((display, index) => {
      if (display.extId) {
        this.getDeparturesOverApi(index)
      }
    })
  }

  getDepartures (displayIndex) {
    return this.displays[displayIndex].departures || [];
  }

  getLines (displayIndex) {
    try {
      fetch(this.baseUrl + '/vbb/getLines/' + this.displays[displayIndex].extId)
        .then(res => res.json())
        .then(lines => {
          lines = parseResponse(lines);
          if (lines.error) {

          }
          this.displays[displayIndex].lines = lines;
          this.emit('displayChange');
        });
    } catch (ex) {
      console.error(ex);
    }
  }

  updateAllLines () {
    this.displays.forEach((display, index) => {
      if (display.extId) {
        this.getLines(index);
      }
    })
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
      case "GET_LINES": {
        this.getLines(action.displayIndex);
        break;
      }
      default: {
        // do nothing
      }
    }
  }
}

const vbbApiStore = new VBBApiStore();

dispatcher.register(vbbApiStore.handleAction.bind(vbbApiStore));

export default vbbApiStore;
