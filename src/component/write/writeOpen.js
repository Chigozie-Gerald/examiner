import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './write.css';
import '../account/login.css';
import {
  deleteQuestion,
  editQuestion,
} from '../../redux/edit/editQuestion';
import { randomize } from '../../microComp/randomize';
import axios from 'axios';
import WriteMicro from './writeMicro';
const assert = require('assert');

class WriteOpen extends PureComponent {
  constructor(props) {
    super(props);
    const questions =
      this.props.location?.state?.questionsWriteOpen ||
      sessionStorage.getItem(`questionWriteOpen`);
    let randomSess = sessionStorage.getItem(`randomWriteArrayOpen`);
    let questSess = sessionStorage.getItem(`questionWriteOpen`);

    //Set Open Details Data

    const DETAILS = JSON.stringify(
      this.props.location?.state?.openDetails,
    );
    sessionStorage.setItem(`openDetails`, DETAILS);

    //Set Question Details Data

    const QUEST = JSON.stringify({
      question: this.props.location?.state?.questionsWriteOpen,
    });
    sessionStorage.setItem(`questionWriteOpen`, questSess || QUEST);

    //Set Randomize Details Data
    const arr = randomize(questions.length, true);
    const RAND = JSON.stringify({
      arr,
    });
    sessionStorage.setItem(
      `randomWriteArrayOpen`,
      randomSess || RAND,
    );

    this.state = {
      randArr:
        JSON.parse(sessionStorage.getItem(`randomWriteArrayOpen`))
          ?.arr || [],
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

  updateRand = (addition = 0, index) => {
    let rand =
      JSON.parse(sessionStorage.getItem(`randomWriteArrayOpen`))
        ?.arr || [];
    let newRand = [];
    if (addition < 0) {
      const oldValue = rand[index];
      rand.forEach((num, ind) => {
        if (num !== oldValue) {
          if (num > oldValue) {
            newRand.push(num - 1);
          } else {
            newRand.push(num);
          }
        }
      });
    } else {
      const len = Array(addition)
        .fill(0)
        .map((val, ind) => rand.length + ind); //because
      newRand = [...rand, ...len];
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

  moveButton = (event) => {
    if (!this.state.openEdit) {
      if (event.keyCode === 37) {
        //left
        event.stopPropagation();
        event.preventDefault();
        this.handleDecrease();
      } else if (event.keyCode === 39) {
        //right
        event.stopPropagation();
        event.preventDefault();
        this.handleIncrease();
      } else if (event.keyCode === 13) {
        this.setState({ clicked: !this.state.clicked });
      }
    }
  };

  componentDidUpdate = async (prevProps) => {
    const { questions } = this.props;
    try {
      assert.deepStrictEqual(prevProps.questions, questions);
      return;
    } catch {
      let quest = [];
      //If question I brought in isnt equal to present questions, change
      //Current questions array
      if (
        JSON.parse(sessionStorage.getItem(`openDetails`))?.combine
      ) {
        let body = JSON.parse(
          sessionStorage.getItem(`openDetails`),
        ).combine;
        quest = await this.handleCombineSubmit(body);
      } else {
        let body = JSON.parse(
          sessionStorage.getItem(`openDetails`),
        )?.search;
        quest = await this.handleSearch(body);
      }

      if (quest.length === 0) {
        this.props.history.replace(`/tagList`);
      } else {
        if (this.state.questions.length !== quest.length) {
          sessionStorage.setItem(
            `randomWriteArrayOpen`,
            this.updateRand(
              quest.length - this.state.questions.length,
              this.state.number,
            ),
          );
        }
        sessionStorage.setItem(`questionWriteOpen`, quest);
        this.setState({
          questions: quest,
          randArr:
            JSON.parse(sessionStorage.getItem(`randomWriteArrayOpen`))
              ?.arr || [],
          number:
            this.state.number === quest.length
              ? this.state.number - 1
              : this.state.number,
        });
      }
    }
  };
  componentDidMount = () => {
    document.addEventListener('keydown', this.moveButton);
    //Set questions
    //Leave if no questions

    const questions =
      this.props.location?.state?.questionsWriteOpen ||
      JSON.parse(sessionStorage.getItem(`questionWriteOpen`))
        ?.question;
    if (
      !this.props.location?.state?.openDetails?.search &&
      !this.props.location?.state?.openDetails?.combine
    ) {
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
    document.removeEventListener('keydown', this.moveButton);
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

  handleShowAnswer = (shouldShow) => {
    this.setState({
      clicked: shouldShow,
    });
  };

  render() {
    const { tags } = this.props;

    const num = this.state.randArr[this.state.number];
    const quest = this.state.questions[num];
    return (
      <WriteMicro
        tags={tags}
        handleOpenEdit={this.handleOpenEdit}
        handleChange={this.handleChange}
        state={this.state}
        getTag={this.getTag}
        handleEditQuestion={this.handleEditQuestion}
        handleTagSelect={this.handleTagSelect}
        handleDecrease={this.handleDecrease}
        handleIncrease={this.handleIncrease}
        quest={quest}
        handleOpenDelete={this.handleOpenDelete}
        handleShowAnswer={this.handleShowAnswer}
        handleDeleteQuestion={this.handleDeleteQuestion}
      />
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
