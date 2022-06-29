import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeRipple } from '../../microComp/ripple';
import { createTag } from '../../redux/create/create';
import { clearError } from '../../redux/error/errorAction';
import QuestionTitle from './questionTitle';
import './tagCreate.css';

class TagCreate extends PureComponent {
  state = {
    text: '',
    errorText: '',
    clicked: false,
    image: null,
  };

  removeImage = () => {
    this.setState({ image: null });
  };

  onChangeImage = (e) => {
    console.log(e.target.files[0]);
    this.setState({ image: e.target.files[0] });
  };

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.text) return;
    this.setState({ clicked: true }, () => {
      this.props.createTag({
        name: this.state.text,
        image: this.state.image,
      });
    });
  };
  handleErrorClear = () => {
    this.setState({ errorText: '' });
  };
  componentDidUpdate(prevProps) {
    const { error, tags, history, tagLoading } = this.props;
    if (error.id === 'TAG_CREATE_ERROR') {
      this.setState({
        errorText: error.msg || 'Something went wrong',
      });
      this.props.clearError();
    } else if (
      this.state.clicked &&
      tags.length > 0 &&
      !tagLoading &&
      prevProps.tags.length !== tags.length
    ) {
      this.props.clearError();
      this.setState({ clicked: false }, () => {
        console.log(tags[tags.length - 1], `1111111`);
        history.push({
          pathname: '/create',
          state: { tag: tags[tags.length - 1] },
        });
      });
    }
  }

  render() {
    return (
      <div className="tagCreate_wrap w100">
        <div className="tagCreate_box">
          <form
            method="POST"
            autoComplete="off"
            onSubmit={this.handleSubmit}
          >
            <div
              className={`floater tagger ${
                this.state.errorText ? 'tag' : 'trans'
              }`}
            >
              <i
                className="material-icons close"
                onClick={this.handleErrorClear}
              ></i>
              {this.state.errorText}
            </div>
            <QuestionTitle
              data={{
                onChange: this.handleChange,
                text: this.state.text,
                hasInput: true,
                title: 'Tag Name',
                title_size: 'md',
                autoFocus: true,
                placeholder: 'Example: Upper Limb',
                label: `Suggest a name for the Tag you're about creating`,
              }}
            />

            {this.state.image ? (
              <div className="imagee tagCreateImgCont">
                <span onClick={this.removeImage} className="center">
                  <i className="material-icons close"></i>
                </span>
                <img
                  src={URL.createObjectURL(this.state.image)}
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
                  onChange={this.onChangeImage}
                  type="file"
                  name="file"
                  className="noShow"
                  id="inputFile"
                />
              </div>
            )}
            <button
              onClick={(e) => {
                makeRipple(e, true);
                this.handleSubmit(e);
              }}
              className="btn"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  loader: state.loader,
  tags: state.loader.tags,
  tagLoading: state.loader.tagLoading,
});

const mapDispatchToProps = (dispatch) => ({
  createTag: (body) => dispatch(createTag(body)),
  clearError: () => dispatch(clearError()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TagCreate));
