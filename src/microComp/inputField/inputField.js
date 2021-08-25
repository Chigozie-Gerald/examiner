import React, { PureComponent } from 'react';
import './inputField.css';

class InputField extends PureComponent {
  render() {
    return (
      <input
        type="text"
        name="tSearch"
        className="toolSearch"
        placeholder={this.props.data?.placeholder}
        id={this.props.data?.id}
      />
    );
  }
}

export default InputField;
