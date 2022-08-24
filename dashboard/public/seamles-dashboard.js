/* eslint-disable */
/*
 * Seamless.me Demo Dashboard
 * Read more on GitHub: https://github.com/neXenio/BAuth-Demo-Dashboard
 */

const BAUTH_DEMO_SERVER = "https://bauth-demo-server--steppschuh.repl.co/";
const MESSAGE_INITIALIZE_DEVICE = "initialize_device";
const MESSAGE_INITIALIZE_DASHBOARD = "initialize_dashboard";
const MESSAGE_DATA_RECORDING = "data_recording";
const CHART_PLOT_CONTAINER = "chart-plot-container";
const STACKED_CONTAINER = "stacked-chart-container";

const RENDERING_INTERVAL = 50;
const CHART_PLOT_DURATION = 30 * 1000;

const MINIMUM_DATA_AGE = 500;
const MAXIMUM_DATA_AGE = CHART_PLOT_DURATION + 2 * MINIMUM_DATA_AGE;
const MINIMUM_DATA_COUNT = 1;
const MAXIMUM_DATA_COUNT = 5000;

var preselectedDeviceId;
var preselectedDataId =
  "com.nexenio.behaviourauthentication.core.internal.behaviour.data.sensor.data.GravitySensorData";

var socket;
var dataRecordingContainer;
var connectedDevices;
var selectedDevice;
var selectedDataId = preselectedDataId;

var recreateChartPlot = true;

var timestampOffset = 0;

var renderInterval;

// called on page load
function initialize() {
  dataRecordingContainer = new DataRecordingContainer();
  connectedDevices = [];
  setupForms();
  setupSocket();

  preselectedDeviceId = localStorage.preselectedDeviceId || preselectedDeviceId;
  preselectedDataId = localStorage.preselectedDataId || preselectedDataId;

  const dimensions = dataRecordingContainer.getDimensions(selectedDataId);
  createChartPlot("userAChart", dimensions);
  createChartPlot("userBChart", dimensions);

  console.log("Pre-selected Device ID: " + preselectedDeviceId);
  console.log("Pre-selected Data ID: " + preselectedDataId);
}

function setupForms() {
  $(".modal").modal();
  $("select").formSelect();
  $(".collapsible").collapsible();
  $(".fixed-action-btn").floatingActionButton();
  M.Collapsible.init(document.querySelector(".collapsible.expandable"), {
    accordion: false,
  });
  $("#deviceIdSelect").change(function (event) {
    var selectedDeviceId = $("#deviceIdSelect option:selected").val();
    localStorage.preselectedDeviceId = selectedDeviceId;
    selectedDevice = connectedDevices.filter(
      (connectedDevice) => connectedDevice.id == selectedDeviceId
    )[0];
    console.log("Selected device changed: " + JSON.stringify(selectedDevice));
    dataRecordingContainer = new DataRecordingContainer();
  });
  $("#dataIdSelect").change(function (event) {
    selectedDataId = $("#dataIdSelect option:selected").val();
    localStorage.preselectedDataId = selectedDataId;
    console.log("Selected data ID changed: " + selectedDataId);
    recreateChartPlot = true;
  });
}

function setupSocket() {
  socket = io(BAUTH_DEMO_SERVER);

  socket.on("connect", function () {
    console.log("Connected to the Demo Server");
    M.toast({
      html: "Connected to the Demo Server",
      displayLength: 2000,
    });
    socket.send({
      key: MESSAGE_INITIALIZE_DASHBOARD,
      data: {
        name: "JSFiddle",
      },
    });
  });

  socket.on("message", function (message) {
    try {
      if (typeof message === "string") {
        message = JSON.parse(message);
      }

      var key = message.key;
      var data = message.data;

      switch (key) {
        case MESSAGE_INITIALIZE_DEVICE:
          processDeviceInitialization(data);
          break;
        case MESSAGE_DATA_RECORDING:
          processDataRecordingContainer(data);
          break;
        default:
          console.log("Unknown message key: " + key);
          break;
      }
    } catch (error) {
      console.log("Unable to handle message:\n" + JSON.stringify(message));
      console.error(error);
    }
  });
}

function processDeviceInitialization(device) {
  console.log("Device initialization received: " + JSON.stringify(device));
  if (
    connectedDevices.filter(
      (connectedDevice) => connectedDevice.id == device.id
    ).length == 0
  ) {
    onDeviceWithNewIdConnected(device);
  }
}

function processDataRecordingContainer(partialDataRecordingContainer) {
  if (
    typeof selectedDevice === "undefined" ||
    partialDataRecordingContainer.deviceInfo.id !== selectedDevice.id
  ) {
    //console.log('Not processing data recording container from: ' + partialDataRecordingContainer.deviceInfo.id);
    return;
  }

  var delay = Date.now() - partialDataRecordingContainer.endTimestamp;
  if (Math.abs(timestampOffset - delay) > 1000) {
    timestampOffset = delay - 1000;
    console.log("Updated timestamp offset to " + timestampOffset);
  }
  $("#statusText").text(
    "Processing partial data recording with " + delay + "ms delay"
  );

  partialDataRecordingContainer.recordings.forEach(function (dataRecording) {
    if (dataRecordingContainer.getData(dataRecording.dataId).length == 0) {
      onDataWithNewIdReceived(dataRecording.dataId);
    }
    dataRecordingContainer.addDataRecording(dataRecording);
  });
  dataRecordingContainer.trim();
}

function onDeviceWithNewIdConnected(device) {
  M.toast({
    html: device.name + " connected",
    displayLength: 2000,
  });

  // update the connected devices array, place the new device first
  var otherConnectedDevices = connectedDevices.filter(
    (connectedDevice) => connectedDevice.id != device.id
  );
  connectedDevices = [device].concat(otherConnectedDevices);

  // remove all but default select option
  $("#deviceIdSelect option:gt(0)").remove();

  // append connected devices as options
  connectedDevices.forEach((connectedDevice) => {
    var optionValue = connectedDevice.id;
    var optionText = connectedDevice.name;
    //var optionText = connectedDevice.name + ' (' + connectedDevice.id + ')';
    var option = $("<option></option>")
      .attr("value", optionValue)
      .text(optionText);
    $("#deviceIdSelect").append(option);
  });

  var updateSelectedDevice = false; //!selectedDevice;
  if (device.id === preselectedDeviceId) {
    console.log("Preselected device connected");
    console.log(device);
    updateSelectedDevice = true;
  }

  // update select
  if (updateSelectedDevice) {
    console.log("Updating selected device");
    selectedDevice = device;
  }
  if (selectedDevice) {
    $("#deviceIdSelect").val(selectedDevice.id).change();
  }
  $("#deviceIdSelect").formSelect();
}

function onDataWithNewIdReceived(id) {
  // first recording of data with that ID
  console.log("Received first recording of data with ID: " + id);

  var ids = dataRecordingContainer.getIds().sort();

  // remove all but default select option
  $("#dataIdSelect option:gt(0)").remove();

  // append available IDs as options
  ids.forEach((id) => {
    var optionValue = id;
    var optionText = DataRecordingContainer.getReadableId(id);
    var option = $("<option></option>")
      .attr("value", optionValue)
      .text(optionText);
    $("#dataIdSelect").append(option);
  });

  var updateSelectedDataId = !selectedDataId;
  if (id === preselectedDataId) {
    console.log("Preselected data ID available: " + id);
    updateSelectedDataId = true;
  }

  // update select
  if (updateSelectedDataId) {
    console.log("Updating selected data ID: " + id);
    selectedDataId = id;
  }
  $("#dataIdSelect").val(selectedDataId).change();
  $("#dataIdSelect").formSelect();
}

function getChartMarkerColor(dimension) {
  var colors = ["#82C9C2", "#5D77A7", "#FF66FF"];
  return colors[dimension % colors.length];
}

function render() {
  var renderingStartTimestamp = Date.now();

  updateChartPlot();

  var renderingDuration = Date.now() - renderingStartTimestamp;
  if (renderingDuration > RENDERING_INTERVAL) {
    //console.log('Rendering is too slow: ' + renderingDuration + 'ms');
  }
}

function createChartPlot(container = CHART_PLOT_CONTAINER, dimensions) {
  var traces = [];

  // add properties for each dimension
  for (var dimension = 1; dimension <= dimensions; dimension++) {
    var color = getChartMarkerColor(dimension - 1);
    var xAxis = "x" + dimension;
    var yAxis = "y" + dimension;
    var trace = {
      x: [0],
      y: [0],
      xaxis: xAxis,
      yaxis: yAxis,
      type: "scatter",
      mode: "lines",
      marker: {
        color: color,
        size: 1,
      },
    };
    traces.push(trace);
  }
  var layout = createChartPlotLayout(dimensions, 1);
  Plotly.react(container, traces, layout, { responsive: true });
  recreateChartPlot = false;
}

function createChartPlotLayout(dimensions, duration) {
  var defaultXAxis = {
    showgrid: false,
    zeroline: false,
    ticks: "",
    showticklabels: false,
    range: [-duration, 0],
  };

  var defaultYAxis = {
    showline: false,
    zeroline: false,
    tickfont: {
      color: "#aaa",
    },
  };

  var layout = {
    autosize: true,
    grid: {
      rows: 3,
      columns: 1,
      pattern: "independent",
    },
    xaxis: defaultXAxis,
    yaxis: defaultYAxis,
    showlegend: false,
    margin: {
      autoexpand: false,
      l: 60,
      r: 60,
      t: 20,
      b: 0,
      pad: 0,
    },
  };

  // add properties for each dimension
  for (var dimension = 1; dimension <= dimensions; dimension++) {
    var xAxisName = "xaxis" + dimension;
    var yAxisName = "yaxis" + dimension;
    layout[xAxisName] = defaultXAxis;
    layout[yAxisName] = defaultYAxis;
  }

  return layout;
}

function updateChartPlot(container = CHART_PLOT_CONTAINER) {
  var data = dataRecordingContainer.getData(selectedDataId);

  if (data.length == 0) {
    console.log("Not updating chart plot, no data available");
    return;
  }

  var firstData = data[0];
  var lastData = data[data.length - 1];
  var dimensions = dataRecordingContainer.getDimensions(selectedDataId);

  var timestamps = dataRecordingContainer.getDataTimestamps(selectedDataId);
  var endTimestamp = Date.now() - MINIMUM_DATA_AGE - timestampOffset;
  var startTimestamp = endTimestamp - CHART_PLOT_DURATION;
  var duration = endTimestamp - startTimestamp;
  var delays = timestamps.map((timestamp) => timestamp - endTimestamp);

  var xValues = [];
  var yValues = [];
  for (var dimension = 0; dimension < dimensions; dimension++) {
    var valuesInDimenion = dataRecordingContainer.getDataValuesInDimension(
      selectedDataId,
      dimension
    );
    xValues.push(delays);
    yValues.push(valuesInDimenion);
  }

  var dataUpdate = {
    x: xValues,
    y: yValues,
  };

  if (recreateChartPlot) {
    createChartPlot(container, dimensions);
  } else {
    Plotly.restyle(container, dataUpdate);
    Plotly.relayout(container, createChartPlotLayout(dimensions, duration));
  }
}

class DataRecordingContainer {
  constructor() {
    this.dataRecordings = {};
  }

  get dataRecordings() {
    return this._dataRecordings;
  }

  set dataRecordings(dataRecordings) {
    this._dataRecordings = dataRecordings;
  }

  resetRecordings() {
    this._dataRecordings = {};
  }

  getRecordings() {
    return this._dataRecordings;
  }

  getIds() {
    return Object.keys(this.dataRecordings);
  }

  getData(id) {
    if (!(id in this.dataRecordings)) {
      this.dataRecordings[id] = [];
    }
    return this.dataRecordings[id];
  }

  setData(id, data) {
    this.dataRecordings[id] = data;
  }

  addData(id, data) {
    this.setData(id, this.getData(id).concat(data));
  }

  addDataRecording(dataRecording) {
    this.addData(dataRecording.dataId, dataRecording.dataList);
  }

  getDataValuesInDimension(id, dimension) {
    var values = [];
    var maximumAggregationTimestamp =
      Date.now() - MINIMUM_DATA_AGE - timestampOffset;
    this.getData(id)
      .filter((data) => data.aggregationTimestamp < maximumAggregationTimestamp)
      .forEach((data) => {
        var value;

        if (data.hasOwnProperty("value")) {
          value = data.value;
        } else {
          var firstValue = data.values[0];
          if (firstValue instanceof Array) {
            value = firstValue[dimension];
          } else {
            value = data.values[dimension];
          }
        }

        values.push(value);
      });
    return values;
  }

  getDataTimestamps(id) {
    var timestamps = [];
    var maximumAggregationTimestamp =
      Date.now() - MINIMUM_DATA_AGE - timestampOffset;
    this.getData(id)
      .filter((data) => data.aggregationTimestamp < maximumAggregationTimestamp)
      .forEach((data) => timestamps.push(data.aggregationTimestamp));
    return timestamps;
  }

  getDimensions(id) {
    var data = this.getData(id);
    if (data.length == 0) {
      return 0;
    }
    var firstData = data[0];
    if (firstData.hasOwnProperty("value")) {
      return 1;
    } else {
      var firstValue = firstData.values[0];
      if (firstValue instanceof Array) {
        return firstData.values.length * firstValue.length;
      } else {
        return firstData.values.length;
      }
    }
  }

  trim() {
    var minimumAggregationTimestamp =
      Date.now() - MAXIMUM_DATA_AGE - timestampOffset;
    this.getIds().forEach(function (id) {
      var trimmedData = this.getData(id);

      // trim based on count
      if (trimmedData.length > MAXIMUM_DATA_COUNT) {
        trimmedData = trimmedData.slice(-MAXIMUM_DATA_COUNT);
      }

      // trim based on age
      trimmedData = trimmedData.filter(
        (data) => data.aggregationTimestamp >= minimumAggregationTimestamp
      );

      // restore minimum count of data
      if (trimmedData.length < MINIMUM_DATA_COUNT) {
        trimmedData = this.getData(id).slice(-MINIMUM_DATA_COUNT);
      }

      this.setData(id, trimmedData);
    }, this);
  }

  static getReadableId(id) {
    var readableId = id.substring(id.lastIndexOf(".") + 1);
    readableId = readableId.replace("Rx", "");
    readableId = readableId.replace("Data", "");
    readableId = readableId.replace(/([A-Z])/g, " $1").trim(); // add spaces before capital letters
    return readableId;
  }
}

function changeUser(chartPlotContainer) {
  var dimensions = dataRecordingContainer.getDimensions(selectedDataId);

  createChartPlot(chartPlotContainer, dimensions);
  updateChartPlot(chartPlotContainer);
}

function toggleRendering() {
  const btn = document.getElementById("renderBtn");

  if (renderInterval) {
    clearInterval(renderInterval);
    renderInterval = null;
    btn.innerHTML = "Resume";

    return;
  }

  startInterval();
  btn.innerHTML = "Pause";
}

function resetChart() {
  dataRecordingContainer.resetRecordings();
}

function resetScreenshot() {
  const imgContainer = document.getElementById(STACKED_CONTAINER);
  imgContainer.innerHTML = "";
}

function reset(graphDiv) {
  Plotly.deleteTraces(graphDiv, [0, 1, 2]);
}

function startInterval() {
  renderInterval = window.setInterval(render, RENDERING_INTERVAL);
}

$(() => {
  initialize();

  startInterval();
});
