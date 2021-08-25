import React, { PureComponent } from 'react';
import './dashboard.css';
import Button from '../../microComp/button';
import Toolbar from '../../microComp/toolbar/toolbar';
import ToolbarVert from '../../microComp/toolbar/toolbar_vert';
import ToolStand from '../../microComp/toolbar/toolStand';
import { Link } from 'react-router-dom';

class Dashboard extends PureComponent {
  render() {
    return (
      <div>
        <Toolbar height={this.props.height || '3rem'} />
        <div
          className="dashbody w100"
          style={{ paddingTop: this.props.height }}
        >
          <ToolbarVert height={this.props.height || '3rem'} />
          <ToolStand height={this.props.height || '3rem'} />
          <div className="dashright">
            <div className="bodyTool w100">
              <div className="bodyTool_left"></div>
              <div className="bodyTool_right">
                <Link to="/create" className="bodyTool_btn center">
                  Create Exam
                </Link>
              </div>
            </div>
            {/**
         Upcoming
         N  N
         */}
            <Button text="To Login" link="/login" />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
