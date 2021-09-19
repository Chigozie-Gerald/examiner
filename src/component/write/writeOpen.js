import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './write.css';
import '../account/login.css';
import {
  deleteQuestion,
  editQuestion,
} from '../../redux/edit/editQuestion';
import { randomize } from '../../microComp/randomize';
import { EditWrite } from './write';
import { formatter, transform } from '../../microComp/formatter';
import axios from 'axios';
const assert = require('assert');

class WriteOpen extends PureComponent {
  constructor(props) {
    super(props);
    const questions =
      this.props.location?.state?.questionsWriteOpen ||
      sessionStorage.getItem(`questionWriteOpen`);
    //Set Open Details Data
    if (
      !JSON.parse(sessionStorage.getItem(`openDetails`)) &&
      (this.props.location?.state?.openDetails?.combine ||
        this.props.location?.state?.openDetails?.search)
    ) {
      const DETAILS = JSON.stringify(
        this.props.location?.state?.openDetails,
      );
      sessionStorage.setItem(`openDetails`, DETAILS);
    }

    //Set Question Details Data
    if (
      !JSON.parse(sessionStorage.getItem(`questionWriteOpen`))?.arr &&
      this.props.location?.state?.questionsWriteOpen?.length
    ) {
      const QUEST = JSON.stringify({
        question: this.props.location?.state?.questionsWriteOpen,
      });
      sessionStorage.setItem(`questionWriteOpen`, QUEST);
    }

    //Set Randomize Details Data
    if (
      !JSON.parse(sessionStorage.getItem(`randomWriteArrayOpen`))?.arr
    ) {
      const RAND = JSON.stringify({
        arr: randomize(questions.length, true),
      });
      sessionStorage.setItem(`randomWriteArrayOpen`, RAND);
    }

    this.state = {
      randArr:
        JSON.parse(sessionStorage.getItem(`randomWriteArrayOpen`))
          .arr || [],
      clicked: false,
      number: 0,
      openDelete: false,
      openEdit: false,
      binary: ``,
      editObj: {
        tag: ``,
        _id: '',
        title: '',
        details: '',
      },
      questions: [],
    };
  }

  handleTagSelect = (data) => {
    this.setState({ editObj: { ...this.state.editObj, tag: data } });
  };
  handleDeleteQuestion = (e, ID) => {
    e.stopPropagation();
    this.setState(
      {
        openDelete: false,
        openEdit: false,
        editObj: {
          tag: ``,
          _id: '',
          title: '',
          details: '',
        },
      },
      () => this.props.deleteQuestion(ID),
    );
  };
  handleEditQuestion = (e) => {
    e.stopPropagation();

    if (
      !this.state.editObj?._id ||
      !this.state.editObj?.title ||
      !this.state.editObj?.details
    ) {
      return;
    }
    this.props.editQuestion(this.state.editObj);

    this.setState({
      openDelete: false,
      openEdit: false,
      editObj: {
        tag: ``,
        _id: '',
        title: '',
        details: '',
      },
    });
  };

  getTag = () => {
    const { tags } = this.props;
    for (let i = 0; i < tags.length; i++) {
      const elem = tags[i];
      if (elem._id === this.state.editObj.tag) {
        return elem;
      }
    }
  };
  handleOpenEdit = (e) => {
    e.stopPropagation();
    const num = this.state.randArr[this.state.number];
    const question = this.state.questions[num];
    this.setState({
      openDelete: false,
      openEdit: !this.state.openEdit,
      editObj: {
        tag: question.tag?._id,
        _id: question._id,
        title: question.title,
        details: question.details,
      },
    });
  };
  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));

    return window.btoa(binary);
  }
  handleOpenDelete = (e) => {
    e.stopPropagation(true);
    this.setState({
      openEdit: false,
      openDelete: !this.state.openDelete,
    });
  };
  handleIncrease = () => {
    const num = this.state.randArr[this.state.number];
    if (
      this.state.editObj.title !== this.state.questions[num].title
    ) {
      this.setState({
        editObj: { _id: '', title: '', details: '' },
        openDelete: false,
        openEdit: false,
      });
    }
    if (this.state.number === this.state.questions.length - 1) {
      return;
    } else {
      this.setState({
        number: this.state.number + 1,
        clicked: false,
      });
    }
  };
  handleChange = (e) => {
    this.setState({
      editObj: {
        ...this.state.editObj,
        [e.target.name]: e.target.value,
      },
    });
  };

  updateRand = (number) => {
    const rand = JSON.parse(
      sessionStorage.getItem(`randomWriteArrayOpen`),
    ).arr;
    const newRand = [];
    let elemValue = rand[number];
    //Random array should be updated on a delete or pseudo delete
    //This occurs with a change in previous and new state questions length
    //This involves removing an element in the array with same value
    //Reducing elements that are greater than it and

    for (let i = 0; i < rand.length; i++) {
      const data = rand[i];
      if (data > elemValue) {
        newRand.push(data - 1);
      } else if (number === i) {
        continue;
      } else {
        newRand.push(data);
      }
    }

    const RAND = JSON.stringify({
      arr: newRand,
    });
    return RAND;
  };

  handleSearch = async (body) => {
    return axios
      .post(
        'http://localhost:6060/api/finder',
        JSON.stringify(body),
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      )
      .then((details) => {
        return details?.data?.questions;
      })
      .catch(() => {
        return;
      });
  };
  handleCombineSubmit = async (body) => {
    return axios
      .post(
        'http://localhost:6060/api/combine',
        JSON.stringify(body),
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      )
      .then((details) => {
        return details?.data?.questions;
      })
      .catch(() => {
        return;
      });
  };

  componentDidUpdate = async (prevProps) => {
    const { questions } = this.props;
    try {
      assert.deepStrictEqual(prevProps.questions, questions);
      return;
    } catch {
      let quest = [];
      //If question i brought in isnt equal to present questions, change
      //Current questions are
      if (JSON.parse(sessionStorage.getItem(`openDetails`)).combine) {
        let body = JSON.parse(
          sessionStorage.getItem(`openDetails`),
        ).combine;
        quest = await this.handleCombineSubmit(body);
      } else {
        let body = JSON.parse(
          sessionStorage.getItem(`openDetails`),
        ).search;
        quest = await this.handleSearch(body);
      }

      if (quest.length === 0) {
        this.props.history.replace(`/tagList`);
      } else {
        if (this.state.questions.length !== quest.length) {
          sessionStorage.setItem(
            `randomWriteArrayOpen`,
            this.updateRand(this.state.number),
          );
        }
        sessionStorage.setItem(`questionWriteOpen`, quest);
        this.setState({
          questions: quest,
          randArr:
            JSON.parse(sessionStorage.getItem(`randomWriteArrayOpen`))
              .arr || [],
          number:
            this.state.number === quest.length
              ? this.state.number - 1
              : this.state.number,
        });
      }
    }
  };
  componentDidMount = () => {
    //Set questions
    //Leave if no questions
    const questions =
      this.props.location?.state?.questionsWriteOpen ||
      JSON.parse(sessionStorage.getItem(`questionWriteOpen`))
        .question;
    if (!sessionStorage.getItem(`openDetails`)) {
      this.props.history.replace(`/tagList`);
      return;
    }
    if (questions) {
      if (questions.length === 0) {
        this.props.history.replace(`/tagList`);
      } else {
        this.setState({ questions });
      }
    } else {
      this.props.history.replace(`/tagList`);
    }
  };
  componentWillUnmount = () => {
    sessionStorage.removeItem(`randomWriteArrayOpen`);
    sessionStorage.removeItem(`questionWriteOpen`);
    sessionStorage.removeItem(`openDetails`);
  };
  handleDecrease = () => {
    if (this.state.number === 0) {
      return;
    } else {
      this.setState({
        number: this.state.number - 1,
        clicked: false,
      });
    }
  };

  render() {
    const { tags } = this.props;
    const num = this.state.randArr[this.state.number];
    const quest = this.state.questions[num];
    return (
      <div className="examWrite_wrap fdCol">
        {this.state.openEdit ? (
          <EditWrite
            data={{
              handleOpenEdit: this.handleOpenEdit,
              handleChange: this.handleChange,
              state: this.state,
              tags: tags,
              getTag: this.getTag,
              handleEditQuestion: this.handleEditQuestion,
              handleTagSelect: this.handleTagSelect,
            }}
          />
        ) : (
          ''
        )}
        <div className="examWrite_header w100">
          <div className="content">
            <span>
              <span>
                {sessionStorage.getItem(`allQuest`) === `true`
                  ? `All Questions`
                  : this.state.questions[0]?.tag?.name}
              </span>
            </span>
          </div>
          <Link
            to={{ pathname: '/tagList' }}
            className="Link inline auto examLogin_link"
          >
            {/*<button className="examLogin_btn">Home</button>*/}
            <button className="btn">View Tags</button>
          </Link>
        </div>
        <div className="examWrite_body top w100">
          <div className="examWrite_left">
            <div className="examWrite_left_box w100">
              <div
                onClick={this.handleOpenEdit}
                className="examWrite_inner_float center"
              >
                <i className="material-icons edit"></i>
              </div>
              <div
                onClick={this.handleOpenDelete}
                className="examWrite_inner_float two center"
              >
                <div
                  className={`examWrite_inner_delete_pane ${
                    this.state.openDelete ? '' : 'noShow'
                  }`}
                >
                  <p>Are you sure you want to delete?</p>
                  <span>
                    <button
                      onClick={(e) =>
                        this.handleDeleteQuestion(
                          e,
                          this.state.questions[num]._id,
                        )
                      }
                      className="btn"
                    >
                      Delete
                    </button>
                  </span>
                </div>
                <i className="material-icons close"></i>
              </div>
              <div className="examWrite_L_header">
                Question {this.state.number + 1} of{' '}
                {this.state.questions.length}
              </div>
              <div className="examWrite_L_body">
                {this.state.questions.length > 0
                  ? this.state.questions[num]?.title
                  : ''}
              </div>
              <div className="examWrite_L_image">
                <div className="examWrite_L_image_inner">
                  {quest?.imageAddress && (
                    <img
                      alt=""
                      className="img_div_cover"
                      src={`http://localhost:6060/api/loadImage/${quest.imageAddress}`}
                    />
                  )}
                </div>
              </div>
              <div className="examWrite_L_btn">
                <button
                  onClick={() =>
                    this.setState({ clicked: !this.state.clicked })
                  }
                  className="examLogin_btn next btn"
                >
                  {this.state.clicked ? 'Hide' : 'View'} Answer
                </button>
              </div>
            </div>
          </div>
          <div
            className={`examWrite_right ${
              !this.state.clicked ? '' : 'active'
            }`}
          >
            {this.state.questions.length > 0
              ? formatter(this.state.questions[num]?.details).map(
                  (data, n) => (
                    <p key={`formatter_key${n}`}>
                      {transform(data).map((txt, m) => {
                        if (typeof txt === `object`) {
                          return txt.format === `bold` ? (
                            <b key={`formatter_key_bold_${m}`}>
                              {txt.text.replace(/_/g, ` `)}
                            </b>
                          ) : (
                            <span
                              style={{ textDecoration: 'underline' }}
                            >
                              {txt.text.replace(/_/g, ` `)}
                            </span>
                          );
                        } else {
                          return txt;
                        }
                      })}
                      <br />
                    </p>
                  ),
                )
              : ''}
          </div>
        </div>
        <div className="examWrite_body second w100">
          <div className="examWrite_left">
            <div className="examWrite_left_inner one">
              {this.state.number !== 0 && (
                <>
                  <span
                    onClick={this.handleDecrease}
                    className="center"
                  >
                    <i className="material-icons keyboard_arrow_left"></i>
                  </span>
                  Prev
                </>
              )}
            </div>
            <div className="examWrite_left_inner two">
              {this.state.number !==
                this.state.questions.length - 1 && (
                <>
                  Next
                  <span
                    onClick={this.handleIncrease}
                    className="center"
                  >
                    <i className="material-icons keyboard_arrow_right"></i>
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="examWrite_right"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  questions: state.loader.questions,
  tags: state.loader.tags,
});

const mapDispatchToProps = (dispatch) => ({
  deleteQuestion: (data) => dispatch(deleteQuestion(data)),
  editQuestion: (data) => dispatch(editQuestion(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(WriteOpen));
