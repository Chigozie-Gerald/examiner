import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { editTag } from '../../redux/edit/editTag';
import TagLeft from './tagLeft';
import './tagList.css';

class TagList extends PureComponent {
  constructor(props) {
    super(props);
    this.coordinateX = 0;
    this.coordinateY = 0;
  }
  state = {
    X: 16,
    Y: window.innerHeight - 352,
    shouldMove: false,
    editOpen: false,
    editText: '',
  };
  handleEditTag = (e, number, name) => {
    console.log(name, name, name);
    e.stopPropagation();
    if (this.state.editOpen) {
      this.setState({ editOpen: false, editText: `` });
    } else {
      this.setState({ editOpen: number + 1, editText: name });
    }
  };
  handleChange = (e) => {
    e.stopPropagation();
    this.setState({ editText: e.target.value });
  };
  handleEdit = (e, data) => {
    e.stopPropagation();
    const text = this.state.editText;
    this.setState({ editOpen: false, editText: `` }, () =>
      this.props.editTag(data._id, text),
    );
  };
  Click = (e, data, allQuest) => {
    e.stopPropagation();
    this.props.history.push({
      pathname: `/write`,
      state: { tag: data || ``, allQuest },
    });
  };
  handleAddQuest = (e, tag) => {
    e.stopPropagation();
    this.props.history.push({
      pathname: '/create',
      state: { tag },
    });
  };
  /*
  eventCheck = (elem) => {
    this.mover(elem, this.coordinateX, this.coordinateY);
  };
  dragMouseDown = (e) => {
    //Will be called when mouse presses down in the vicinity of the element
    this.setState({
      shouldMove: true,
      //This is to tell the events if something had initially started
    });
    this.coordinateX = e.clientX;
    this.coordinateY = e.clientY;
    /*The coordinates above were gotten from
    the elements event variables
    They represent initial values which are independent of the ones the window
    event uses
    The reason for attaching them to a this statement is to ensure its global availability
    This is so because it is necessary for removing event handlers*=/
    console.log(`start`);
    window.addEventListener(`mousemove`, this.eventCheck);
  };

  closeDragElement = () => {
    //Calls when the mouse is up
    console.log(`close`, this.container.getBoundingClientRect().top);
    window.removeEventListener(`mousemove`, this.eventCheck);
    this.setState({
      shouldMove: false,
      X: this.container.getBoundingClientRect().left,
      Y: this.container.getBoundingClientRect().top,
      //This sets the style parameters to the final values gotten from the movers
    });
  };

  mover = (e, X, Y) => {
    console.log(`mover`);
    if (this.state.shouldMove) {
      let leftVal = this.state.X + e.clientX - X,
        topValue = this.state.Y + e.clientY - Y;
      //Initial values - Continuous values
      if (leftVal < 0) leftVal = 0;
      if (topValue < 0) topValue = 0;
      this.container.style.left = `${leftVal}px`;
      this.container.style.top = `${topValue}px`;
    }
  };
  assignRef = (e) => (this.container = e);*/
  componentDidMount() {
    //Sets the space above the element before any action is taken
    sessionStorage.removeItem(`randomWriteArrayOpen`);
    sessionStorage.removeItem(`questionWriteOpen`);
    sessionStorage.removeItem(`openDetails`);
  }
  render() {
    const { tags, questions } = this.props;

    return (
      <div className="tagList_wrap w100 center">
        {/*
        <div
          ref={this.assignRef}
          className="dict_wrap box"
          onMouseDown={this.dragMouseDown}
          onMouseUp={this.closeDragElement}
        >
          {},{},{}
        </div>
        */}
        <TagLeft
          data={{
            handleAddQuest: this.handleAddQuest,
            handleEditTag: this.handleEditTag,
            handleChange: this.handleChange,
            handleEdit: this.handleEdit,
            Click: this.Click,
            state: this.state,
            editText: this.state.editText,
            editOpen: this.state.editOpen,
            questions: questions,
            allQuest: true,
            n: 0,
          }}
        />
        <div className="tagList_right">
          {tags.length > 0 ? (
            <div className="tagList_box fdCol">
              <div className="inner">
                <TagListPane
                  data={{
                    handleAddQuest: this.handleAddQuest,
                    handleEditTag: this.handleEditTag,
                    handleChange: this.handleChange,
                    handleEdit: this.handleEdit,
                    Click: this.Click,
                    editText: this.state.editText,
                    editOpen: this.state.editOpen,
                    questions: questions,
                    allQuest: true,
                    n: 0,
                  }}
                />
                {tags.map((data, n) => (
                  <TagListPane
                    key={`tagList_inner_key_${n}`}
                    data={{
                      handleAddQuest: this.handleAddQuest,
                      handleEditTag: this.handleEditTag,
                      handleChange: this.handleChange,
                      handleEdit: this.handleEdit,
                      Click: this.Click,
                      editText: this.state.editText,
                      editOpen: this.state.editOpen,
                      questions: questions,
                      data,
                      n,
                    }}
                  />
                ))}
              </div>
              <div className="float">
                <button
                  className="btn"
                  onClick={() =>
                    this.props.history.push(`/tagCreate`)
                  }
                >
                  Create New Tag
                </button>
              </div>
            </div>
          ) : (
            <div className="tagList_create center fdCol">
              <h1>No tag has been created yet</h1>
              <button
                onClick={() =>
                  this.props.history.push({ pathname: `/tagCreate` })
                }
                className="btn"
              >
                Click here to create a Tag
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tags: state.loader.tags,
  questions: state.loader.questions,
});

const mapDispatchToProps = (dispatch) => ({
  editTag: (ID, name) => dispatch(editTag(ID, name)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TagList));

export class TagListPane extends PureComponent {
  state = {
    hoverName: false,
  };
  render() {
    const {
      allQuest,
      Click,
      handleAddQuest,
      handleEditTag,
      handleEdit,
      questions,
      data,
      editOpen,
      handleChange,
      editText,
      n,
    } = this.props.data;

    return (
      <div className="wrapper">
        <div
          onClick={(e) => Click(e, data?._id, allQuest)}
          className={`tagList_inner ${allQuest ? 'allQuest' : ''}`}
        >
          {!allQuest && (
            <div
              onClick={(e) => handleAddQuest(e, data)}
              className="tagList_inner_float center"
            >
              <i className="material-icons add"></i>
            </div>
          )}
          {!allQuest && (
            <div
              onClick={(e) => handleEditTag(e, n, data?.name)}
              className="tagList_inner_float two center"
            >
              <i className="material-icons edit"></i>
              {editOpen && editOpen === n + 1 ? (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="tagList_input fdCol"
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    value={editText}
                  />
                  <button
                    onClick={(e) => handleEdit(e, data)}
                    className="btn sm"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                ''
              )}
            </div>
          )}
          <div className="tagList_inner_top"></div>
          <div
            onMouseOver={() => this.setState({ hoverName: n + 1 })}
            onMouseOut={() => this.setState({ hoverName: false })}
            className={`tagList_inner_btm ${
              this.state.hoverName === n + 1 ? 'noSee' : 'ellipsis'
            }`}
          >
            {this.state.hoverName === n + 1
              ? `a`
              : data?.name
              ? data?.name
              : `All Questions`}
            {this.state.hoverName === n + 1 && (
              <div className="tagList_inner_btm_float">
                {data?.name ? data?.name : `All Questions`}
              </div>
            )}
          </div>
          <span>
            Questions:{' '}
            {!allQuest
              ? questions.filter(
                  (quest) => quest.tag._id === data?._id,
                ).length
              : questions.length}
          </span>
        </div>
      </div>
    );
  }
}
