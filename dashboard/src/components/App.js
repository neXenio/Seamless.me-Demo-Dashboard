/*
 * Seamless.me Demo Dashboard
 * Read more on GitHub: https://github.com/neXenio/BAuth-Demo-Dashboard
*/

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Row, Button, Icon, Modal, Col } from 'react-materialize';
import M from "materialize-css";
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';

// COMPONENTS
import Logo from './Logo.js';
// import Info from './Info.js';
import Device from './Device.js';
import Visualization from './Visualization.js';
import DataRecordingContainer from './DataRecordingContainer.js';

// SOCKET
const BAUTH_DEMO_SERVER = 'https://bauth-demo-server--steppschuh.repl.co/';
const MESSAGE_INITIALIZE_DEVICE = 'initialize_device';
const MESSAGE_INITIALIZE_DASHBOARD = 'initialize_dashboard';
const MESSAGE_DATA_RECORDING = 'data_recording';
const DELAY_LIMIT = 1000;

let socket;
let selectedDevice;


function App() {

  // const [statusText, updateStatusText] = useState('');
  const [timestampOffset, updateTimestampOffset] = useState(0);
  const [connectedDevices, updateConnectedDeviceList] = useState([]);
  const [dataList, updateDataList] = useState([]);
  const [dataRecordingContainer, updateDataRecordingContainer] = useState(new DataRecordingContainer());
  const [selectedDataId, updateSelectedDataId] = useState();


  useEffect(() => {
    setupSocket();
    // eslint-disable-next-line
  }, [])

  // ESTABLISH CONNECTION
  function setupSocket() {

    socket = io(BAUTH_DEMO_SERVER);

    socket.on('connect', function () {
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

    socket.on('message', function (message) {
      try {
        if (typeof message === 'string') {
          message = JSON.parse(message);
        }

        let key = message.key;
        let data = message.data;

        switch (key) {
          case MESSAGE_INITIALIZE_DEVICE:
            processDeviceInitialization(data);
            break;
          case MESSAGE_DATA_RECORDING:
            processDataRecordingContainer(data);
            break;
          default:
            console.log('Unknown message key: ' + key);
        }
      } catch (error) {
        console.log('Unable to handle message:\n' + JSON.stringify(message));
        console.error(error);
      }
    });
  }


  // DEVICE + DATA INITIALIZATION
  function processDeviceInitialization(device) {
    if (!connectedDevices.some(connectedDevice => connectedDevice.id === device.id)) {
      console.log('Device initialization received: ' + JSON.stringify(device));
      onDeviceWithNewIdConnected(device);
    }
  }

  function processDataRecordingContainer(partialDataRecordingContainer) {
    if (typeof selectedDevice === 'undefined' || partialDataRecordingContainer.deviceInfo.id !== selectedDevice.id) {
      // console.log('Not processing data recording container from: ' + partialDataRecordingContainer.deviceInfo.id);
      return;
    }

    let delay = Date.now() - partialDataRecordingContainer.endTimestamp;
    updateTimestampOffset((oldTimestampOffset) => {
      if (Math.abs(oldTimestampOffset - delay) > DELAY_LIMIT) {
        console.log("Updated timestamp offset to " + (delay - DELAY_LIMIT));
        return delay - DELAY_LIMIT;
      }
      return oldTimestampOffset;
    });


    // updateStatusText('Processing partial data recording with ' + delay + 'ms delay');

    partialDataRecordingContainer.recordings.forEach(function (dataRecording) {
      if (dataRecordingContainer.getData(dataRecording.dataId).length === 0) {
        onDataWithNewIdReceived(dataRecording.dataId);
      }
      dataRecordingContainer.addDataRecording(dataRecording);
    });
    dataRecordingContainer.trim();
  }

  function onDeviceWithNewIdConnected(device) {

    // update the connected devices array, place the new device first
    updateConnectedDeviceList((oldConnectedDeviceList) => {

      const connectionStatus = !oldConnectedDeviceList.some(oldDevice => oldDevice.id === device.id);

      if (connectionStatus) {
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

    let ids = dataRecordingContainer.getIds().sort();

    updateDataList([]);

    // append available IDs as options
    ids.forEach(id => {
      let optionText = DataRecordingContainer.getReadableId(id);

      updateDataList((oldDataList) => {
        return [...oldDataList, {
          id,
          optionText
        }];
      });
    });
  }


  // HANDLE SELECT-CHANGE
  function handleDeviceChange(event) {

    setupSocket();

    let selectedDeviceId = event.target.value;
    selectedDevice = connectedDevices.find(connectedDevice => connectedDevice.id === selectedDeviceId);
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
        <Col m={6} s={12} l={4} offset="s0, m0, l2">
          <Modal
            actions={[
              <Button flat modal="close" node="button" waves="green">Close</Button>
            ]}
            bottomSheet={false}
            fixedFooter={false}
            id="modal-0"
            options={{
              dismissible: true,
              endingTop: '10%',
              inDuration: 250,
              onCloseEnd: null,
              onCloseStart: null,
              onOpenEnd: null,
              onOpenStart: null,
              opacity: 0.5,
              outDuration: 250,
              preventScrolling: true,
              startingTop: '4%'
            }}
            trigger={
              <Button
                node="button"
                className="green"
                floating
                icon={<Icon>add</Icon>}
                large
                node="button"
                waves="light"
              />}
          >
            <Device deviceList={connectedDevices} dataList={dataList} handleDeviceChange={handleDeviceChange} handleDataChange={handleDataChange} />
          </Modal>
        </Col>
        <Row>
          <Visualization dataRecordingContainer={dataRecordingContainer} selectedDataId={selectedDataId} timestampOffset={timestampOffset} /* statusText={statusText} */ />
        </Row>
        <Row>
          {/* <Info /> */}
        </Row>
      </div>
    </div>
  );
}



export default App;
