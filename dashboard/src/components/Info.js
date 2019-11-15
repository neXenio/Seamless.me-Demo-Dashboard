import React from 'react';
import { Button, Modal, Row, Col, Card, Select } from 'react-materialize';


const Info = (props) => {

  return (
    <Row>
      <Col m={6} s={12} l={4} offset="s0, m0, l0">
         <Card
          className="card-content"
          textClassName="dark-text"
          title="Seamless.me Demo"
          actions={[<a href="https://github.com/neXenio/BAuth-Demo-Dashboard" target="_blank" className="indigo-text" key="infoCard">GitHub Repo</a>]}>
          This is a simple tool to visualize data aggregated by the Seamless.me app in real-time.
          <br/>
          <br/>
          Keep in mind that only demo builds of the Seamless.me app can be configured to stream data to the demo server.
          <br/>
        </Card>
      </Col>
    </Row>
  );
}


export default Info;
