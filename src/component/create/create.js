import React, { PureComponent } from 'react';
import Button from '../../microComp/button';
import './create.css';
import QuestionLink from './questionLink';
import QuestionTitle from './questionTitle';

class Create extends PureComponent {
  state = {
    question: ``,
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    return (
      <div className="createWrap">
        <div className="createTitle">
          <p>Create Exam</p>
          <div className="createbtn">
            <Button text="To dashboard" link="/dashboard" />
          </div>
        </div>
        <div className="createWrap_box">
          <div className="create_left">
            <div className="createInputWrap box">
              <div className="createTitleFloat">
                2 questions added
              </div>
              <QuestionTitle
                data={{
                  hasInput: true,
                  title: 'Title',
                  placeholder: 'Example: Head and Neck Anatomy Test',
                  label: `Suggest a title for the exam you're about creating`,
                }}
              />
              <QuestionTitle
                data={{
                  hasInput: false,
                  title: 'Body',
                  label: `Type your question and click on "Add Question" button to add a new question`,
                }}
              />
              <div className="createInputTop">
                <div className="createITLeft"></div>
                <button className="createITRight">
                  Add Question
                </button>
              </div>
              <textarea
                className="createInputField"
                type="text"
                name="question"
                id=""
                value={this.state.question}
                onChange={this.handleChange}
              />
              <QuestionTitle
                data={{
                  hasInput: true,
                  title: 'Options',
                  placeholder: 'Example: Head and Neck Anatomy Test',
                  label: `Add at least two options to your question`,
                }}
              />
            </div>
          </div>
          <div className="create_right">
            <div className="box createRightBox first">
              <div className="top"></div>
              <div className="bottom">
                <ul>
                  <li>Publish easy questions </li>
                  <li>Enable group discussions </li>
                  <li>Learn to answer questions</li>
                </ul>
              </div>
            </div>
            <div className="box createRightBox">
              {[1, 2, 2, null].map((a, n) => (
                <QuestionLink
                  key={`${n}_question_list`}
                  number={n + 1}
                  data={a}
                />
              ))}
            </div>
            <div className="box createRightNext"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;
