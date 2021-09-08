import React, { PureComponent } from 'react';
import QuestionTitle from '../create/questionTitle';
import './map.css';
import scriptLoader from 'react-async-script-loader';

class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.map = null;
  }
  state = {
    show: false,
  };
  handleShow = (e) => {
    e.stopPropagation();
    this.setState({ show: !this.state.show });
  };

  componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      // load finished
      if (isScriptLoadSucceed) {
        this.map = new window.google.maps.Map(
          document.getElementById('map'),
          {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
          },
        );
        const drawingManager =
          new window.google.maps.drawing.DrawingManager({
            drawingMode:
              window.google.maps.drawing.OverlayType.MARKER,
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                window.google.maps.drawing.OverlayType.MARKER,
                window.google.maps.drawing.OverlayType.CIRCLE,
                window.google.maps.drawing.OverlayType.POLYGON,
                window.google.maps.drawing.OverlayType.POLYLINE,
                window.google.maps.drawing.OverlayType.RECTANGLE,
              ],
            },
            markerOptions: {
              icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            },
            circleOptions: {
              fillColor: '#ffff00',
              fillOpacity: 1,
              strokeWeight: 5,
              clickable: false,
              editable: true,
              zIndex: 1,
            },
          });
        drawingManager.setMap(this.map);
      } else {
        console.log(`ifnsksf`);
        this.props.onError();
      }
    } else {
      console.log(`Still loading`);
    }
  }

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
          <div useRef="map" id="map" className="map_right">
            {!this.map && <div className="center">Loading...</div>}
          </div>
        </div>
      </div>
    );
  }
}

export default scriptLoader([
  'https://polyfill.io/v3/polyfill.min.js?features=default',
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyB2kQCbfbKCfO8_PNgyNj0zIZOKe2DG-hI&libraries=drawing',
])(Map);
