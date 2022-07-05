import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { makeRipple } from '../../microComp/ripple';
import { createQuestion } from '../../redux/create/create';
import NotFound from '../notFound';
import './create.css';
import CreateDetails from './createDetails';
import QuestionLink from './questionLink';
import QuestionTitle from './questionTitle';

class Create extends PureComponent {
  state = {
    tag: '',
    title: '?',
    tagNAME: '',
    details: '',
    image: null,
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
        title: '?',
        details: '',
        image: '',
      });
    } else {
      this.setState({
        questions: [
          {
            tag: this.state.tag,
            title: this.state.title,
            details: this.state.details,
            image: this.state.image,
          },
          ...this.state.questions,
        ],
        title: '?',
        details: '',
        image: '',
      });
    }
  };
  handleChange = (e, area = ``) => {
    if (area) {
      this.setState({
        [area.name]: area.value,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };
  componentDidMount = () => {
    const { history, location } = this.props;
    if (!location?.state?.tag?._id) {
      history.replace('/tagList');
      return;
    }
    this.setState({
      tag: location?.state?.tag?._id || '',
      tagNAME: location?.state?.tag?.name,
    });
  };
  removeImage = () => {
    this.setState({ image: null });
  };

  onChangeImage = (e) => {
    this.setState({ image: e.target.files[0] });
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
            title: '?',
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
                  tagNAME: this.state.tagNAME,
                  editting: this.state.editting,
                  questions: this.state.questions,
                  title: this.state.title,
                  details: this.state.details,
                  errorText: this.state.errorText,
                  fileValue: this.state.image ? this.state.image : ``,
                  removeImage: this.removeImage,
                  iconChange: this.onChangeImage,
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
  constructor(props) {
    super(props);
    this.textareaRef = React.createRef();
  }
  state = {
    question: '',
    selected: [],
    textSelect: '',
  };

  handleSelected = (start, stop) => {
    if (start !== stop) {
      this.setState({
        selected: [start, stop],
        textSelect: this.props.data.details.substring(start, stop),
      });
    }
  };

  handleSort = (start, stop) => {
    const details = this.props.data.details;
    if (start === stop) {
      return;
    }

    const preString = details.substring(0, start);
    const postString = details.substring(stop, details.length);
    const textExtract = details.substring(start, stop);
    const text = textExtract
      .split(/(?:\r\n|\n)/g)
      .sort((a, b) => {
        if (a > b) {
          return 1;
        } else if (a < b) {
          return -1;
        } else {
          return 0;
        }
      })
      .join(`\n`);
    const name = `details`;
    const newString = preString + text + postString;
    const value = newString;

    const obj = { name, value };
    this.props.data.onChange(null, obj);

    this.setState({
      selected: [],
    });
  };
  handleFormat = (start, stop, stringMark = `*`) => {
    const details = this.props.data.details;
    if (start === stop) {
      return;
    }

    let preString = details.substring(0, start);
    let postString = details.substring(stop, details.length);
    let textExtract = details.substring(start, stop);
    textExtract = this.revEngineer(textExtract, stringMark);

    //Add the extract to the details pre and post strings
    const newString = preString + textExtract + postString;

    const name = this.textareaRef.current.name;
    const value = newString;
    //Create obj for workaround because name couldnt be extracted from react ref
    const obj = { target: { name, value } };
    this.props.data.onChange(obj);
    this.setState({
      selected: [],
    });

    /*
    Take a string, add ** to each ends
    if trimmable, Translocate trimmable spaces to before the **
    Split the string into arrays by `enter` white spaces
    First: add ** to back, last: add ** to front, in between, add ** to both sides
    convert all horiz white spaces in each array to underscore
    Fix in the \n to after all array
    */
  };

  revEngineer = (string, bold = `*`) => {
    const stringMark =
      typeof bold === `string` ? bold.repeat(2) : `**`;
    const topSpace = string.search(/\S|$/);
    const botSpace =
      string.length - string.trim().length - string.search(/\S|$/);
    string = string.trim();
    string = stringMark + string + stringMark;
    let arr = string.split(/(?:\r\n|\n)/g);
    arr = arr.map((str, n) => {
      const tS = string.search(/\S|$/);
      const bS =
        string.length - string.trim().length - string.search(/\S|$/);
      if (n > 0) {
        str = ' '.repeat(tS) + stringMark + str.trim();
      }
      if (n < arr.length - 1) {
        str = str.trim() + stringMark + ' '.repeat(bS);
      }
      return str;
    });
    let finalString = arr.join('\n');

    finalString =
      ' '.repeat(topSpace) + finalString + ' '.repeat(botSpace);
    return finalString;
  };

  render() {
    const {
      tagNAME,
      handleEdit,
      iconChange,
      editting,
      onChange,
      handleDel,
      questions,
      title,
      details,
      removeImage,
      handleSubmit,
      handleAdd,
      errorText,
      fileValue,
      handleErrorClear,
    } = this.props.data;
    return (
      <div className="fdCol createQ">
        <div className="createTitle">
          <p>{tagNAME ? tagNAME + ' tag' : ''}</p>
          <button
            disabled={!(questions.length || (title && details))}
            onClick={(e) => {
              makeRipple(e, true);
              handleSubmit(e);
            }}
            className="createITRight btn"
          >
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
                  iconChange: iconChange,
                  fileValue: fileValue,
                  text: title,
                  hasInput: true,
                  hasIcon: true,
                  title: 'Question',
                  autoFocus: true,
                  title_size: `md`,
                  name: 'title',
                  placeholder:
                    'Example: What is the Axillary Tail of Spence?',
                  label: `Kindly type a question that isn't ambiguous`,
                }}
              />
              {fileValue ? (
                <div className="imagee">
                  <span onClick={removeImage} className="center">
                    <i className="material-icons close"></i>
                  </span>
                  <img
                    src={URL.createObjectURL(fileValue)}
                    alt=""
                    className="img_div_cover"
                  />
                </div>
              ) : (
                ``
              )}
              <QuestionTitle
                data={{
                  hasInput: false,
                  title_size: `md`,
                  title: 'Body',
                  labelIcon: true,
                  sort: () => {
                    const start = this.state.selected[0];
                    const stop = this.state.selected[1];
                    this.handleSort(start, stop);
                  },
                  labelFunc: (stringMark = `*`) => {
                    const start = this.state.selected[0];
                    const stop = this.state.selected[1];
                    if (this.props.data?.onChange) {
                      this.handleFormat(start, stop, stringMark);
                      //this.props.data.onChange(obj);
                    } else {
                      return;
                    }
                  },
                  label: `This section is the answer to the question written above`,
                }}
              />

              <textarea
                className="createInputField"
                type="text"
                name="details"
                ref={this.textareaRef}
                id=""
                // onKeyDown={this.downButton}
                value={details}
                onChange={onChange}
                onSelect={() =>
                  this.handleSelected(
                    this.textareaRef.current.selectionStart,
                    this.textareaRef.current.selectionEnd,
                  )
                }
              />

              <div className="createInputTop">
                <div className="createITLeft"></div>
                <button
                  disabled={!title || !details}
                  onClick={(e) => {
                    makeRipple(e, true);
                    handleAdd(editting);
                  }}
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
              {questions.map((data, n) => (
                <QuestionLink
                  data={data}
                  handleDel={handleDel}
                  handleEdit={handleEdit}
                  key={`${n}_question_list`}
                  number={questions.length - n}
                  total={questions.length}
                />
              ))}
              {/* <div
                className={`box createRightBox sm ellipsis center ${
                  questions.length > 5 ? `` : `invis`
                }`}
              >
                View{' '}
                {questions.length > 5 ? questions.length - 5 : ``}{' '}
                more question(s)
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
