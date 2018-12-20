import { connect } from "react-redux";

// Components
import App from "./App.js";

const mapStateToProps = (state: ReduxStateType) => ({});

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
