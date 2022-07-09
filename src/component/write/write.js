import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './write.css';
import {
  handleFormat,
  handleSelected,
} from '../../microComp/formatter';
import Select from '../select/select';
import '../account/login.css';
import {
  deleteQuestion,
  editQuestion,
} from '../../redux/edit/editQuestion';
import QuestionTitle from '../create/questionTitle';
import { randomize } from '../../microComp/randomize';
import { makeRipple } from '../../microComp/ripple';
import WriteMicro from './writeMicro';
const assert = require('assert');

class Write extends PureComponent {
  constructor(props) {
    super(props);
    let tag =
      this.props.location?.state?.tag ||
      sessionStorage.getItem(`writeTag`);

    const allQuest = !!this.props.location?.state?.allQuest;
    sessionStorage.setItem(`allQuest`, allQuest);
    if (allQuest) {
      if (
        !JSON.parse(sessionStorage.getItem(`randomWriteArray`))?.arr
      ) {
        const RAND = JSON.stringify({
          arr: randomize(this.props.questions.length, true),
        });
        sessionStorage.setItem(`randomWriteArray`, RAND);
      }
    } else if (tag) {
      sessionStorage.setItem(`writeTag`, tag);
      sessionStorage.setItem(
        `writeLink`,
        this.props.location.pathname,
      );
      const questions = this.props.questions.filter(
        (data) => data.tag._id === tag || '',
      );
      if (
        !JSON.parse(sessionStorage.getItem(`randomWriteArray`))?.arr
      ) {
        const RAND = JSON.stringify({
          arr: randomize(questions.length, false),
        });
        sessionStorage.setItem(`randomWriteArray`, RAND);
      }
    }
    this.state = {
      randArr:
        JSON.parse(sessionStorage.getItem(`randomWriteArray`)).arr ||
        [],
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

  handleTagSelect = (tagId) => {
    this.setState({ editObj: { ...this.state.editObj, tag: tagId } });
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

  updateRand = (addition = false) => {
    const rand = JSON.parse(
      sessionStorage.getItem(`randomWriteArray`),
    ).arr;
    if (!addition) {
      rand.pop();
    } else {
      const len = rand.length;
      rand.push(len);
    }
    const RAND = JSON.stringify({
      arr: rand,
    });
    return RAND;
  };
  componentDidUpdate = (prevProps) => {
    const { questions } = this.props;
    try {
      assert.deepStrictEqual(prevProps.questions, questions);
      return;
    } catch {
      //Something was added, removed or editted
      let quest = [];
      const tag = sessionStorage.getItem(`writeTag`);
      const allQuest = sessionStorage.getItem(`allQuest`);
      if (allQuest === `true`) {
        console.log(`all quest is try`);
        quest = questions;
      } else {
        quest = questions.filter(
          (data) => data.tag._id === tag || '',
        );
      }
      if (quest.length === 0) {
        //Happens when all the questions have been deleted
        console.log(this.state.randArr, `move update`);
        this.props.history.replace(`/tagList`);
      } else {
        if (this.state.questions.length !== quest.length) {
          sessionStorage.setItem(
            `randomWriteArray`,
            this.updateRand(
              quest.length > this.state.questions.length,
            ),
          );
        }
        this.setState({
          questions: quest,
          randArr:
            JSON.parse(sessionStorage.getItem(`randomWriteArray`))
              .arr || [],
          number:
            this.state.number === quest.length
              ? this.state.number - 1
              : this.state.number,
        });
      }
    }
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

  componentDidMount = () => {
    document.addEventListener('keydown', this.moveButton);

    let tag =
      this.props.location?.state?.tag ||
      sessionStorage.getItem(`writeTag`);

    const allQuest = !!this.props.location?.state?.allQuest;
    if (allQuest) {
      if (this.props.questions === 0) {
        this.props.history.replace(`/tagList`);
      } else {
        this.setState({ questions: this.props.questions });
      }
    } else if (tag) {
      const questions = this.props.questions.filter(
        (data) => data.tag._id === tag || '',
      );
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
    sessionStorage.removeItem(`writeTag`);
    sessionStorage.removeItem(`writeLink`);
    sessionStorage.removeItem(`allQuest`);
    sessionStorage.removeItem(`randomWriteArray`);
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
      // <div className="examWrite_wrap fdCol">
      //   {this.state.openEdit ? (
      //     <EditWrite
      //       data={{
      //         handleOpenEdit: this.handleOpenEdit,
      //         handleChange: this.handleChange,
      //         state: this.state,
      //         tags: tags,
      //         getTag: this.getTag,
      //         handleEditQuestion: this.handleEditQuestion,
      //         handleTagSelect: this.handleTagSelect,
      //       }}
      //     />
      //   ) : (
      //     ''
      //   )}
      //   <div className="examWrite_header w100">
      //     <div className="content">
      //       <span>
      //         <span>
      //           {sessionStorage.getItem(`allQuest`) === `true`
      //             ? `All Questions`
      //             : `Tag`}
      //         </span>

      //         <span className="write_type_tag">
      //           {quest?.tag?.name || ``}
      //         </span>
      //       </span>
      //     </div>
      //     <Link
      //       to={{ pathname: '/tagList' }}
      //       className="Link inline auto examLogin_link"
      //     >
      //       <button
      //         onClick={(e) => makeRipple(e, true)}
      //         className="btn"
      //       >
      //         View Tags
      //       </button>
      //     </Link>
      //   </div>
      //   <div className="examWrite_body top w100">
      //     <div className="examWrite_left">
      //       <div className="examWrite_left_box w100">
      //         <div
      //           onClick={this.handleOpenEdit}
      //           className="examWrite_inner_float center"
      //         >
      //           <i className="material-icons edit"></i>
      //         </div>
      //         <div
      //           onClick={this.handleOpenDelete}
      //           className="examWrite_inner_float two center"
      //         >
      //           <div
      //             className={`examWrite_inner_delete_pane ${
      //               this.state.openDelete ? '' : 'noShow'
      //             }`}
      //           >
      //             <p>Are you sure you want to delete?</p>
      //             <span>
      //               <button
      //                 onClick={(e) => {
      //                   this.handleDeleteQuestion(
      //                     e,
      //                     this.state.questions[num]._id,
      //                   );
      //                 }}
      //                 className="btn"
      //               >
      //                 Delete
      //               </button>
      //             </span>
      //           </div>
      //           <i className="material-icons close"></i>
      //         </div>
      //         <div className="examWrite_L_header">
      //           Question {this.state.number + 1} of{' '}
      //           {this.state.questions.length}
      //         </div>
      //         <div className="examWrite_L_body">
      //           {this.state.questions.length > 0
      //             ? this.state.questions[num]?.title
      //             : ''}
      //         </div>
      //         <div className="examWrite_L_image">
      //           <div className="examWrite_L_image_inner">
      //             {quest?.imageAddress && (
      //               <img
      //                 alt=""
      //                 className="img_div_cover"
      //                 src={`http://localhost:6060/api/loadImage/${quest.imageAddress}`}
      //               />
      //             )}
      //           </div>
      //         </div>
      //         <div className="examWrite_L_btn">
      //           <button
      //             onClick={(e) => {
      //               makeRipple(e);
      //               this.setState({ clicked: !this.state.clicked });
      //             }}
      //             className="examLogin_btn next btn"
      //           >
      //             {this.state.clicked ? 'Hide' : 'View'} Answer
      //           </button>
      //         </div>
      //       </div>
      //     </div>
      //     <div
      //       className={`examWrite_right ${
      //         !this.state.clicked ? '' : 'active'
      //       }`}
      //     >
      //       {this.state.questions.length > 0
      //         ? formatter(this.state.questions[num]?.details).map(
      //             (data, n) => {
      //               return (
      //                 <p key={`formatter_key${n}`}>
      //                   {transform(data).map((txt, m) => {
      //                     if (typeof txt === `object`) {
      //                       return txt.format === `bold` ? (
      //                         <b key={`formatter_key_bold_${m}`}>
      //                           {txt.text}
      //                         </b>
      //                       ) : txt.format === `underline` ? (
      //                         <span
      //                           key={`formatter_key_span_${m}`}
      //                           style={{
      //                             textDecoration: 'underline',
      //                           }}
      //                         >
      //                           {txt.text}
      //                         </span>
      //                       ) : (
      //                         <span
      //                           key={`formatter_key_italic_${m}`}
      //                           style={{ fontStyle: 'italic' }}
      //                         >
      //                           {txt.text}
      //                         </span>
      //                       );
      //                     } else {
      //                       return txt;
      //                     }
      //                   })}
      //                   <br />
      //                 </p>
      //               );
      //             },
      //           )
      //         : ''}
      //     </div>
      //   </div>
      //   <div className="examWrite_body second w100">
      //     <div className="examWrite_left">
      //       <div className="examWrite_left_inner one">
      //         {this.state.number !== 0 && (
      //           <>
      //             <span
      //               onClick={this.handleDecrease}
      //               className="center"
      //             >
      //               <i className="material-icons keyboard_arrow_left"></i>
      //             </span>
      //             Prev
      //           </>
      //         )}
      //       </div>
      //       <div className="examWrite_left_inner two">
      //         {this.state.number !==
      //           this.state.questions.length - 1 && (
      //           <>
      //             Next
      //             <span
      //               onClick={this.handleIncrease}
      //               className="center"
      //             >
      //               <i className="material-icons keyboard_arrow_right"></i>
      //             </span>
      //           </>
      //         )}
      //       </div>
      //     </div>
      //     <div className="examWrite_right"></div>
      //   </div>
      // </div>
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
)(withRouter(Write));

export class OptionWrite extends PureComponent {
  render() {
    const arr = ['#b6ffb5', '#eeeeee', '#fffad1'];
    return (
      <div className="examWrite_right opt">
        <div className="examWrite_right_box w100">
          <div className="examWrite_right_grid">
            {new Array(30).fill(0).map((a, n) => (
              <div
                key={`examWrite_right_grid_${n}`}
                className="examWrite_right_grid_box"
              >
                <div
                  className="inner center"
                  style={{
                    backgroundColor:
                      arr[Math.floor(Math.random() * 3)],
                  }}
                >
                  {n + 1}
                </div>
              </div>
            ))}
            <div className="float">2 more rows</div>
          </div>
        </div>
      </div>
    );
  }
}

export class EditWrite extends PureComponent {
  constructor(props) {
    super(props);
    this.textareaRef = React.createRef();
  }
  state = {
    question: '',
    selected: [],
    textSelect: '',
  };
  func = (obj) => {
    this.setState(obj, () => console.log(this.state));
  };
  render() {
    const {
      tags,
      handleOpenEdit,
      handleChange,
      state,
      getTag,
      handleEditQuestion,
      handleTagSelect,
    } = this.props.data;

    return (
      <div onClick={handleOpenEdit} className="examWrite_float">
        <div
          onClick={(e) => e.stopPropagation()}
          className="examWrite_float_box"
        >
          <div
            onClick={handleOpenEdit}
            className="examWrite_inner_float center"
          >
            <i className="material-icons close"></i>
          </div>
          <QuestionTitle
            data={{
              onChange: handleChange,
              text: state.editObj.title,
              hasInput: true,
              title: 'Question',
              autoFocus: true,
              title_size: `md`,
              name: 'title',
              placeholder:
                'Example: What is the Axillary Tail of Spence?',
              label: `Kindly type a question that isn't ambiguous`,
            }}
          />
          <QuestionTitle
            data={{
              hasInput: false,
              title_size: `md`,
              title: 'Body',
              labelIcon: true,
              labelFunc: (stringMark = `*`) => {
                console.log(`fordsn`);
                const start = this.state.selected[0];
                const stop = this.state.selected[1];

                if (handleChange) {
                  handleFormat(
                    start,
                    stop,
                    stringMark,
                    state.editObj.details,
                    this.textareaRef.current.name,
                    handleChange,
                    this.func,
                  );
                } else {
                  return;
                }
              },
              label: `This section is  the answer to the question written above`,
            }}
          />
          <textarea
            className="createInputField"
            type="text"
            name="details"
            ref={this.textareaRef}
            id=""
            value={state.editObj.details}
            onChange={handleChange}
            onSelect={() =>
              handleSelected(
                this.textareaRef.current.selectionStart,
                this.textareaRef.current.selectionEnd,
                this.func,
                state.editObj.details,
              )
            }
          />
          <span>
            <Select
              data={{
                selected: getTag(),
                holder: 'Select a Tag',
                data: tags,
                func: handleTagSelect,
              }}
            />
          </span>
          <span>
            <button
              onClick={(e) => {
                makeRipple(e, true);
                handleEditQuestion(e);
              }}
              className="btn"
            >
              Finish
            </button>
          </span>
        </div>
      </div>
    );
  }
}
