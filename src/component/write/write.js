import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import './write.css';
import '../account/login.css';

class Write extends PureComponent {
  render() {
    const arr = ['#b6ffb5', '#eeeeee', '#fffad1'];
    return (
      <div className="examWrite_wrap">
        <div className="examWrite_header w100">
          <div className="content"></div>
          <Link
            to={{ pathname: '/' }}
            className="Link inline auto examLogin_link"
          >
            <button className="examLogin_btn">Home</button>
          </Link>
        </div>
        <div className="examWrite_body w100">
          <div className="examWrite_left">
            <div className="examWrite_left_box w100">
              <div className="examWrite_L_header"></div>
              <div className="examWrite_L_body">Question 4</div>
              <div className="examWrite_L_option"></div>
              <div className="examWrite_L_btn">
                <button className="examLogin_btn prev">
                  Previous
                </button>
                <button className="examLogin_btn next">Next</button>
              </div>
            </div>
          </div>
          <div className="examWrite_right">
            <div className="examWrite_right_box w100">
              <div className="examWrite_right_grid">
                {new Array(30).fill(0).map((a, n) => (
                  <div className="examWrite_right_grid_box">
                    <div
                      className="inner center"
                      style={{
                        backgroundColor:
                          arr[Math.floor(Math.random() * 3)],
                      }}
                    >
                      {n + 1}
                    </div>
                  </div>
                ))}
                <div className="float">2 more rows</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Write;
