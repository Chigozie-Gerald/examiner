import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import './select.css';

class Select extends PureComponent {
  state = {
    open: false,
  };
  handleOpen = () => {
    this.setState({ open: !this.state.open });
  };
  render() {
    if (!this.props.data || !Array.isArray(this.props.data?.data)) {
      this.props.history.replace(`/tagList`);
    }
    const { selected, func, holder, data } = this.props.data;
    return (
      <div className="selectWrap">
        <div
          onClick={this.handleOpen}
          className={`selectBox head ellipsis ${
            selected ? 'bold' : ''
          }`}
        >
          {selected ? selected.name : holder}
        </div>
        <div
          className={`selectBox_float_box scroller ${
            this.state.open ? 'open' : ''
          }`}
        >
          {data.map((item, n) => (
            <div
              onClick={() => func(item._id)}
              key={`select${n}`}
              className={`selectBox_float ellipsis ${
                selected._id === item._id ? 'chosen' : ''
              }`}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(Select);
