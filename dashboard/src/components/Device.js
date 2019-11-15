import React from 'react';
import { Button, Modal, Icon, Row, Col, Card, Collapsible, CollapsibleItem, Select } from 'react-materialize';

 const Option = (props) => {
   return (
     <option value={props.deviceID}>
        {props.deviceName}
     </option>
   );
 }

const Device = (props) => {

  return (
    <Col m={6} s={12} l={4} offset="s0, m0, l2">
      <Card textClassName="dark-text" title="Select a Devices">
        Select a device and the type of data you want to visualize.
        <br/>
        <Select id="deviceIdSelect" onChange={props.handleDeviceChange}>
          <option disabled defaultValue>
            Select a device
          </option>
          {props.deviceList.map(device =>
            <Option deviceID={device.id}
                    deviceName={device.name}
                    key={device.id}/> )}
        </Select>

        <Select id="dataIdSelect" onChange={props.handleDataChange}>
          <option disabled defaultValue>
            Select a data type
          </option>
          {props.dataList.map(data =>
            <Option deviceID={data.id}
                    deviceName={data.optionText}
                    key={data.id}/> )}
        </Select>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </Card>
    </Col>
  );
}


export default Device;
