import React, { Component } from "react";
import styled from "styled-components";

const StyledRoot = styled.div`
  text-align: center;
  background-color: #546e7a;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  display: flex;
`;

const StyledOptionsContainer = styled.div`
  width: 50%;
  height: 100%;
  padding: 3rem;
`;

const StyledOption = styled.div`
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: ${props => (props.selected ? "#178de7" : "#fff")};
  color: #000;
  border-radius: 10px;
  user-select: none;
  margin: 20px;
  cursor: pointer;
  transform: translateY(-50%);
  transition: transform 0.1s ease;

  &:hover {
    transform: translateY(-50%) scale(1.01);
  }
`;

class Selection extends Component {
  render() {
    const { devices, features, selectDevice, selectFeature } = this.props;
    return (
      <StyledRoot>
        <StyledOptionsContainer>
          {devices.map(device => (
            <StyledOption
              key={device.deviceId}
              selected={device.selected}
              onClick={() => selectDevice(device.deviceId)}
            >
              {device.deviceId}
            </StyledOption>
          ))}
        </StyledOptionsContainer>
        {features && (
          <StyledOptionsContainer>
            {features.map(feature => (
              <StyledOption
                key={feature.feature}
                selected={feature.selected}
                onClick={() => selectFeature(feature.feature)}
              >
                {feature.feature}
              </StyledOption>
            ))}
          </StyledOptionsContainer>
        )}
      </StyledRoot>
    );
  }
}

export default Selection;
