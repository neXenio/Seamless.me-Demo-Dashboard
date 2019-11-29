import React, { useEffect, useState, useRef } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory'
import Plotly from 'plotly.js';
import { Col, Collapsible, CollapsibleItem, Icon, Button } from 'react-materialize';


// CHART
const CHART_PLOT_DURATION = 30 * 1000;
const COMPARISON_CHART_PLOT_DURATION = 10 * 1000;
const MINIMUM_DATA_AGE = 500;
const RENDERING_INTERVAL = 50;
let timestampOffset = 0;
const Plot = createPlotlyComponent(Plotly);

const Visualization = (props) => {
  // eslint-disable-next-line
  const [dataRecordingContainerState, updateDataRecordingContainer] = useState(props.dataRecordingContainer);
  const recreateChartPlot = useRef(true);
  const newDataVisualisationStatus = useRef(false);
  const startTimestampValue = useRef();
  const endTimestampValue = useRef();


  useEffect(
    () => {
      const intervalID = window.setInterval(render, RENDERING_INTERVAL);
      return () => clearInterval(intervalID);
    },
    // eslint-disable-next-line 
    [props.selectedDataId]
  )



  // CHART INITIALIZATION
  function render() {
    let renderingStartTimestamp = Date.now();

    updateChartPlot();

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

    Plotly.newPlot('chart-plot-container', traces, layout, { responsive: true });

    if (newDataVisualisationStatus.current) {
      Plotly.newPlot('second-chart-plot-container', traces, layout, { responsive: true });
    }

    recreateChartPlot.current = false;
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
    let endTimestamp = Date.now() - MINIMUM_DATA_AGE - timestampOffset;
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

      // UPDATING THE COMPARISON CHART
      if (newDataVisualisationStatus.current) {
        let dimensionsC = dataRecordingContainerState.getDimensions(props.selectedDataId);

        let timestampsC = dataRecordingContainerState.getDataTimestamps(props.selectedDataId);
        var endTimestampC;

        if (endTimestampValue.current) {
          endTimestampC = endTimestampValue.current
        } else {
          endTimestampC = Date.now() - timestampOffset;
        }

        let startTimestampC = startTimestampValue.current - COMPARISON_CHART_PLOT_DURATION;
        let durationC = endTimestampC - startTimestampC;
        let delaysC = timestampsC.map(timestamp => (timestamp - endTimestampC));

        let xValuesC = [];
        let yValuesC = [];
        for (let dimension = 0; dimension < dimensionsC; dimension++) {
          let valuesInDimenionC = dataRecordingContainerState.getDataValuesInDimension(props.selectedDataId, dimension);
          xValuesC.push(delaysC);
          yValuesC.push(valuesInDimenionC);
        }

        let dataUpdateC = {
          x: xValuesC,
          y: yValuesC
        }

        console.log("Start: " + startTimestampC);
        console.log("End: " + endTimestampC);

        Plotly.relayout('second-chart-plot-container', createChartPlotLayout(dimensionsC, durationC));
        Plotly.restyle('second-chart-plot-container', dataUpdateC)
      }
    }
  }

  function startNewDataVisualisation() {
    startTimestampValue.current = Date.now();
    newDataVisualisationStatus.current = true;
    recreateChartPlot.current = true;
  }

  function stopNewDataVisualisation() {
    endTimestampValue.current = Date.now();
    newDataVisualisationStatus.current = false;
  }


  return (

    <Col m={12} s={12} l={0} offset="s0, m0, l0">
      <Collapsible accordion={false} className="col s12 m12 l8 offset-s0 offset-m0 offset-l2">
        <CollapsibleItem header="Multiple Charts" icon={<Icon>show_chart</Icon>}>
          <Plot
            divId="chart-plot-container"
          />
          <Button waves="light" style={{ marginRight: '5px' }} onClick={startNewDataVisualisation}>
            Start comparing
          </Button>
          <Button waves="light" style={{ marginRight: '5px' }} onClick={stopNewDataVisualisation}>
            Stop comparing
          </Button>
          <Plot
            divId="second-chart-plot-container"
          />
        </CollapsibleItem>
        <CollapsibleItem header="Stacked Chart" icon={<Icon>scatter_plot</Icon>}>
          Lorem ipsum dolor sit amet.
        </CollapsibleItem>
        <CollapsibleItem header="Meta Data" icon={<Icon>info</Icon>}>
          <p id="statusText" className="center">Status Text</p>
        </CollapsibleItem>
      </Collapsible>
    </Col>
  );
}


export default Visualization;
