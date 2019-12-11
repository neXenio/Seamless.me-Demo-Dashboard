import React from 'react';
import { Col, Select } from 'react-materialize';

const Option = (props) => {
  return (
    <option value={props.deviceID}>
      {props.deviceName}
    </option>
  );
}

const Device = (props) => {

  return (
    <Col m={6} s={12} l={8} offset="s0, m0, l2">
      <h2>Welcome</h2>
      Select a device and the type of data you want to visualize.
        <br />
      <Select id="deviceIdSelect" onChange={props.handleDeviceChange}>
        <option disabled defaultValue>
          Select a device
          </option>
        {props.deviceList.map(device =>
          <Option deviceID={device.id}
            deviceName={device.name}
            key={device.id} />)}
      </Select>

      {props.showDataIdSelect &&
        <Select id="dataIdSelect" onChange={props.handleDataChange}>
          <option disabled defaultValue>
            Gravity Sensor
          </option>
          {props.dataList.map(data =>
            <Option deviceID={data.id}
              deviceName={data.optionText}
              key={data.id} />)}
        </Select>
      }
    </Col>
  );
}


export default Device;
