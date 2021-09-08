import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './tagList.css';

class TagList extends PureComponent {
  Click = (data) => {
    this.props.history.push({
      pathname: `/write`,
      state: { tag: data || `` },
    });
  };
  handleAddQuest = (e, ID) => {
    e.stopPropagation();
    this.props.history.push({
      pathname: '/create',
      state: { tag: ID },
    });
  };

  render() {
    const { tags } = this.props;
    return (
      <div className="tagList_wrap w100 center">
        {tags.length > 0 ? (
          <div className="tagList_box">
            <div className="float">
              <button
                className="btn"
                onClick={() => this.props.history.push(`/tagCreate`)}
              >
                Create New Tag
              </button>
            </div>
            {tags.map((data, n) => (
              <div
                onClick={() => this.Click(data?._id)}
                className="tagList_inner"
                key={`tagList_inner_key_${n}`}
              >
                <div
                  onClick={(e) => this.handleAddQuest(e, data?._id)}
                  className="tagList_inner_float"
                >
                  <i className="material-icons add"></i>
                </div>
                <div className="tagList_inner_top"></div>
                <div className="tagList_inner_btm ellipsis">
                  {data.name}
                </div>
                <span>Questions: {data.questions}</span>
              </div>
            ))}
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
    );
  }
}

const mapStateToProps = (state) => ({
  tags: state.loader.tags,
  questions: state.loader.questions,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TagList));
