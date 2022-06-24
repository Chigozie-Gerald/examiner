import React, { PureComponent } from 'react';
import './questionLink.css';

class QuestionLink extends PureComponent {
  render() {
    const { data, handleDel, handleEdit, total } = this.props;
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
            <div className="qlIcon center">
              <i
                className="material-icons edit"
                onClick={() =>
                  handleEdit(data, total - this.props.number)
                }
              ></i>
            </div>
            <div className="qlIcon center">
              <i
                className="material-icons close"
                onClick={() => handleDel(total - this.props.number)}
              ></i>
            </div>
          </div>
        </div>
        <div className="qlText">{data.title}</div>
        <div className="qlBot ellipsis">{data.details}</div>
      </div>
    );
  }
}

export default QuestionLink;
