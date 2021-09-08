import React, { PureComponent } from 'react';
import './time.css';

class Time extends PureComponent {
  state = {
    timeTag: 'am',
    hour: 0,
    min: 0,
  };
  handleChange = (e) => {
    console.log(e.target.name);
    this.setState({ [e.target.name]: e.target.value });
  };
  handleTag = (tag) => {
    console.log(`changig`, tag, this.state.timeTag);
    this.setState({ timeTag: tag });
  };
  render() {
    return (
      <div className="time_wrap">
        {[
          { label: 'Hour', max: '12', min: '0' },
          { label: 'Min', max: '59', min: '0' },
        ].map((data, n) => (
          <div className="time_inner" key={`time_label_${n}_key`}>
            <label
              htmlFor={`time${data.label}`}
              className="time_label"
            >
              {data.label}
            </label>
            <input
              type="number"
              onChange={this.handleChange}
              value={this.state[data.label.toLowerCase()]}
              name={data.label.toLowerCase()}
              max={data.max.toString()}
              min={data.min.toString()}
              id={`time${data.label}`}
              className="time_input"
            />
          </div>
        ))}
        <div className="time_div_wrap">
          {[{ tag: 'am' }, { tag: 'pm' }].map((data, n) => (
            <div
              onClick={() => this.handleTag(data.tag)}
              className={`time_sect center ${
                data.tag === this.state.timeTag ? 'active' : ''
              }`}
              key={`time_div_key_${n}`}
            >
              {data.tag}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Time;
