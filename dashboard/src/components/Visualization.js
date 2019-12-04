import React, { useEffect, useState, useRef } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory'
import Plotly from 'plotly.js';
import { Col, Collapsible, CollapsibleItem, Icon, Button } from 'react-materialize';


// CHART
const CHART_PLOT_DURATION = 20 * 1000;
const COMPARISON_CHART_PLOT_DURATION = 10 * 1000;
const MINIMUM_DATA_AGE = 500;
const RENDERING_INTERVAL = 50;
const Plot = createPlotlyComponent(Plotly);

const Visualization = (props) => {
  // eslint-disable-next-line
  const [dataRecordingContainerState, updateDataRecordingContainer] = useState(props.dataRecordingContainer);
  const recreateChartPlot = useRef(true);
  const recreateSecondChartPlot = useRef(false);
  const recreateThirdChartPlot = useRef(false);

  const recordFirstWalkingData = useRef(false);
  const recordSecondWalkingData = useRef(false);

  const firstWalkingStartTimestamp = useRef();
  const firstWalkingEndTimestamp = useRef();

  const secondWalkingStartTimestamp = useRef();
  const secondWalkingEndTimestamp = useRef();


  useEffect(
    () => {
      const intervalID = window.setInterval(render, RENDERING_INTERVAL);
      return () => clearInterval(intervalID);
    },
    // eslint-disable-next-line 
    [props.selectedDataId, props.timestampOffset /*, props.statusText */]
  )



  // CHART INITIALIZATION
  function render() {
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
  }

  function getChartMarkerColor(dimension) {
    const colors = ['#82C9C2', '#5D77A7', '#FF66FF']
    return colors[dimension % colors.length]
  }

  function createChartPlot(dimensions) {
    console.log("chart created");
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
      Plotly.newPlot('second-chart-plot-container', traces, layout);
      recreateSecondChartPlot.current = false;
    }
    if (recreateThirdChartPlot.current === true) {
      Plotly.newPlot('third-chart-plot-container', traces, layout);
      recreateThirdChartPlot.current = false;
    } else {
      Plotly.newPlot('chart-plot-container', traces, layout);
      recreateChartPlot.current = false;
    }
  }

  function createChartPlotLayout(dimensions, duration) {
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
  }

  function updateChartPlot() {
    let data = dataRecordingContainerState.getData(props.selectedDataId);
    if (data.length === 0) {
      console.log('Not updating chart plot, no data available');
      return;
    }

    // var firstData = data[0];
    // var lastData = data[data.length - 1];
    let dimensions = dataRecordingContainerState.getDimensions(props.selectedDataId);

    let timestamps = dataRecordingContainerState.getDataTimestamps(props.selectedDataId);
    let endTimestamp = Date.now() - MINIMUM_DATA_AGE - props.timestampOffset;
    let startTimestamp = endTimestamp - CHART_PLOT_DURATION;
    let duration = endTimestamp - startTimestamp;
    let delays = timestamps.map(timestamp => (timestamp - endTimestamp));

    let xValues = [];
    let yValues = [];
    for (let dimension = 0; dimension < dimensions; dimension++) {
      let valuesInDimenion = dataRecordingContainerState.getDataValuesInDimension(props.selectedDataId, dimension);
      xValues.push(delays);
      yValues.push(valuesInDimenion);
    }

    let dataUpdate = {
      x: xValues,
      y: yValues
    }

    if (recreateChartPlot.current) {
      createChartPlot(dimensions);
    } else {
      Plotly.relayout('chart-plot-container', createChartPlotLayout(dimensions, duration));
      Plotly.restyle('chart-plot-container', dataUpdate)
    }
  }

  function updateSecondChartPlot() {
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
      let valuesInDimenion = dataRecordingContainerState.getDataValuesInDimensionForComparison(props.selectedDataId, dimension, dataStartTimestamp, dataEndTimestamp);
      xValues.push(delays);
      yValues.push(valuesInDimenion);
    }

    let dataUpdate = {
      x: xValues,
      y: yValues
    }

    // console.log("Start: " + firstWalkingStartTimestamp.current);
    // console.log("End: " + firstWalkingEndTimestamp.current);

    if (recreateSecondChartPlot.current === true) {
      createChartPlot(dimensions);
    } else {
      Plotly.relayout('second-chart-plot-container', createChartPlotLayout(dimensions, duration));
      Plotly.restyle('second-chart-plot-container', dataUpdate);
    }
  }

  function updateThirdChartPlot() {
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
      let valuesInDimenion = dataRecordingContainerState.getDataValuesInDimensionForComparison(props.selectedDataId, dimension, dataStartTimestamp, dataEndTimestamp);
      xValues.push(delays);
      yValues.push(valuesInDimenion);
    }

    let dataUpdate = {
      x: xValues,
      y: yValues
    }

    // console.log("Start: " + secondWalkingStartTimestamp.current);
    // console.log("End: " + secondWalkingEndTimestamp.current);

    if (recreateThirdChartPlot.current === true) {
      createChartPlot(dimensions);
    } else {
      Plotly.relayout('third-chart-plot-container', createChartPlotLayout(dimensions, duration));
      Plotly.restyle('third-chart-plot-container', dataUpdate);
    }
  }

  // START & STOP OF SECOND PLOT
  function startSecondDataVisualisation() {
    firstWalkingStartTimestamp.current = Date.now() - props.timestampOffset;
    recordFirstWalkingData.current = true;
    recreateSecondChartPlot.current = true;
  }

  function stopSecondDataVisualisation() {
    firstWalkingEndTimestamp.current = Date.now() - props.timestampOffset;
    recordFirstWalkingData.current = false;


    // SECOND
    secondWalkingStartTimestamp.current = Date.now() - props.timestampOffset;
    recordSecondWalkingData.current = true;
    recreateThirdChartPlot.current = true;
  }

  function stopThirdDataVisualisation() {
    secondWalkingEndTimestamp.current = Date.now() - props.timestampOffset;
    recordSecondWalkingData.current = false;
  }


  return (

    <Col m={12} s={12} l={0} offset="s0, m0, l0">
      <Collapsible accordion={false} className="col s12 m12 l8 offset-s0 offset-m0 offset-l2">
        <CollapsibleItem header="Main Chart" icon={<Icon>show_chart</Icon>}>
          <Plot
            divId="chart-plot-container"
          />
          <Button waves="light" style={{ marginRight: '2px' }} onClick={startSecondDataVisualisation}>
            Start recording P1
          </Button>
          <Button waves="light" style={{ marginRight: '2px' }} onClick={stopSecondDataVisualisation}>
            Switch to P2
          </Button>
          <Button waves="light" style={{ marginRight: '2px' }} onClick={stopThirdDataVisualisation}>
            Stop recording
          </Button>
        </CollapsibleItem>
        <CollapsibleItem header="Compare Charts" icon={<Icon>compare</Icon>}>
          <Plot
            divId="second-chart-plot-container"
          />
          <Plot
            divId="third-chart-plot-container"
          />
        </CollapsibleItem>
        <CollapsibleItem header="Meta Data" icon={<Icon>info</Icon>}>
          {/* <p id="statusText" className="center">{props.statusText}}</p> */}
        </CollapsibleItem>
      </Collapsible>
    </Col>
  );
}


export default Visualization;
