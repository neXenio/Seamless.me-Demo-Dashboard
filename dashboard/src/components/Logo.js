import React from 'react';

const Logo = () => {
  return (
    <div className="row">
      <div className="col s6 m6 l4 offset-s0 offset-m0 offset-l2 left-align">
        <img className="header-logo" alt="Logo" src={require("../assets/seamless.me-logo.svg")} />
      </div>
      <div className="col s6 m6 l4 offset-s0 offset-m0 offset-l0 right-align">
        <img className="header-logo" alt="Logo" src={require("../assets/nexenio-logo.png")} />
      </div>
    </div>
  );
}


export default Logo;
