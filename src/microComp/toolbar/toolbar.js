import React, { PureComponent } from 'react';
import InputField from '../inputField/inputField';
import './toolbar.css';

class Toolbar extends PureComponent {
  render() {
    return (
      <div
        className="toolbar_wrap"
        style={{ height: this.props.height }}
      >
        <InputField data={{ placeholder: 'Search for an Exam' }} />
        <div className="sideField"></div>
      </div>
    );
  }
}

export default Toolbar;
