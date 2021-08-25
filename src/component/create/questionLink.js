import React, { PureComponent } from 'react';
import './questionLink.css';

class QuestionLink extends PureComponent {
  render() {
    return !this.props.data ? (
      <div className="questionLink_wrap w100 more center">
        More Questions
      </div>
    ) : (
      <div className="questionLink_wrap w100">
        <div className="qlTop w100">
          <div className="qlFloat floater">
            Question {this.props.number}
          </div>
          <div className="qlBtn">
            <div className="qlIcon"></div>
            <div className="qlIcon"></div>
          </div>
        </div>
        <div className="qlText">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Nostrum magni saepe soluta officia cupiditate.
        </div>
        <div className="qlBot">4 options</div>
      </div>
    );
  }
}

export default QuestionLink;
