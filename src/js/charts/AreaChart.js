// @flow

import React, { Component } from "react";
import {
  AreaChart as AreaRechart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import styled from "styled-components";

import { getCurrentScreenSize } from "../helpers";

const determineChartWidth = size => {
  const { width } = getCurrentScreenSize();
  const contentWidth = width - 2 * 20; // content padding

  return {
    full: contentWidth,
    half: contentWidth / 2,
    third: contentWidth / 3
  }[size];
};

const chartColors = ["#2196f3", "#6ec6ff", "#0069c0", "#29434e"];

type PropsType = {
  data: Object[],
  dataKeys: string[],
  xAxisKey?: string,
  size?: "full" | "half" | "third",
  height?: number
};

type StateType = {
  width: number
};

export class AreaChart extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);

    this.state = {
      width: determineChartWidth(props.size || "half")
    };
  }

  render() {
    const { data, dataKeys, xAxisKey = "date", height = 400 } = this.props;

    return (
      <AreaRechart width={this.state.width} height={height} data={data}>
        <defs>
          {dataKeys.map((key, i) => (
            <linearGradient key={key} id={key} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors[i % 4]}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={chartColors[i % 4]}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>
        <XAxis
          scale="time"
          type="number"
          axisLine={false}
          dataKey={xAxisKey}
          tick={{ fill: "#29434e" }}
        />
        <YAxis tick={{ fill: "#29434e" }} />
        <Tooltip animationDuration={500} />
        {dataKeys.map((key, i) => (
          <Area
            type="monotone"
            dataKey={key}
            stroke={chartColors[i % 4]}
            fillOpacity={1}
            fill={`url(#${key})`}
          />
        ))}
      </AreaRechart>
    );
  }
}
