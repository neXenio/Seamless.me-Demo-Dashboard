import { combineReducers } from "redux";

import recordings from "./recordings";
import devices from "./devices";

export default combineReducers({
  devices,
  recordings
});
