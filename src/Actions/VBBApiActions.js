import dispatcher from "../dispatcher";

export function getDepartures(id) {
  dispatcher.dispatch({
    type: "GET_DEPARTURES",
    id,
  });
}

export function searchLocations(input) {
  dispatcher.dispatch({
    type: "SEARCH_LOCATION",
    input,
  });
}
