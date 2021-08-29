import React, { PureComponent } from 'react';
import QuestionTitle from '../create/questionTitle';
import './map.css';

class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
  }
  state = {
    show: false,
  };
  handleShow = (e) => {
    e.stopPropagation();
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <div className="map_wrap w100">
        <div
          onClick={this.handleShow}
          className={`map_float ${!this.state.show ? '' : 'noShow'}`}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="map_float_box"
          >
            <div className="map_float_head">
              <div
                onClick={this.handleShow}
                className="map_float_icon"
              ></div>
            </div>
          </div>
        </div>
        <div className="map_box">
          <div className="map_left">
            {['Latitude', 'Longitude'].map((data) => (
              <div className="map_div">
                {[
                  {
                    title: `From ${data}`,
                    holder: `Type upper boundary of ${data}`,
                  },
                  {
                    title: `To ${data}`,
                    holder: `Type lower boundary of ${data}`,
                  },
                ].map((data) => (
                  <QuestionTitle
                    data={{
                      hasInput: true,
                      title: data.title,
                      title_size: `sm`,
                      placeholder: data.holder,
                      label: ``,
                    }}
                  />
                ))}
              </div>
            ))}
            <button onClick={this.handleShow} className="btn w100">
              Run Model
            </button>
          </div>
          <div className="map_right"></div>
        </div>
      </div>
    );
  }
}

export default Map;
