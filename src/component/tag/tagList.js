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
    image: null,
  };

  handleEditTag = (e, number, name) => {
    e.stopPropagation();
    if (this.state.editOpen) {
      this.setState({ editOpen: false, editText: `` });
    } else {
      this.setState({ editOpen: number + 1, editText: name });
    }
  };

  handleCloseEditTag = () => {
    this.setState({ editOpen: false, editText: `` });
  };

  removeDropOnClick = () => {
    this.handleCloseEditTag();
  };

  componentWillUnmount() {
    window.removeEventListener('click', this.removeDropOnClick);
  }

  handleChange = (e) => {
    this.setState({ editText: e.target.value });
  };
  handleEdit = (e, data) => {
    e.stopPropagation();
    const name = this.state.editText;
    const image = this.state.image;
    this.setState(
      { editOpen: false, editText: ``, image: null },
      () => this.props.editTag(data._id, { name, image }),
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

  removeImage = () => {
    this.setState({ image: null });
  };

  onChangeImage = (e) => {
    console.log(e.target.files[0]);
    this.setState({ image: e.target.files[0] });
  };

  componentDidMount() {
    //Sets the space above the element before any action is taken
    window.addEventListener('click', this.removeDropOnClick);
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
                      removeImage: this.removeImage,
                      onChangeImage: this.onChangeImage,
                      handleAddQuest: this.handleAddQuest,
                      handleEditTag: this.handleEditTag,
                      handleChange: this.handleChange,
                      handleEdit: this.handleEdit,
                      Click: this.Click,
                      editText: this.state.editText,
                      image: this.state.image,
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
      removeImage,
      onChangeImage,
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
      image,
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
            </div>
          )}
          {!allQuest && editOpen && editOpen === n + 1 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="tagList_input fdCol"
            >
              <input
                type="text"
                onChange={handleChange}
                value={editText}
              />
              {image ? (
                <div className="imagee tagCreateImgCont">
                  <span onClick={removeImage} className="center">
                    <i className="material-icons close"></i>
                  </span>
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="img_div_cover"
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="inputFile"
                    className="imagee tagCreateImgCont center"
                  >
                    Add Optional Photo
                  </label>
                  <input
                    onChange={onChangeImage}
                    type="file"
                    name="file"
                    className="noShow"
                    id="inputFile"
                  />
                </div>
              )}
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
          <div className="tagList_inner_top">
            {data?.imageAddress && (
              <img
                alt=""
                className="img_div_cover"
                src={`http://localhost:6060/api/loadImage/${data?.imageAddress}`}
              />
            )}
          </div>
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
