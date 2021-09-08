import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { createQuestion } from '../../redux/create/create';
import NotFound from '../notFound';
import './create.css';
import CreateDetails from './createDetails';
import QuestionLink from './questionLink';
import QuestionTitle from './questionTitle';

class Create extends PureComponent {
  state = {
    tag: '',
    title: '',
    details: '',
    image: '',
    questions: [],
    errorText: '',
    editting: false,
  };
  //Select name, set max and duration, add questions
  handleErrorClear = () => {
    this.setState({ errorText: '' });
  };
  handleDel = (value) => {
    this.setState({
      questions: this.state.questions.filter(
        (data, n) => n !== value,
      ),
    });
  };
  handleEdit = (value, number) => {
    this.setState({
      title: value.title,
      details: value.details,
      image: value.image,
      editting: number,
    });
  };
  handleAdd = (value) => {
    if (typeof this.state.editting === `number`) {
      this.setState({
        questions: this.state.questions.map((data, n) => {
          if (value !== n) {
            return data;
          } else {
            return {
              tag: this.state.tag,
              title: this.state.title,
              details: this.state.details,
              image: this.state.image,
            };
          }
        }),
        editting: false,
        title: '',
        details: '',
        image: '',
      });
    } else {
      this.setState({
        questions: [
          ...this.state.questions,
          {
            tag: this.state.tag,
            title: this.state.title,
            details: this.state.details,
            image: this.state.image,
          },
        ],
        title: '',
        details: '',
        image: '',
      });
    }
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  componentDidMount = () => {
    const { history, location } = this.props;
    if (!location?.state?.tag) {
      history.replace('/tagList');
      return;
    }
    this.setState({ tag: this.props.location?.state?.tag || '' });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (
      this.state.questions.length > 0 ||
      (this.state.title && this.state.details && this.state.tag)
    ) {
      this.setState({ clicked: true }, () => {
        this.props.createQuestion(
          this.state.title && this.state.details && this.state.tag
            ? [
                ...this.state.questions,
                {
                  tag: this.state.tag,
                  title: this.state.title,
                  details: this.state.details,
                  image: this.state.image,
                },
              ]
            : this.state.questions,
        );
        //check for errors
        this.setState(
          {
            tag: '',
            title: '',
            details: '',
            image: '',
            questions: [],
            errorText: '',
            editting: false,
          },
          () => this.props.history.push('/tagList'),
        );
      });
    } else {
      return;
    }
  };
  render() {
    return (
      <div className="createWrap h100">
        <Switch>
          <Route
            exact
            path={`${this.props.match?.url}`}
            render={(props) => (
              <CreateQuestion
                {...props}
                data={{
                  tags: this.props.tags,
                  editting: this.state.editting,
                  questions: this.state.questions,
                  title: this.state.title,
                  details: this.state.details,
                  errorText: this.state.errorText,
                  handleEdit: this.handleEdit,
                  handleDel: this.handleDel,
                  handleErrorClear: this.handleErrorClear,
                  handleAdd: this.handleAdd,
                  handleSubmit: this.handleSubmit,
                  onChange: this.handleChange,
                }}
              />
            )}
          />
          <Route
            path={`${this.props.match?.url}/time`}
            render={(props) => <CreateDetails {...props} />}
          />
          <Route exact render={(props) => <NotFound {...props} />} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tags: state.loader.tags,
  QuestionError: state.loader.questionError,
  QuestionLoading: state.loader.questionLoading,
});

const mapDispatchToProps = (dispatch) => ({
  createQuestion: (body) => dispatch(createQuestion(body)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Create));

export class CreateQuestion extends PureComponent {
  state = {
    question: '',
  };
  render() {
    const {
      handleEdit,
      editting,
      onChange,
      handleDel,
      questions,
      title,
      details,
      handleSubmit,
      handleAdd,
      errorText,
      handleErrorClear,
    } = this.props.data;
    return (
      <div className="fdCol createQ">
        <div className="createTitle">
          <p>Add Questions</p>
          <button onClick={handleSubmit} className="btn">
            Finish
          </button>
        </div>
        <div className="createWrap_box">
          <div className="create_left">
            <div className="createInputWrap box">
              {typeof editting === 'number' && (
                <div className="notify_create center">Edit Mode</div>
              )}
              <div
                className={`floater tagger ${
                  errorText ? 'tag' : 'trans'
                }`}
              >
                <i
                  className="material-icons close"
                  onClick={handleErrorClear}
                ></i>
                {errorText}
              </div>
              <div className="createTitleFloat">
                {questions.length} question(s) added
              </div>
              <QuestionTitle
                data={{
                  onChange: onChange,
                  text: title,
                  hasInput: true,
                  title: 'Question',
                  autoFocus: true,
                  title_size: `md`,
                  name: 'title',
                  placeholder:
                    'Example: What is the Axillary Tail of Spence?',
                  label: `Kindly type a question that isn't ambiguous`,
                }}
              />
              <QuestionTitle
                data={{
                  hasInput: false,
                  title_size: `md`,
                  title: 'Body',
                  label: `This section is more or less the answer to the question written above`,
                }}
              />

              <textarea
                className="createInputField"
                type="text"
                name="details"
                id=""
                value={details}
                onChange={onChange}
              />

              <div className="createInputTop">
                <div className="createITLeft"></div>
                <button
                  disabled={!title || !details}
                  onClick={() => handleAdd(editting)}
                  className="createITRight btn"
                >
                  {typeof editting === `number`
                    ? `Edit Question`
                    : `Add Question`}
                </button>
              </div>
            </div>
          </div>
          <div className="create_right">
            <div className="box createRightBox">
              {questions.map(
                (data, n) =>
                  n < 5 && (
                    <QuestionLink
                      data={data}
                      handleDel={handleDel}
                      handleEdit={handleEdit}
                      key={`${n}_question_list`}
                      number={n + 1}
                    />
                  ),
              )}
              <div
                className={`box createRightBox sm ellipsis center ${
                  questions.length > 5 ? `` : `invis`
                }`}
              >
                View{' '}
                {questions.length > 5 ? questions.length - 5 : ``}{' '}
                more question(s)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
