import React, { PureComponent } from 'react';
import './toolStand.css';
import './toolbar_vert.css';

class ToolStand extends PureComponent {
  render() {
    const items = [
      [
        'Activities',
        {
          icon: true,
          color: '#29a833',
          leader: true,
          text: 'Running',
          foot: 'Enterprise',
        },
      ],
      [
        'Local',
        {
          icon: true,
          color: '#4f64a0',
          leader: false,
          text: 'Administrator',
          foot: 'Division I',
        },
        {
          icon: false,
          leader: false,
          text: 'Legacy Terms',
          active: true,
        },
        { icon: false, leader: false, text: 'Pass Scores' },
        {
          icon: false,
          leader: false,
          text: 'Outlook',
          notification: true,
        },
        {
          icon: false,
          leader: false,
          text: 'Performance',
          notification: true,
        },
        { icon: false, leader: false, text: 'Leaderboards' },
        { icon: false, leader: false, text: 'Listing' },
      ],
    ];
    return (
      <div
        className="toolbar_vert_wrap toolStand"
        style={{ height: `calc(100vh - ${this.props.height})` }}
      >
        <div className="toolStand_title">
          <h3>Lists</h3>
          <div className="toolStand_icon_wrap">
            {[1, 1, 1].map((a) => (
              <div className="toolStandIcon center">
                <div className="tsIcons"></div>
              </div>
            ))}
          </div>
        </div>
        {items.map((data) => (
          <ToolStandItems data={data} />
        ))}
      </div>
    );
  }
}

export default ToolStand;

export class ToolStandItems extends PureComponent {
  render() {
    return (
      <div className="toolStandItems">
        <div className="tsHeader">
          {Array.isArray(this.props.data) &&
            this.props.data.length > 0 &&
            typeof this.props.data[0] == `string` &&
            this.props.data[0]}
        </div>
        {this.props.data &&
          this.props.data.map(
            (data, n) =>
              n > 0 && (
                <div
                  className={`${data.leader ? `Lg` : ``} ${
                    data.icon && !data.leader ? `Md` : ``
                  } ${data.active ? `active` : ``} tsProps`}
                >
                  <div
                    className={`tsPropsIcon ${
                      !data.icon ? 'empty' : ``
                    } `}
                    style={{
                      backgroundColor: data.color && data.color,
                    }}
                  ></div>
                  {!data.leader && data.text ? (
                    <div
                      className={`${
                        data.notification ? `bold` : ``
                      }  tsPropsIconText`}
                    >
                      {data.text && data.text}
                    </div>
                  ) : (
                    <div className="tsPropsIconText">
                      <div className="tsPropsTop">
                        {data.text ? data.text : ``}
                      </div>
                      <div className="tsPropsBtm">
                        {data.foot ? data.foot : ``}
                      </div>
                    </div>
                  )}
                  <div
                    className={`tsPropsIcon ${
                      !data.icon ? 'empty' : ``
                    } `}
                  ></div>
                </div>
              ),
          )}
      </div>
    );
  }
}
