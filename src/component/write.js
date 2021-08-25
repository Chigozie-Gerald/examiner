import React, { PureComponent } from 'react';
import Button from '../microComp/button';

class write extends PureComponent {
  render() {
    return (
      <div>
        <h1>Write</h1>
        <Button text="To Home" link="/" />
      </div>
    );
  }
}

export default write;
