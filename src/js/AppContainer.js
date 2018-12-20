import { connect } from "react-redux";

// Components
import App from "./App.js";

const mapStateToProps = (state: ReduxStateType) => {
  const { recordings } = this.state;
  const deviceId = recordings.keys().pop();
  const sensors = recordings[deviceId].keys();
  const sensor = sensors[0];

  return {
    sensor,
    data: {
      [sensor]: recordings[deviceId][sensor].map(entry => ({
        aggregatedTimestamp: entry.aggregatedTimestamp,
        x: entry.values[0],
        y: entry.values[1],
        z: entry.values[2]
      }))
    }
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
