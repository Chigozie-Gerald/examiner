import React, { PureComponent } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import NotFound from '../notFound';
import './create.css';
import CreateDetails from './createDetails';
import QuestionLink from './questionLink';
import QuestionTitle from './questionTitle';

class Create extends PureComponent {
  state = {
    question: ``,
    /*name: true,
    group_id,
    avg_duration,
    max_question,
    max_count,
    author1_id,
    category,
    section,
    expiresAt,
    opensAt,
    author_id,
    questions: [
      { question, option, answer, essay, time, start, stop },
    ],*/
  };
  //Select name, set max and duration, add questions
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  render() {
    console.log(this.props.match?.url);
    return (
      <div className="createWrap h100">
        <Switch>
          <Route
            exact
            path={`${this.props.match?.url}`}
            render={(props) => <CreateDetails {...props} />}
          />
          <Route
            path={`${this.props.match?.url}/questions`}
            render={(props) => <CreateQuestion {...props} />}
          />
          <Route exact render={(props) => <NotFound {...props} />} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Create);

export class CreateQuestion extends PureComponent {
  state = {
    question: ``,
  };
  render() {
    return (
      <div className="fdCol createQ">
        <div className="createTitle">
          <p>Add Questions</p>
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
                <button
                  onClick={() =>
                    this.props.history
                      ? this.props.history.push(`/`)
                      : true
                  }
                  className="createITRight"
                >
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
