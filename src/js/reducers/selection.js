import { combineReducers } from "redux";

export const device = (state = null, action) => {
  switch (action.type) {
    case "select_device":
      return action.payload.deviceId;
    default:
      return state;
  }
};

export const feature = (state = null, action) => {
  switch (action.type) {
    case "select_feature":
      return action.payload.feature;
    case "deselect_feature":
      return null;
    default:
      return state;
  }
};

const selection = combineReducers({
  device,
  feature
});

export default selection;
