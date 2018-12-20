import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { createGlobalStyle } from 'styled-components'

import App from './js/App';

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
  <Fragment>
    <GlobalAppStyle />
    <App />
  </Fragment>,
  document.getElementById('root')
);
