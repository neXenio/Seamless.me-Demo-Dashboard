import { connect } from "react-redux";

// Components
import App from "./App.js";

import { deselectFeature } from "./actions";

const mapStateToProps = state => {
  const { recordings, selection } = state;

  if (!Object.keys(recordings).length || !selection.feature) {
    return {
      sensor: null,
      data: []
    };
  }

  const deviceId = [...Object.keys(recordings)].pop();
  const sensors = Object.keys((recordings && recordings[deviceId]) || {});
  const sensor = sensors[2];

  return {
    sensor,
    data: [
      ...recordings[deviceId][sensor].map(entry => ({
        aggregatedTimestamp: entry.aggregationTimestamp,
        x: entry.values[0],
        y: entry.values[1],
        z: entry.values[2]
      }))
    ]
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
