// @flow

import React, { Component } from "react";
import {
  LineChart as LineRechart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import moment from "moment";

import { ChartWrapper } from "./ChartWrapper";

import { determineChartWidth } from "../helpers";

const chartColors = ["#2196f3", "#6ec6ff", "#0069c0", "#29434e"];

const tickFormatter = tick => moment(tick).format("HH:mm:ss");

type PropsType = {
  data: Object[],
  dataKeys: string[],
  xAxisKey?: string,
  size?: "full" | "half" | "third",
  height?: number
};

type StateType = {
  width: number,
  dataLabel: string
};

export class LineChart extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);

    this.state = {
      width: determineChartWidth(props.size || "half")
    };
  }

  render() {
    const {
      data,
      dataLabel,
      dataKeys,
      xAxisKey = "date",
      height = 400
    } = this.props;

    return (
      <ChartWrapper width={this.state.width} dataLabel={dataLabel}>
        <LineRechart width={this.state.width - 60} height={height} data={data}>
          <XAxis
            hide={true}
            domain={["auto", "auto"]}
            type="number"
            scale="time"
            axisLine={false}
            dataKey={xAxisKey}
            tick={{ fill: "#29434e" }}
            tickFormatter={tickFormatter}
          />
          <YAxis tick={{ fill: "#29434e" }} />
          <Tooltip animationDuration={500} />
          {dataKeys.map((key, i) => (
            <Line
              legendType="square"
              animationDuration={900}
              animationEasing="linear"
              label="line"
              key={key}
              type="monotone"
              dataKey={key}
              stroke={chartColors[i % 4]}
            />
          ))}
        </LineRechart>
      </ChartWrapper>
    );
  }
}
