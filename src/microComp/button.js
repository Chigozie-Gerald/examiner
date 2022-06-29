import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import './button.css';
import { makeRipple } from './ripple';

class Button extends PureComponent {
  render() {
    return (
      <Link
        to={{ pathname: this.props.link || '/' }}
        className="Link inline auto"
      >
        <button onClick={(e) => makeRipple(e)} className="app_btn">
          {this.props.text}
        </button>
      </Link>
    );
  }
}

export default Button;
