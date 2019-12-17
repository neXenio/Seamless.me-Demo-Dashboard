import React from 'react';
import seamlessLogo from '../assets/seamless.me-logo.svg';
import nexenioLogo from '../assets/nexenio-logo.png';

const Logo = () => {
  return (
    <div className="row">
      <div className="col s6 m6 l4 offset-s0 offset-m0 offset-l2 left-align">
        <img className="header-logo" alt="Logo" src={seamlessLogo} />
      </div>
      <div className="col s6 m6 l4 offset-s0 offset-m0 offset-l0 right-align">
        <img className="header-logo" alt="Logo" src={nexenioLogo} />
      </div>
    </div>
  );
}

export default Logo;
