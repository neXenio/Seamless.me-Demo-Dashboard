/*
 * Seamless.me Demo Dashboard
 * Read more on GitHub: https://github.com/neXenio/BAuth-Demo-Dashboard
 */

import React, {
  useEffect,
  useState
} from 'react';
import io from 'socket.io-client';
import M from '../materialize/materialize.js';
import '../materialize/materialize.min.css';
import './App.css';
import {
  Row
} from 'react-materialize';
import Logo from './Logo.js';
import Info from './Info.js';
import Device from './Device.js';
import Visualization from './Visualization.js';

// SOCKET
const BAUTH_DEMO_SERVER = 'https://bauth-demo-server--steppschuh.repl.co/';
const MESSAGE_INITIALIZE_DEVICE = 'initialize_device';
const MESSAGE_INITIALIZE_DASHBOARD = 'initialize_dashboard';
const MESSAGE_DATA_RECORDING = 'data_recording';

// CHART
const CHART_PLOT_DURATION = 30 * 1000;
const MINIMUM_DATA_AGE = 500;
const MAXIMUM_DATA_AGE = CHART_PLOT_DURATION + (2 * MINIMUM_DATA_AGE);
const MINIMUM_DATA_COUNT = 1;
const MAXIMUM_DATA_COUNT = 5000;

var socket;
var selectedDevice;
var timestampOffset = 0;
var connectionStatus = false;


function App() {

  const [connectedDevices, updateConnectedDeviceList] = useState([]);
  const [dataList, updateDataList] = useState([]);
  const [dataRecordingContainer, updateDataRecordingContainer] = useState(new DataRecordingContainer());
  const [selectedDataId, updateSelectedDataId] = useState('');


  useEffect(() => {
    setupSocket();
  }, [])

  // ESTABLISH CONNECTION
  function setupSocket() {

    socket = io(BAUTH_DEMO_SERVER);

    socket.on('connect', function() {
      console.log('Connected to the Demo Server');
      M.toast({
        html: 'Connected to the Demo Server'
      });
      socket.send({
        key: MESSAGE_INITIALIZE_DASHBOARD,
        data: {
          name: 'Seamless.me'
        }
      });
    });

    socket.on('message', function(message) {
      try {
        if (typeof message === 'string') {
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
            console.log('Unknown message key: ' + key);
            break;
        }
      } catch (error) {
        console.log('Unable to handle message:\n' + JSON.stringify(message));
        console.error(error);
      }
    });
  }


  // DEVICE + DATA INITIALIZATION
  function processDeviceInitialization(device) {
    if (connectedDevices.filter(connectedDevice => connectedDevice.id == device.id).length == 0) {
      console.log('Device initialization received: ' + JSON.stringify(device));
      onDeviceWithNewIdConnected(device);
    }
  }

  function processDataRecordingContainer(partialDataRecordingContainer) {
    if (typeof selectedDevice === 'undefined' || partialDataRecordingContainer.deviceInfo.id !== selectedDevice.id) {
      // console.log('Not processing data recording container from: ' + partialDataRecordingContainer.deviceInfo.id);
      return;
    }

    var delay = Date.now() - partialDataRecordingContainer.endTimestamp;
    if (Math.abs(timestampOffset - delay) > 1000) {
      timestampOffset = delay - 1000;
      console.log("Updated timestamp offset to " + timestampOffset);
    }

    // updateStatusText('Processing partial data recording with ' + delay + 'ms delay')

    partialDataRecordingContainer.recordings.forEach(function(dataRecording) {
      if (dataRecordingContainer.getData(dataRecording.dataId).length == 0) {
        onDataWithNewIdReceived(dataRecording.dataId);
      }
      dataRecordingContainer.addDataRecording(dataRecording);
    });
    dataRecordingContainer.trim();
  }

  function onDeviceWithNewIdConnected(device) {

    // update the connected devices array, place the new device first
    updateConnectedDeviceList((oldConnectedDeviceList) => {
      var connectionStatus = true;

      oldConnectedDeviceList.forEach(function(oldDevice) {
        if (oldDevice.id == device.id) {
          connectionStatus = false;
        }
      });

      if (connectionStatus == true) {
        M.toast({
          html: device.name + ' connected'
        });
        return oldConnectedDeviceList.concat(device);
      } else {
        return oldConnectedDeviceList;
      }
    });
  }

  function onDataWithNewIdReceived(id) {

    // first recording of data with that ID
    console.log('Received first recording of data with ID: ' + id);

    var ids = dataRecordingContainer.getIds().sort();
    var optionText = DataRecordingContainer.getReadableId(id);

    updateDataList([]);

    // append available IDs as options
    ids.forEach(id => {
      var optionValue = id;
      var optionText = DataRecordingContainer.getReadableId(id);

      updateDataList((oldDataList) => {
        return oldDataList.concat({
          id: optionValue,
          optionText: optionText
        });
      });
    });
  }


  // HANDLE SELECT-CHANGE
  function handleDeviceChange(event) {

    setupSocket();

    var selectedDeviceId = event.target.value;
    selectedDevice = connectedDevices.filter(connectedDevice => connectedDevice.id == selectedDeviceId)[0];
    console.log('Selected device changed: ' + JSON.stringify(selectedDevice));
    updateDataRecordingContainer(new DataRecordingContainer());
  }

  function handleDataChange(event) {

    updateSelectedDataId(event.target.value);
    console.log('Selected data ID changed: ' + event.target.value);
  }

  return (
    <div className="section">
    <Logo />
      <div className="row">
        <Visualization dataRecordingContainer={dataRecordingContainer} selectedDataId={selectedDataId} />
        <Row>
          <Device deviceList={connectedDevices} dataList={dataList} handleDeviceChange={handleDeviceChange} handleDataChange={handleDataChange} />
          <Info />
        </Row>
      </div>
    </div>
  );
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
    var maximumAggregationTimestamp = Date.now() - MINIMUM_DATA_AGE - timestampOffset;
    this.getData(id)
      .filter(data => data.aggregationTimestamp < maximumAggregationTimestamp)
      .forEach(data => {
        var value;

        if (data.hasOwnProperty('value')) {
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
    var maximumAggregationTimestamp = Date.now() - MINIMUM_DATA_AGE - timestampOffset;
    this.getData(id)
      .filter(data => data.aggregationTimestamp < maximumAggregationTimestamp)
      .forEach(data => timestamps.push(data.aggregationTimestamp));
    return timestamps;
  }

  getDimensions(id) {
    var data = this.getData(id);
    if (data.length == 0) {
      return 0;
    }
    var firstData = data[0];
    if (firstData.hasOwnProperty('value')) {
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
    var minimumAggregationTimestamp = Date.now() - MAXIMUM_DATA_AGE - timestampOffset;
    this.getIds().forEach(function(id) {
      var trimmedData = this.getData(id);

      // trim based on count
      if (trimmedData.length > MAXIMUM_DATA_COUNT) {
        trimmedData = trimmedData.slice(-MAXIMUM_DATA_COUNT);
      }

      // trim based on age
      trimmedData = trimmedData.filter(
        data => data.aggregationTimestamp >= minimumAggregationTimestamp
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
    readableId = readableId.replace('Rx', '');
    readableId = readableId.replace('Data', '');
    readableId = readableId.replace(/([A-Z])/g, ' $1').trim() // add spaces before capital letters
    return readableId;
  }

}


export default App;
