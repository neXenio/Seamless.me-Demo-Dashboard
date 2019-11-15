import React from 'react';
import Visualization from './Visualization.js';
import { Col, Modal, Button, Icon } from 'react-materialize';

const ModalView = () => {
  return (
    <Col m={6} s={12} l={4} offset="s0, m0, l0">
    <Modal header="Compared data streams"
           trigger={<Button
           floating
           large
           className="red"
           waves="light"
           icon={<Icon>compare</Icon>}/> }>
      <Visualization />
    </Modal>
    </Col>
  );
}


export default ModalView;
