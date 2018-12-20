import React, { Component } from 'react';
import styled from "styled-components";

import logo from '../bauth_logo.png';

const StyledRoot = styled.div`
  text-align: center;
  background-color: #546e7a;
  width: 100%;
  height: 100%;
`;

const StyledHeader = styled.header`
  height: 70px;

  background-color: #29434e;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const StyledLogo = styled.img`
  position: absolute;
  cursor: pointer
  height: 50px;
  width: 50px;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }
`;

const StyledHeadline = styled.p`
  font-size: 26px;
  font-weight: 500;
`;

class App extends Component {
  render() {
    return (
      <StyledRoot>
        <StyledHeader>
          <StyledLogo src={logo} alt="bauth_logo" />
          <StyledHeadline>BAuth Dashboard</StyledHeadline>
        </StyledHeader>
      </StyledRoot>
    );
  }
}

export default App;
