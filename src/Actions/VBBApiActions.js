import dispatcher from "../dispatcher";

export function getDepartures(id) {
  dispatcher.dispatch({
    type: "GET_DEPARTURES",
    id,
  });
}

export function searchLocations(input, displayIndex) {
  dispatcher.dispatch({
    type: "SEARCH_LOCATION",
    input,
    displayIndex,
  });
}

export function addDisplay(newDisplay) {
  dispatcher.dispatch({
    type: "ADD_DISPLAY",
    newDisplay,
  });
}

export function removeDisplay(displayIndex) {
  dispatcher.dispatch({
    type: "REMOVE_DISPLAY",
    displayIndex,
  });
}

export function updateDisplay(displayIndex, updatedDisplay) {
  dispatcher.dispatch({
    type: "UPDATE_DISPLAY",
    displayIndex,
    updatedDisplay,
  });
}
