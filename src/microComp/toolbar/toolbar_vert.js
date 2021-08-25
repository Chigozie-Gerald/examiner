import React, { PureComponent } from 'react';
import './toolbar_vert.css';

class ToolbarVert extends PureComponent {
  render() {
    const sets = [
      { text: 'Tools', active: false },
      { text: 'History', active: false },
      { text: 'Results', active: false },
      { text: 'Lists', active: true },
    ];
    return (
      <div
        className="toolbar_vert_wrap"
        style={{ height: `calc(100vh - ${this.props.height})` }}
      >
        <ul className="w100">
          {sets.map((data) => (
            <li className="center">
              {data.active && <Bar />}
              <div className="icon_wrap fdCol">
                <div
                  className={`icon ${data.active ? 'active' : ''}`}
                ></div>
                <div
                  className={`icon_text ${
                    data.active ? 'active' : ''
                  }`}
                >
                  {data.text}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="toolbar_action">
          <ul className="w100 low">
            <li className="center">
              <div className="icon_wrap fdCol">
                <div className="icon"></div>
                <div className="icon_text">Settings</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ToolbarVert;

export class Bar extends PureComponent {
  render() {
    return <div className="bar"></div>;
  }
}
