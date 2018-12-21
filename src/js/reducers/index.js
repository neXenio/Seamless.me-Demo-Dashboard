import { combineReducers } from "redux";

import recordings from "./recordings";
import devices from "./devices";
import selection from "./selection";

export default combineReducers({
  devices,
  selection,
  recordings
});
