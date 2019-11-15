import React, {
  useEffect,
  useState,
  useRef
} from 'react';
import createPlotlyComponent from 'react-plotly.js/factory'
import Plotly from 'plotly.js';
import {
  Row,
  Col,
  Card,
  Collapsible,
  CollapsibleItem,
  Icon,
  Select
} from 'react-materialize';


const RENDERING_INTERVAL = 50;

// CHART
const CHART_PLOT_DURATION = 30 * 1000;
const MINIMUM_DATA_AGE = 500;
const MAXIMUM_DATA_AGE = CHART_PLOT_DURATION + (2 * MINIMUM_DATA_AGE);
const MINIMUM_DATA_COUNT = 1;
const MAXIMUM_DATA_COUNT = 5000;

var timestampOffset = 0;

const Plot = createPlotlyComponent(Plotly);

const Visualization = (props) => {

    const [dataRecordingContainerState, updateDataRecordingContainer] = useState(props.dataRecordingContainer);
    const [layoutState, updateLayout] = useState({});
    const [tracesState, updateTraces] = useState([{}]);
    const recreateChartPlot = useRef(true);


    useEffect(() => {
      const intervalID = window.setInterval(render, RENDERING_INTERVAL);
      return () => {
        clearInterval(intervalID)
      }
    }, [props.selectedDataId])



    // CHART INITIALIZATION
    function render() {
      var renderingStartTimestamp = Date.now();

      updateChartPlot();

      var renderingDuration = Date.now() - renderingStartTimestamp;
      if (renderingDuration > RENDERING_INTERVAL) {
        // console.log('Rendering is too slow: ' + renderingDuration + 'ms');
      }
    }

    function getChartMarkerColor(dimension) {
      var colors = ['#82C9C2', '#5D77A7', '#FF66FF']
      return colors[dimension % colors.length]
    }

    function createChartPlot(dimensions) {
      console.log("chart created");
      var traces = [];

      // add properties for each dimension
      for (var dimension = 1; dimension <= dimensions; dimension++) {
        var color = getChartMarkerColor(dimension - 1);
        var xAxis = 'x' + dimension;
        var yAxis = 'y' + dimension;
        var trace = {
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
      var layout = createChartPlotLayout(dimensions, 1);
      updateLayout(layout);
      updateTraces(traces);

      recreateChartPlot.current = false;
    }

    function createChartPlotLayout(dimensions, duration) {
      var defaultXAxis = {
        showgrid: false,
        zeroline: false,
        ticks: '',
        showticklabels: false,
        range: [-duration, 0]
      };

      var defaultYAxis = {
        showline: false,
        zeroline: false,
        tickfont: {
          color: '#DDDDDD'
        },
      };

      var layout = {
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
      for (var dimension = 1; dimension <= dimensions; dimension++) {
        var xAxisName = 'xaxis' + dimension;
        var yAxisName = 'yaxis' + dimension;
        layout[xAxisName] = defaultXAxis;
        layout[yAxisName] = defaultYAxis;
      }

      return layout;
    }

    function updateChartPlot() {
      var data = dataRecordingContainerState.getData(props.selectedDataId);
      if (data.length == 0) {
        console.log('Not updating chart plot, no data available');
        return;
      }

      var firstData = data[0];
      var lastData = data[data.length - 1];
      var dimensions = dataRecordingContainerState.getDimensions(props.selectedDataId);

      var timestamps = dataRecordingContainerState.getDataTimestamps(props.selectedDataId);
      var endTimestamp = Date.now() - MINIMUM_DATA_AGE - timestampOffset;
      var startTimestamp = endTimestamp - CHART_PLOT_DURATION;
      var duration = endTimestamp - startTimestamp;
      var delays = timestamps.map(timestamp => (timestamp - endTimestamp));

      var xValues = [];
      var yValues = [];
      for (var dimension = 0; dimension < dimensions; dimension++) {
        var valuesInDimenion = dataRecordingContainerState.getDataValuesInDimension(props.selectedDataId, dimension);
        xValues.push(delays);
        yValues.push(valuesInDimenion);
      }

      var dataUpdate = {
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

  return (
    <Col m={12} s={12} l={0} offset="s0, m0, l0">
      <Collapsible accordion={false} className="col s12 m12 l8 offset-s0 offset-m0 offset-l2">
        <CollapsibleItem header="Multiple Charts" icon={<Icon>show_chart</Icon>}>
          <Plot
              divId="chart-plot-container"
              data={tracesState}
              layout={layoutState}
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
