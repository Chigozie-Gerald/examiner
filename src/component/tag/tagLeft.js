import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import './tagList.css';
import './tagLeft.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { makeRipple } from '../../microComp/ripple';
import {
  formatter,
  transform,
  getFormatResult,
} from '../../microComp/formatter';

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
    readOnlyShow: null,
    //Combine
    searchTag: ``,
    searching: false,
    combining: false,
    combine: false,
    tagRes: [],
    combineTags: [],
    combineResponse: [],
  };

  showReadOnlyDetails = (_id) => {
    const id = _id === this.state.readOnlyShow ? null : _id;
    this.setState({
      readOnlyShow: id,
    });
  };

  tagCombineList = () => {
    return this.state.tagRes.filter((tag) => {
      return !this.state.combineTags.some(
        (data) => data._id === tag._id,
      );
    });
  };

  handleChange = (e) => {
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
          this.setState({ combineResponse: [] });
          this.handleFindTag(e);
        }
      },
    );
  };
  Click = (e, quest, search) => {
    e.stopPropagation();
    this.props.history.push({
      pathname: `/writeOpen`,
      state: {
        questionsWriteOpen: quest,
        openDetails: {
          search: search
            ? {
                hasImage: this.state.hasImage,
                search: this.state.search,
              }
            : ``,
          combine: !search
            ? {
                tagIds: this.state.combineTags.map(
                  (data) => data._id,
                ),
              }
            : ``,
        },
      },
    });
  };
  handleCheck = (e) => {
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
    if (!this.state.search || typeof this.state.search !== `string`)
      return;

    const body = {
      hasImage: this.state.hasImage,
      search: this.state.search,
    };
    const BODY = JSON.stringify(body);
    this.setState({ searching: true });
    axios
      .post('http://localhost:6060/api/finder', BODY, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((details) => {
        this.setState({
          tags: details.data.tags,
          searching: false,
          questions: details.data.questions,
        });
      })
      .catch((err) => {
        this.setState({
          search: ``,
          searching: false,
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
      this.setState({ combining: true });
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
            combining: false,
          });
        })
        .catch((err) => {
          this.setState({
            searchTag: ``,
            tagRes: [],
            combineTags: [],
            combineResponse: [],
            combining: false,
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
    const tagCombineListArray = this.tagCombineList();
    const { readOnly } = this.props;
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
                onKeyDown={(e) => e.stopPropagation()}
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
                  autoFocus
                  id=""
                  onChange={this.handleChange}
                />
                <button
                  onClick={(e) => {
                    makeRipple(e);
                    this.handleSearch(e);
                  }}
                  className="btn"
                >
                  <i className="material-icons search"></i>
                </button>
              </form>
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
                id="hasImageId"
              />
              <label
                htmlFor="hasImageId"
                className="tagList_left_label w100"
              >
                Has Image
              </label>
            </div>
            <div
              // onClick={(e) => makeRipple(e, false, true, 70, true)}
              className="tagList_left_body"
            >
              <div
                className={`tagList_tag_Result tags scroller ${
                  this.state.dropDown ? '' : 'inactive'
                }`}
              >
                {this.state.tags.map((data, ind) => (
                  <div key={ind} className="tagLeftPane tags">
                    {data.name}
                  </div>
                ))}
              </div>

              {this.state.questions.length ? (
                readOnly ? (
                  this.state.questions.map((question, ind) => (
                    <React.Fragment key={ind}>
                      <QuestionList
                        question={question}
                        readOnlyShow={this.state.readOnlyShow}
                        showReadOnlyDetails={this.showReadOnlyDetails}
                      />
                    </React.Fragment>
                  ))
                ) : (
                  <TagLeftQuest
                    data={{
                      click: this.Click,
                      questions: this.state.questions,
                      search: true,
                    }}
                  />
                )
              ) : this.state.searching ? (
                <div className="blinker_wrap">
                  Searching{' '}
                  <div className="drag_box_empty inline">
                    <div className="blinkers one"></div>
                    <div className="blinkers two"></div>
                    <div className="blinkers three"></div>
                  </div>
                </div>
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
                  autoFocus
                  placeholder="Search Tags..."
                  value={this.state.searchTag}
                  name="searchTag"
                  onChange={this.handleChange}
                />
              </form>

              {this.state.searchTag && tagCombineListArray.length ? (
                <div className="tagList_combine_body_result_list scroller">
                  {tagCombineListArray.map((tag, index) => (
                    <div
                      key={index}
                      className="tagLeft_Inline_wrap long"
                    >
                      <div
                        onClick={() => this.handleAdd(tag)}
                        className="tagLeft_Inline center"
                      >
                        <i className="material-icons add"></i>
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
                  (this.state.combining ? (
                    <div className="blinker_wrap">
                      Combining{' '}
                      <div className="drag_box_empty inline">
                        <div className="blinkers one"></div>
                        <div className="blinkers two"></div>
                        <div className="blinkers three"></div>
                      </div>
                    </div>
                  ) : (
                    <TagLeftComposeQuest
                      tags={this.state.combineTags}
                      remove={this.handleRemove}
                    />
                  ))}
                <div className="tagLeft_combine_wrapper">
                  {this.state.combineResponse.length ? (
                    <TagLeftQuest
                      data={{
                        click: this.Click,
                        tags: this.state.combineTags,
                        questions: this.state.combineResponse,
                        search: false,
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
                onClick={(e) => {
                  makeRipple(e);
                  this.handleCombineSubmit(e);
                }}
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
    const { questions, click, search } = this.props.data;
    const length = questions.length;
    return (
      <div
        onClick={(e) => click(e, questions, search)}
        className="tagLeftPane"
      >
        <div className="second">
          Questions: {length || ``}
          <span className="i material-icons keyboard_arrow_right"></span>
        </div>
      </div>
    );
  }
}

const QuestionList = ({
  question,
  readOnlyShow,
  showReadOnlyDetails,
}) => {
  return (
    <div className="left_q_list_wrapper box">
      <div className="left_q_list_tag">
        {question?.tag?.name || ``}
      </div>
      <div className="left_q_list_title">
        <span>{question.title}</span>
        <i
          onClick={() => showReadOnlyDetails(question._id)}
          className={`i material-icons keyboard_arrow_down ${
            readOnlyShow === question._id ? `rotate` : ``
          }`}
        ></i>
      </div>

      <div
        className={`left_q_list_details ${
          readOnlyShow === question._id ? `` : `noShow`
        }`}
      >
        {question?.details
          ? formatter(question.details).map((data, n) => {
              return (
                <p key={`formatter_key${n}`}>
                  {transform(data).map((parsedObject, m) => {
                    const { bold, italic, underline } =
                      getFormatResult(parsedObject);
                    return (
                      <span
                        key={`formatter_key_span_${m}`}
                        style={{
                          fontWeight: bold ? `bold` : undefined,
                          textDecoration: underline
                            ? 'underline'
                            : undefined,
                          fontStyle: italic ? 'italic' : undefined,
                        }}
                      >
                        {parsedObject.text}
                      </span>
                    );
                  })}
                  <br />
                </p>
              );
            })
          : ''}
      </div>
    </div>
  );
};

const TagLeftComposeQuest = ({ tags, remove }) => {
  return tags && tags.length > 0 ? (
    <div className="tagLeftComposeQuest">
      <div className="tagLeftPane">
        {tags.map((tag, index) => (
          <div
            onClick={() => remove(index)}
            key={`TagLeftComposeQuest_${index}`}
            className="second"
          >
            <i className="i material-icons remove"></i>
            <span className="tagLeftComposeQuest_span">
              {tag.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div></div>
  );
};
