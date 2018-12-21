// @flow

import React, { Component, Fragment } from "react";
import {
  AreaChart as AreaRechart,
  Legend,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import moment from "moment";

import { ChartWrapper } from "./ChartWrapper";

import { determineChartWidth } from "../helpers";

const chartColors = ["#2196f3", "#6ec6ff", "#0069c0", "#29434e"];

const tickFormatter = tick => moment(tick).format("HH:mm:ss");

const mockdata = [
  { date: Date.now() - 600, uv: 4000, pv: 2400, amt: 2400 },
  { date: Date.now() - 500, uv: 3000, pv: 1398, amt: 2210 },
  { date: Date.now() - 400, uv: 2000, pv: 9800, amt: 2290 },
  { date: Date.now() - 300, uv: 2780, pv: 3908, amt: 2000 },
  { date: Date.now() - 200, uv: 1890, pv: 4800, amt: 2181 },
  { date: Date.now() - 100, uv: 2390, pv: 3800, amt: 2500 },
  { date: Date.now(), uv: 3490, pv: 4300, amt: 2100 }
];

type PropsType = {
  dataLabel: string,
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
    const {
      data,
      dataLabel,
      dataKeys,
      xAxisKey = "date",
      height = 400
    } = this.props;

    return (
      <Fragment>
        <ChartWrapper width={this.state.width} dataLabel={dataLabel}>
          <AreaRechart
            layout="horizontal"
            width={this.state.width - 60}
            height={height}
            data={data}
          >
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
            <Legend iconType="line" wrapperStyle={{ color: "#819ca9" }} />
            <XAxis
              hide={false}
              domain={["auto", "auto"]}
              type="number"
              scale="time"
              axisLine={false}
              dataKey={xAxisKey}
              tick={{ fill: "#29434e" }}
              minTickGap={10000}
              tickFormatter={tickFormatter}
            />
            <YAxis axisLine={false} tick={{ fill: "#29434e" }} />
            <Tooltip animationDuration={500} />
            {dataKeys.map((key, i) => (
              <Area
                key={key}
                animationDuration={0}
                animationEasing="linear"
                type="monotone"
                dataKey={key}
                stroke={chartColors[i % 4]}
              />
            ))}
          </AreaRechart>
        </ChartWrapper>
      </Fragment>
    );
  }
}
