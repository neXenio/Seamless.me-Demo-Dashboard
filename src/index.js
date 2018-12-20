import React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";

import store from "./store.js";
import App from "./js/AppContainer";

const GlobalAppStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    min-height: 100vh;
    height: 100%;
    padding: 0;
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #819ca9;
  }

  * {
    box-sizing: border-box;
  }
`;

render(
  <Provider store={store}>
    <GlobalAppStyle />
    <App />
  </Provider>,
  document.getElementById("root")
);
