import { connect } from "react-redux";

// Components
import App from "./App.js";

import { deselectFeature } from "./actions";

const prepareData = (allRecordings, deviceId, sensor) => {
  if (!sensor || !deviceId) return {};
  const recordings = allRecordings[deviceId][sensor];
  console.log("RECORDINGS", recordings);

  if (recordings[0].value) {
    return { recordings, dataKeys: ["0"] };
  }

  if (recordings[0].values) {
    if (Array.isArray(recordings[0].values[0])) {
      if (recordings[0].values.length > 1) {
        console.error("cannot process mutidimensional array");
        return {};
      } else {
        return processMultiData(
          recordings.map(recording => ({
            ...recording,
            values: [...recording.values[0]]
          }))
        );
      }
    } else {
      return processMultiData(recordings);
    }
  }

  return {};
};

const processMultiData = recordings => {
  if (recordings[0].values.length === 3) {
    return {
      dataKeys: ["x", "y", "z"],
      data: recordings.map(recording => ({
        aggregatedTimestamp: recording.aggregationTimestamp,
        x: recording.values[0],
        y: recording.values[1],
        z: recording.values[2]
      }))
    };
  } else {
    let dataKeys = [];
    const formattedRecordings = recordings.map(recording => {
      return recording.values.reduce(
        (acc, val, index) => {
          dataKeys[index] = index;
          return { ...acc, [index]: val };
        },
        { aggregatedTimestamp: recording.aggregationTimestamp }
      );
    });
    return {
      dataKeys,
      data: formattedRecordings
    };
  }
};

const mapStateToProps = state => {
  const { recordings, selection } = state;

  const deviceId = selection.device;
  const sensor = selection.feature;
  const { data, dataKeys } = prepareData(recordings, deviceId, sensor);
  console.log("data, dataKeys", data, dataKeys);

  return {
    sensor,
    data,
    dataKeys
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  deselectFeature: () => dispatch(deselectFeature())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
