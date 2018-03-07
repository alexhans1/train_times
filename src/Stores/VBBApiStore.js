import {EventEmitter} from "events";
import dispatcher from "../dispatcher";

class VBBApiStore extends EventEmitter {
  constructor() {
    super();
    this.locations = [];
    this.displays = [];

    this.baseURL = 'http://demo.hafas.de/openapi/vbb-proxy/';
    this.accessId = 'alexander-hans-a507-1345a40d89c5';
  }

  buildRequest (path, parameterObj = {}) {
    console.log(parameterObj);
    let url = this.baseURL + path + '?accessId=' + this.accessId + 'format=json';
    Object.keys(parameterObj).forEach((key) => {
      console.log(key, parameterObj[key]);
      url += '&' + key + '=' + parameterObj[key];
    });
    return url;
  }

  async searchLocations (input) {
    try {
      await fetch('http://localhost:3100/vbb/searchLocations/' + input)
      .then(res => res.json())
      .then(locations => {
        this.locations = locations;
        this.emit('change');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  getLocations () {
    return this.locations;
  }

  handleAction(action) {
    switch (action.type){
      case "SEARCH_LOCATION": {
        this.searchLocations(action.input);
        break;
      }
      // case "GET_DEPARTURES": {
      //   this.createEvent(action.institution, action.eventType, action.date, action.password, action.image);
      //   break;
      // }
      // case "UPDATE_EVENT": {
      //   this.updateEvent(action.event);
      //   break;
      // }
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
