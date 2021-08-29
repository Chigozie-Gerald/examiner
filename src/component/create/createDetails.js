import React, { PureComponent } from 'react';
import './createDetails.css';
import '../account/login.css';
import QuestionTitle from './questionTitle';
import Time from './time';

class CreateDetails extends PureComponent {
  /*
    avg_duration,
    max_question,
    max_count,
    category,
    section,
    expiresAt,
    opensAt,
    questions: [
      { question, option, answer, essay, time, start, stop },
    ],*/
  render() {
    return (
      <div className="cD_wrap">
        <div className="cD_box fdCol">
          <div className="cD_body">
            <QuestionTitle
              data={{
                hasInput: true,
                title: 'Name of Exam',
                title_size: 'md',
                placeholder:
                  'Keep it simple! (Example: Head and Neck Anatomy Test)',
              }}
            />
            <div className="cD_duration">
              <Time />
              <div className="cD_duration_bord_wrap">
                <div className="cD_duration_bord"></div>
                <div className="cD_duration_bord">
                  <div className="circleFloat"></div>
                  <div className="circleFloat"></div>
                </div>
              </div>
              <Time />
            </div>
          </div>
          <div className="cD_btn">
            <button
              onClick={() =>
                this.props.history
                  ? this.props.history.push(
                      `${this.props.location?.pathname}/questions`,
                    )
                  : true
              }
              className="examLogin_btn w100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateDetails;
