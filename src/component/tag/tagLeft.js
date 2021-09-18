import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import './tagList.css';
import './tagLeft.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

export class TagLeft extends PureComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  state = {
    //Search
    search: ``,
    hasImage: false,
    tags: [],
    questions: [],
    //Combine
    searchTag: ``,
    combine: false,
    tagRes: [],
    combineTags: [],
    combineResponse: [],
  };
  handleChange = (e) => {
    console.log(e.target.name);
    this.setState(
      {
        [e.target.name]: e.target.value,
        combineTags:
          this.state.combineResponse.length && !this.state.searchTag
            ? []
            : this.state.combineTags,
      },
      () => {
        if (e.target.name === `search`) {
          return;
        } else {
          console.log(this.state.tagRes);
          this.setState({ combineResponse: [] });
          this.handleFindTag(e);
        }
      },
    );
  };
  Click = (e, quest) => {
    e.stopPropagation();
    this.props.history.push({
      pathname: `/writeOpen`,
      state: { tag: ``, quest },
    });
  };
  handleCheck = (e) => {
    console.log(this.state.hasImage);
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  };
  handleAdd = (tag) => {
    const tagCheck = this.state.combineTags.filter(
      (data) => data._id === tag._id,
    );
    if (tagCheck.length) {
      return;
    }
    this.setState({ combineTags: [tag, ...this.state.combineTags] });
  };
  handleRemove = (num) => {
    this.setState({
      combineTags: this.state.combineTags.filter(
        (data, n) => n !== num,
      ),
    });
  };
  handleClick = (value) => {
    this.setState({ combine: value });
  };

  handleSearch = (e) => {
    e.preventDefault();
    console.log(
      {
        hasImage: this.state.hasImage,
        search: this.state.search,
      },
      `fmdmdmdm`,
    );
    if (!this.state.search || typeof this.state.search !== `string`)
      return;

    const body = {
      hasImage: this.state.hasImage,
      search: this.state.search,
    };
    const BODY = JSON.stringify(body);
    axios
      .post('http://localhost:6060/api/finder', BODY, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((details) => {
        this.setState(
          {
            tags: details.data.tags,
            questions: details.data.questions,
          },
          () => console.log(this.state, `wer`),
        );
      })
      .catch((err) => {
        this.setState({
          search: ``,
          hasImage: false,
          tags: [],
          questions: [],
        });
      });
  };
  handleCombineSubmit = (e) => {
    e.preventDefault();
    if (!this.state.combineTags.length) {
      return;
    } else {
      const body = {
        tagIds: this.state.combineTags.map((data) => data._id),
      };
      const BODY = JSON.stringify(body);
      axios
        .post('http://localhost:6060/api/combine', BODY, {
          headers: {
            'content-type': 'application/json',
          },
        })
        .then((details) => {
          this.setState({
            combineResponse: details.data.questions,
            searchTag: ``,
            tagRes: [],
          });
          console.log(details.data.questions);
        })
        .catch((err) => {
          this.setState({
            searchTag: ``,
            tagRes: [],
            combineTags: [],
            combineResponse: [],
          });
        });
    }
  };

  handleFindTag = (e) => {
    e.preventDefault();
    if (!this.state.searchTag) {
      return;
    } else {
      const body = { search: this.state.searchTag };
      const BODY = JSON.stringify(body);
      axios
        .post('http://localhost:6060/api/findTag', BODY, {
          headers: {
            'content-type': 'application/json',
          },
        })
        .then((details) => {
          this.setState({ tagRes: details.data.tag });
        })
        .catch((err) => {
          this.setState({ tagRes: [] });
        });
    }
  };

  render() {
    return (
      <div className="tagList_left scroller fdCol">
        {!this.state.combine ? (
          <div className="tagList_left_head fdCol">
            <div className="tagList_left_head combine">
              <span
                onClick={() => this.handleClick(true)}
                className="tagList_search_span center"
              >
                Go to Combine
                <i className="material-icons keyboard_arrow_right"></i>{' '}
              </span>
            </div>
            <div
              onClick={() => this.handleClick(false)}
              className="tagList_left_search center"
            >
              <form
                onSubmit={this.handleSearch}
                autoComplete="off"
                action=""
                method="post"
                className="w100"
              >
                <input
                  type="text"
                  name="search"
                  value={this.state.search}
                  id=""
                  onChange={this.handleChange}
                />
                <button onClick={this.handleSearch} className="btn">
                  <i className="material-icons search"></i>
                </button>
              </form>

              {/*<span className="tagList_search_span center">
              <i className="material-icons search"></i>
            </span>*/}
            </div>
          </div>
        ) : (
          <div className="tagList_left_head combine">
            <span
              onClick={() => this.handleClick(false)}
              className="tagList_search_span center"
            >
              <i className="material-icons keyboard_arrow_left"></i>{' '}
              Back to Search
            </span>
          </div>
        )}
        {!this.state.combine ? (
          <>
            <div className="tagList_left_head check">
              <input
                onChange={this.handleCheck}
                checked={this.state.hasImage}
                value={this.state.hasImage}
                type="checkbox"
                name="hasImage"
                id=""
              />
              <span className="tagList_left_label w100">
                Has Image
              </span>
            </div>
            <div className="tagList_left_body">
              <div
                onClick={() => {
                  if (!this.state.tags.length) return;
                  this.setState({ dropDown: !!!this.state.dropDown });
                }}
                className={`tagList_left_label res w100 ${
                  !this.state.tags.length ? `gray` : ``
                }`}
              >
                Tags{' '}
                {`${
                  this.state.tags.length
                    ? `(${this.state.tags.length})`
                    : ``
                }`}
                {this.state.tags.length ? (
                  <i className="material-icons keyboard_arrow_down"></i>
                ) : (
                  ``
                )}
              </div>
              <div
                className={`tagList_tag_Result tags scroller ${
                  this.state.dropDown ? '' : 'inactive'
                }`}
              >
                {this.state.tags.map((data) => (
                  <div className="tagLeftPane tags">{data.name}</div>
                ))}
              </div>
              <div
                className={`tagList_left_label res w100 mt1 ${
                  !this.state.tags.length ? `gray` : ``
                }`}
              >
                Body and Title results
              </div>

              {this.state.questions.length ? (
                <TagLeftQuest
                  data={{
                    click: this.Click,
                    tags: [],
                    length: this.state.questions.length,
                  }}
                />
              ) : (
                ``
              )}
            </div>
          </>
        ) : (
          <div className="tagList_combine_body fdCol">
            <div className="tagList_combine_body_inner fdCol">
              <form
                ref={this.formRef}
                action="POST"
                autoComplete="off"
                onSubmit={this.handleFindTag}
              >
                <input
                  className="w100 center"
                  type="text"
                  placeholder="Search Tags"
                  value={this.state.searchTag}
                  name="searchTag"
                  onChange={this.handleChange}
                  id=""
                />
              </form>

              {this.state.searchTag && this.state.tagRes.length ? (
                <div className="tagList_combine_body_result_list scroller">
                  {this.state.tagRes.map((tag) => (
                    <div className="tagLeft_Inline_wrap long">
                      <div className="tagLeft_Inline center">
                        {!this.state.combineTags.filter(
                          (data) => data._id === tag._id,
                        ).length && (
                          <i
                            onClick={() => this.handleAdd(tag)}
                            className="material-icons add"
                          ></i>
                        )}
                        {tag.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                ``
              )}
              <div className="tagList_combine_body_result scroller">
                <span className="tagList_left_label w100">
                  {!this.state.combineResponse.length
                    ? `Tags`
                    : `Results`}
                </span>
                {!this.state.combineResponse.length &&
                  this.state.combineTags.map((tag, n) => (
                    <div className="tagLeft_Inline_wrap long">
                      <div className="tagLeft_Inline center">
                        <i
                          onClick={() => this.handleRemove(n)}
                          className="material-icons remove"
                        ></i>
                        {tag.name}
                      </div>
                    </div>
                  ))}
                <div className="tagLeft_combine_wrapper">
                  {this.state.combineResponse.length ? (
                    <TagLeftQuest
                      data={{
                        click: this.Click,
                        tags: this.state.combineTags,
                        length: this.state.combineResponse.length,
                      }}
                    />
                  ) : (
                    ``
                  )}
                </div>
              </div>
            </div>
            <div className="tagList_combine_btn_wrap center w100">
              <button
                onClick={this.handleCombineSubmit}
                className="btn w100"
              >
                Combine
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tags: state.loader.tags,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TagLeft));

export class TagLeftQuest extends PureComponent {
  render() {
    const { tags, length, click } = this.props.data;
    return (
      <div onClick={click} className="tagLeftPane">
        {tags.length ? (
          <div className="first">
            {tags.map((data, n) =>
              n < 5 ? (
                <div className="tagLeft_Inline_wrap">
                  <div className="tagLeft_Inline center">
                    {data.name}
                  </div>
                </div>
              ) : (
                ''
              ),
            )}
            {tags.length > 5 && (
              <div className="tagLeft_Inline_wrap">
                <div className="tagLeft_Inline center more">
                  View {tags.length - 1} more...
                </div>
              </div>
            )}
          </div>
        ) : (
          ``
        )}
        <div className="second">
          Questions: {length || ``}
          <span className="i material-icons keyboard_arrow_right"></span>
        </div>
      </div>
    );
  }
}
