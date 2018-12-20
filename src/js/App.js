import React, { Component } from "react";
import styled from "styled-components";

import Websocket from "../network/websocket.js";
import { AreaChart, LineChart } from "./charts";
import logo from "../bauth_logo.png";

const StyledRoot = styled.div`
  text-align: center;
  background-color: #546e7a;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
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

const StyledContent = styled.section`
  min-height: calc(100% - 70px);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const data = [{ date: Date.now(), uv: 4000, pv: 2400, amt: 2400 }];

const getRandomData = data => {
  return [
    ...data,
    {
      date: Date.now(),
      uv: Math.floor(Math.random() * 4001),
      pv: Math.floor(Math.random() * 10000),
      amt: Math.floor(Math.random() * 3000)
    }
  ].slice(-15);
};

class App extends Component {
  constructor(props) {
    super(props);
    new Websocket();

    this.state = { data };
    this.interval = setInterval(
      () => this.setState({ data: getRandomData(this.state.data) }),
      1000
    );
  }

  render() {
    return (
      <StyledRoot>
        <StyledHeader>
          <StyledLogo src={logo} alt="bauth_logo" />
          <StyledHeadline>BAuth Dashboard</StyledHeadline>
        </StyledHeader>
        <StyledContent>
          <LineChart
            dataLabel="TestData"
            data={this.state.data}
            dataKeys={["uv", "pv", "amt"]}
            size="half"
          />
          <AreaChart
            dataLabel="TestData"
            data={this.state.data}
            dataKeys={["uv", "pv", "amt"]}
            size="half"
          />
        </StyledContent>
      </StyledRoot>
    );
  }
}

export default App;
