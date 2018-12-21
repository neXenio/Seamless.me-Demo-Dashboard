import { connect } from "react-redux";

// Components
import Selection from "./Selection.js";

// actions
import { selectDevice, selectFeature } from "../actions";

const mapStateToProps = state => {
  const { selection, recordings } = state;

  const selectedDevice = selection.device;
  const devices = Object.keys(recordings).map(deviceId => ({
    deviceId,
    selected: deviceId === selectedDevice
  }));

  const features = selectedDevice
    ? Object.keys(recordings[selectedDevice]).map(feature => ({
        feature,
        selected: feature === selection.feature
      }))
    : null;

  console.log("devices, features", devices, features);

  return {
    devices,
    features
  };
};

const mapDispatchToProps = {
  selectDevice,
  selectFeature
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Selection);
