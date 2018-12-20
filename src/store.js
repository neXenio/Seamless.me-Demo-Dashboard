// @flow

import { compose, applyMiddleware, createStore } from "redux";

import reducers from "./js/reducers";

const store = createStore(
  reducers,
  compose(window.__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;
