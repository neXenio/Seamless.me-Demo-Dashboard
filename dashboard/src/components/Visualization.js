import React, { useEffect, useState, useRef, useCallback } from 'react';
import MediaQuery from 'react-responsive';
// import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js';
import { Col, Button, Card } from 'react-materialize';

// CHART
const CHART_PLOT_DURATION = 30 * 1000;
const COMPARISON_CHART_PLOT_DURATION = 15 * 1000;
// const MINIMUM_DATA_AGE = 500;
const RENDERING_INTERVAL = 50;
// const Plot = createPlotlyComponent(Plotly);

const Visualization = (props) => {
  // eslint-disable-next-line
  const [dataRecordingContainerState, updateDataRecordingContainer] = useState(props.dataRecordingContainer);
  const recreateChartPlot = useRef(true);
  const recreateSecondChartPlot = useRef(false);
  const recreateThirdChartPlot = useRef(false);

  const [showFirstWalkingPlot, updateShowFirstWalkingPlot] = useState(false);
  const [showSecondWalkingPlot, updateShowSecondWalkingPlot] = useState(false);

  const recordFirstWalkingData = useRef(false);
  const recordSecondWalkingData = useRef(false);

  const mainWalkingStartTimestamp = useRef();
  const mainWalkingEndTimestamp = useRef();

  const firstWalkingStartTimestamp = useRef();
  const firstWalkingEndTimestamp = useRef();

  const secondWalkingStartTimestamp = useRef();
  const secondWalkingEndTimestamp = useRef();

  const getChartMarkerColor = useCallback((dimension) => {
    const colors = ['#82C9C2', '#5D77A7', '#FF66FF']
    return colors[dimension % colors.length]
  }, []);

  const createChartPlotLayout = useCallback((dimensions, duration) => {
    let defaultXAxis = {
      showgrid: false,
      zeroline: false,
      ticks: '',
      showticklabels: false,
      range: [-duration, 0]
    };

    let defaultYAxis = {
      showline: false,
      zeroline: false,
      tickfont: {
        color: '#DDDDDD'
      },
    };

    let layout = {
      grid: {
        rows: 3,
        columns: 1,
        pattern: 'independent'
      },
      xaxis: defaultXAxis,
      yaxis: defaultYAxis,
      showlegend: false,
      margin: {
        autoexpand: false,
        l: 60,
        r: 60,
        t: 0,
        b: 0,
        pad: 0
      },
    };

    // add properties for each dimension
    for (let dimension = 1; dimension <= dimensions; dimension++) {
      let xAxisName = 'xaxis' + dimension;
      let yAxisName = 'yaxis' + dimension;
      layout[xAxisName] = defaultXAxis;
      layout[yAxisName] = defaultYAxis;
    }

    return layout;
  }, []);

  const createChartPlot = useCallback((dimensions) => {
    let traces = [];
    // add properties for each dimension
    for (let dimension = 1; dimension <= dimensions; dimension++) {
      let color = getChartMarkerColor(dimension - 1);
      let xAxis = 'x' + dimension;
      let yAxis = 'y' + dimension;
      let trace = {
        x: [0],
        y: [0],
        xaxis: xAxis,
        yaxis: yAxis,
        type: 'scatter',
        mode: 'lines',
        marker: {
          color: color,
          size: 1
        }
      }
      traces.push(trace);
    }
    let layout = createChartPlotLayout(dimensions, 1);

    if (recreateSecondChartPlot.current === true) {
      Plotly.newPlot('second-chart-plot-container', traces, layout, { responsive: true });
      recreateSecondChartPlot.current = false;
    }
    if (recreateThirdChartPlot.current === true) {
      Plotly.newPlot('third-chart-plot-container', traces, layout, { responsive: true });
      recreateThirdChartPlot.current = false;
    } else {
      Plotly.newPlot('chart-plot-container', traces, layout, { responsive: true });
      recreateChartPlot.current = false;
    }

    console.log("chart created");
  }, [createChartPlotLayout, getChartMarkerColor]);

  const updateChartPlot = useCallback(() => {
    let data = dataRecordingContainerState.getData(props.selectedDataId);

    if (data.length === 0) {
      console.log('Not updating main chart plot, no data available');
      return;
    }

    let dimensions = dataRecordingContainerState.getDimensions(props.selectedDataId);

    var dataStartTimestamp;
    var dataEndTimestamp;
    var chartEndTimestamp;

    if (mainWalkingEndTimestamp.current) {
      chartEndTimestamp = mainWalkingEndTimestamp.current;
    } else {
      chartEndTimestamp = Date.now() - props.timestampOffset;
    }

    let chartStartTimestamp = chartEndTimestamp - CHART_PLOT_DURATION;

    if (mainWalkingEndTimestamp.current) {
      dataEndTimestamp = mainWalkingEndTimestamp.current;
    } else {
      dataEndTimestamp = chartEndTimestamp;
    }

    dataStartTimestamp = Math.max(mainWalkingStartTimestamp.current, chartStartTimestamp);

    let timestamps = dataRecordingContainerState.getDataTimestampsForComparison(props.selectedDataId, dataStartTimestamp, dataEndTimestamp);
    let duration = chartEndTimestamp - chartStartTimestamp;
    let delays = timestamps.map(timestamp => (timestamp - chartEndTimestamp));
    let xValues = [];
    let yValues = [];

    for (let dimension = 0; dimension < dimensions; dimension++) {
      let valuesInDimenion = dataRecordingContainerState.getDataValuesInDimension(props.selectedDataId, dimension, dataStartTimestamp, dataEndTimestamp);
      xValues.push(delays);
      yValues.push(valuesInDimenion);
    }

    let dataUpdate = {
      x: xValues,
      y: yValues
    }

    // console.log("Start-Main-Plot: " + mainWalkingStartTimestamp.current);
    // console.log("End-Main-Plot: " + mainWalkingEndTimestamp.current);

    if (recreateChartPlot.current === true) {
      createChartPlot(dimensions);
    } else {
      Plotly.relayout('chart-plot-container', createChartPlotLayout(dimensions, duration));
      Plotly.restyle('chart-plot-container', dataUpdate)
    }
  }, [createChartPlot, createChartPlotLayout, dataRecordingContainerState, props.selectedDataId, props.timestampOffset]);

  const updateSecondChartPlot = useCallback(() => {
    let dimensions = dataRecordingContainerState.getDimensions(props.selectedDataId);

    var dataStartTimestamp;
    var dataEndTimestamp;
    var chartEndTimestamp;

    if (firstWalkingEndTimestamp.current) {
      chartEndTimestamp = firstWalkingEndTimestamp.current;
    } else {
      chartEndTimestamp = Date.now() - props.timestampOffset;
    }

    let chartStartTimestamp = chartEndTimestamp - COMPARISON_CHART_PLOT_DURATION;

    if (firstWalkingEndTimestamp.current) {
      dataEndTimestamp = firstWalkingEndTimestamp.current;
    } else {
      dataEndTimestamp = chartEndTimestamp;
    }

    dataStartTimestamp = Math.max(firstWalkingStartTimestamp.current, chartStartTimestamp);

    let timestamps = dataRecordingContainerState.getDataTimestampsForComparison(props.selectedDataId, dataStartTimestamp, dataEndTimestamp);
    let duration = chartEndTimestamp - chartStartTimestamp;
    let delays = timestamps.map(timestamp => (timestamp - chartEndTimestamp));
    let xValues = [];
    let yValues = [];

    for (let dimension = 0; dimension < dimensions; dimension++) {
      let valuesInDimenion = dataRecordingContainerState.getDataValuesInDimension(props.selectedDataId, dimension, dataStartTimestamp, dataEndTimestamp);
      xValues.push(delays);
      yValues.push(valuesInDimenion);
    }

    let dataUpdate = {
      x: xValues,
      y: yValues
    }

    // console.log("Start-Second-Plot: " + firstWalkingStartTimestamp.current);
    // console.log("End-Second-Plot: " + firstWalkingEndTimestamp.current);

    if (recreateSecondChartPlot.current === true) {
      createChartPlot(dimensions);
    } else {
      Plotly.relayout('second-chart-plot-container', createChartPlotLayout(dimensions, duration));
      Plotly.restyle('second-chart-plot-container', dataUpdate);
    }
  }, [createChartPlot, createChartPlotLayout, dataRecordingContainerState, props.selectedDataId, props.timestampOffset]);


  const updateThirdChartPlot = useCallback(() => {
    let dimensions = dataRecordingContainerState.getDimensions(props.selectedDataId);

    var dataStartTimestamp;
    var dataEndTimestamp;
    var chartEndTimestamp;

    if (secondWalkingEndTimestamp.current) {
      chartEndTimestamp = secondWalkingEndTimestamp.current;
    } else {
      chartEndTimestamp = Date.now() - props.timestampOffset;
    }

    let chartStartTimestamp = chartEndTimestamp - COMPARISON_CHART_PLOT_DURATION;

    if (secondWalkingEndTimestamp.current) {
      dataEndTimestamp = secondWalkingEndTimestamp.current;
    } else {
      dataEndTimestamp = chartEndTimestamp;
    }

    dataStartTimestamp = Math.max(secondWalkingStartTimestamp.current, chartStartTimestamp);

    let timestamps = dataRecordingContainerState.getDataTimestampsForComparison(props.selectedDataId, dataStartTimestamp, dataEndTimestamp);
    let duration = chartEndTimestamp - chartStartTimestamp;
    let delays = timestamps.map(timestamp => (timestamp - chartEndTimestamp));
    let xValues = [];
    let yValues = [];

    for (let dimension = 0; dimension < dimensions; dimension++) {
      let valuesInDimenion = dataRecordingContainerState.getDataValuesInDimension(props.selectedDataId, dimension, dataStartTimestamp, dataEndTimestamp);
      xValues.push(delays);
      yValues.push(valuesInDimenion);
    }

    let dataUpdate = {
      x: xValues,
      y: yValues
    }

    // console.log("Start-Third-Plot: " + secondWalkingStartTimestamp.current);
    // console.log("End-Third-Plot: " + secondWalkingEndTimestamp.current);

    if (recreateThirdChartPlot.current === true) {
      createChartPlot(dimensions);
    } else {
      Plotly.relayout('third-chart-plot-container', createChartPlotLayout(dimensions, duration));
      Plotly.restyle('third-chart-plot-container', dataUpdate);
    }
  }, [createChartPlot, createChartPlotLayout, dataRecordingContainerState, props.selectedDataId, props.timestampOffset]);

  // CHART INITIALIZATION
  const render = useCallback(() => {
    let renderingStartTimestamp = Date.now();

    updateChartPlot();

    if (recordFirstWalkingData.current === true) {
      updateSecondChartPlot();
    }

    if (recordSecondWalkingData.current === true) {
      updateThirdChartPlot();
    }

    let renderingDuration = Date.now() - renderingStartTimestamp;
    if (renderingDuration > RENDERING_INTERVAL) {
      // console.log('Rendering is too slow: ' + renderingDuration + 'ms');
    }
  }, [updateChartPlot, updateSecondChartPlot, updateThirdChartPlot]);

  useEffect(
    () => {
      mainWalkingStartTimestamp.current = Date.now() - props.timestampOffset;
      const intervalID = window.setInterval(render, RENDERING_INTERVAL);
      return () => clearInterval(intervalID);
    }, [props.selectedDataId, props.timestampOffset, render, recreateChartPlot /*,props.statusText*/]);

  // START, SWITCH STOP OF COMPARISON PLOT
  const startSecondDataVisualisation = useCallback(() => {
    firstWalkingStartTimestamp.current = Date.now() - props.timestampOffset;
    recordFirstWalkingData.current = true;
    recreateSecondChartPlot.current = true;
    updateShowFirstWalkingPlot(!showFirstWalkingPlot);
  }, [props.timestampOffset, showFirstWalkingPlot]);

  const switchToSecondDataVisualisation = useCallback(() => {
    firstWalkingEndTimestamp.current = Date.now() - props.timestampOffset;
    recordFirstWalkingData.current = false;
    updateShowSecondWalkingPlot(!showSecondWalkingPlot);
    secondWalkingStartTimestamp.current = Date.now() - props.timestampOffset;
    recordSecondWalkingData.current = true;
    recreateThirdChartPlot.current = true;
  }, [props.timestampOffset, showSecondWalkingPlot]);

  const stopThirdDataVisualisation = useCallback(() => {
    secondWalkingEndTimestamp.current = Date.now() - props.timestampOffset;
    recordSecondWalkingData.current = false;
  }, [props.timestampOffset]);

  const comparisonDivStyle = {
    height: 200
  };

  return (
    <div>
      <Col s={6} m={6} l={6}>
        <Button className="red" waves="light" style={{ marginRight: '50px' }} onClick={startSecondDataVisualisation}>
          Start recording
          </Button>
        <Button className="red" waves="light" style={{ marginRight: '50px' }} onClick={switchToSecondDataVisualisation}>
          Switch
          </Button>
        <Button className="red" waves="light" style={{ marginRight: '50px' }} onClick={stopThirdDataVisualisation}>
          Stop recording
          </Button>
      </Col>

      <MediaQuery minHeight={568} maxHeight={1024}>
        <Col s={12} m={12} l={12}>
          <Card>
            {/* <Plot divId="chart-plot-container" /> */}
            <div style={{ height: 600 }} id="chart-plot-container"></div>
          </Card>
        </Col>
      </MediaQuery>
      <MediaQuery minHeight={1049} maxHeight={2558}>
        <Col s={12} m={12} l={12}>
          <Card>
            {/* <Plot divId="chart-plot-container" /> */}
            <div style={{ height: 1000 }} id="chart-plot-container"></div>
          </Card>
        </Col>
      </MediaQuery>
      <MediaQuery minHeight={2558}>
        <Col s={12} m={12} l={12}>
          <Card>
            {/* <Plot divId="chart-plot-container" /> */}
            <div style={{ height: 2500 }} id="chart-plot-container"></div>
          </Card>
        </Col>
      </MediaQuery>

      <MediaQuery minHeight={1049} maxHeight={2558}>
        <Col s={6} m={6} l={6}>
          <Card>
            {/* {showFirstWalkingPlot && <Plot divId="second-chart-plot-container" />} */}
            {showFirstWalkingPlot && <div style={{ height: 450 }} id="second-chart-plot-container"></div>}
          </Card>
        </Col>
      </MediaQuery>
      <MediaQuery minHeight={2558}>
        <Col s={6} m={6} l={6}>
          <Card>
            {/* {showFirstWalkingPlot && <Plot divId="second-chart-plot-container" />} */}
            {showFirstWalkingPlot && <div style={{ height: 1500 }} id="second-chart-plot-container"></div>}
          </Card>
        </Col>
      </MediaQuery>

      <MediaQuery minHeight={1049} maxHeight={2558}>
        <Col s={6} m={6} l={6}>
          <Card>
            {/* {showSecondWalkingPlot && <Plot divId="third-chart-plot-container" />} */}
            {showSecondWalkingPlot && <div style={{ height: 450 }} id="third-chart-plot-container"></div>}
          </Card>
        </Col>
      </MediaQuery>
      <MediaQuery minHeight={2558}>
        <Col s={6} m={6} l={6}>
          <Card>
            {/* {showSecondWalkingPlot && <Plot divId="third-chart-plot-container" />} */}
            {showSecondWalkingPlot && <div style={{ height: 1500 }} id="third-chart-plot-container"></div>}
          </Card>
        </Col>
      </MediaQuery>

      {/* <p id="statusText" className="center">{props.statusText}}</p> */}
    </div >
  );
}

export default Visualization;
