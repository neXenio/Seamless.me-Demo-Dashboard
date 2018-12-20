// @flow

import React from 'react';
import styled from 'styled-components';


const StyledRoot = styled.div`
  margin: 20px 0;
  padding: 20px 30px;
  width: ${({ width }) => width}px;
  background-color: #819ca9;
  border-radius: 3px;
`;

const StyledChartLabel = styled.label`
  font-size: 20px;
  font-weight: 500;
  color: #29434e;
`;

type PropsType = {
  width: number,
  dataLabel: string
};


const ChartWrapper = (props: PropsType) => {
  return (
    <StyledRoot width={props.width}>
      <StyledChartLabel>{props.dataLabel}</StyledChartLabel>
      {props.children}
    </StyledRoot>
  );
};

export { ChartWrapper };
