import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createTag } from '../../redux/create/create';
import { clearError } from '../../redux/error/errorAction';
import QuestionTitle from './questionTitle';
import './tagCreate.css';

class TagCreate extends PureComponent {
  state = {
    text: '',
    errorText: '',
    clicked: false,
  };

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.text) return;
    this.setState({ clicked: true }, () => {
      this.props.createTag({ name: this.state.text });
    });
  };
  handleErrorClear = () => {
    this.setState({ errorText: '' });
  };
  componentDidUpdate(prevProps) {
    const { error, tags, history, tagLoading } = this.props;
    if (error.id === 'TAG_CREATE_ERROR') {
      this.setState({ errorText: error.type });
      this.props.clearError();
    } else if (
      this.state.clicked &&
      tags.length > 0 &&
      !tagLoading &&
      prevProps.tags.length !== tags.length
    ) {
      this.props.clearError();
      this.setState({ clicked: false }, () => {
        history.push({
          pathname: '/create',
          state: { tag: tags[tags.length - 1]._id },
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
            <button onClick={this.handleSubmit} className="btn">
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
