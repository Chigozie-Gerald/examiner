import React, { PureComponent } from 'react';
import QuestionTitle from '../create/questionTitle';
import './histoCreate.css';

class HistoCreate extends PureComponent {
  state = {
    isOpen: '',
    title: '',
    detailText: '',
    edit_detailText: '',
    details: [],
    image: 'map_wrap',
    questions: [],
    current: '',
  };
  handleAdd = (num) => {
    console.log(this.state.current, num, 'values');
    if (typeof num === 'number') {
      console.log('here ooo', num);
      this.setState({
        questions: this.state.questions.map((data, n) => {
          if (n !== num) {
            return data;
          } else {
            return {
              title: this.state.title,
              details: this.state.details,
              image: this.state.image,
            };
          }
        }),
        title: '',
        detailText: '',
        details: [],
        image: '',
        current: '',
      });
      return;
    }
    this.setState({
      questions: [
        ...this.state.questions,
        {
          title: this.state.title,
          details: this.state.details,
          image: this.state.image,
        },
      ],
      title: '',
      detailText: '',
      details: [],
      image: '',
      current: '',
    });
  };
  handleChange = (e) => {
    this.setState({ title: e.target.value });
  };
  handleDetailTextEdit = (e, num, func) => {
    this.setState({
      details: this.state.details.map((data, n) => {
        if (n !== num) {
          return data;
        } else {
          return this.state.edit_detailText;
        }
      }),
      edit_detailText: '',
    });
    if (typeof func === 'function') {
      func();
    }
  };
  handleOpen = (num) => {
    this.setState({ isOpen: num });
  };
  handleClose = () => {
    this.setState({ isOpen: '' });
  };
  Edit_handleDetailText = (e) => {
    this.setState({ edit_detailText: e.target.value });
  };
  handleDetailText = (e) => {
    this.setState({ detailText: e.target.value });
  };
  handleDetailRemove = (num) => {
    this.setState({
      details: this.state.details.filter((a, n) => n !== num),
    });
  };
  handleQuestionRemove = (num) => {
    this.setState({
      questions: this.state.questions.filter((a, n) => n !== num),
    });
  };
  handleQuestionDrop = (data, num) => {
    console.log(num, 'my num');
    this.setState({
      title: data.title,
      detailText: data.detailText,
      details: data.details,
      image: data.image,
      current: num,
    });
  };
  handleDetails = () => {
    this.setState({
      details: [...this.state.details, this.state.detailText],
      detailText: '',
    });
  };
  render() {
    return (
      <div
        className={`map_wrap white ${
          typeof this.state.current === 'number' ? 'blank' : ''
        }`}
      >
        <div className="map_box histo fdCol">
          {typeof this.state.current === 'number' ? (
            <div className="edit_float">Edit Mode</div>
          ) : (
            ''
          )}
          <div className="histo_top">
            <div className="histo_title fdCol">
              <QuestionTitle
                data={{
                  onChange: this.handleChange,
                  text: this.state.title,
                  hasInput: true,
                  title: 'Title',
                  placeholder: 'Example: Head and Neck Anatomy Test',
                  label:
                    "Suggest a title for the exam you're about creating",
                }}
              />
              <div className="histo_title_bottom fdCol">
                <div className="histo_title_header_body"></div>
              </div>
            </div>

            <div className="histo_right">
              <QuestionTitle
                data={{
                  hasInput: false,
                  title: 'Image',
                }}
              />
              <div className="histo_image">
                <div className="histo_image_float center fdCol">
                  <p>Drop or Select an Image</p>
                  <label>
                    <input
                      className="center"
                      type="file"
                      name="histo_image"
                      id=""
                    />
                    Choose an Image
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="histo_bottom fdCol">
            <QuestionTitle
              data={{
                hasInput: false,
                title: 'Details',
              }}
            />

            <div className="histo_details">
              <div className="histo_details_type">
                <HistoTextArea
                  data={{
                    handleDetails: this.handleDetails,
                    autoFocus: true,
                    button: 'Add',
                    detailText: this.state.detailText,
                    handleDetailText: this.handleDetailText,
                  }}
                />
              </div>
            </div>
            <div className="histo_details_done">
              {this.state.details.map((data, num) => (
                <div
                  className="histo_details_box"
                  key={`mykey_${num}`}
                >
                  <span className="ellipsis">{data}</span>
                  <span
                    onClick={() => this.handleOpen(num)}
                    className="center"
                  ></span>
                  <span
                    onClick={() => this.handleDetailRemove(num)}
                    className="center"
                  >
                    &times;
                  </span>
                  <div
                    className={`histo_details_box_float ${
                      this.state.isOpen.toString() === num.toString()
                        ? 'show'
                        : ''
                    }`}
                  >
                    <HistoTextArea
                      data={{
                        handleDetails: this.handleDetailTextEdit,
                        close: this.handleClose,
                        autoFocus: true,
                        num: num,
                        button: '+',
                        width: true,
                        detailText: this.state.edit_detailText,
                        handleDetailText: this.Edit_handleDetailText,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            disabled={
              this.state.details.length <= 0 || !this.state.title
            }
            onClick={() => {
              if (
                this.state.details.length <= 0 ||
                !this.state.title
              ) {
                console.log('still works');
                return;
              }
              this.handleAdd(
                typeof this.state.current === 'number'
                  ? this.state.current
                  : false,
              );
            }}
            className="btn histo_btn"
          >
            {typeof this.state.current === 'number'
              ? `Edit Question`
              : 'Add another question'}
          </button>
        </div>
        <div className="map_box map_box_left fdCol">
          <QuestionTitle
            data={{
              hasInput: false,
              title: `Questions Added: ${this.state.questions.length}`,
            }}
          />
          <div className="qListWrap">
            {this.state.questions.map((data, num) => (
              <HistoPane
                key={`histoPane_${num}`}
                data={data}
                misc={{
                  num: num,
                  func: this.handleQuestionRemove,
                  drop: this.handleQuestionDrop,
                }}
              />
            ))}
          </div>

          <div className="map_box_left_btn_wrap center">
            <button
              onClick={() => console.log(this.state.questions)}
              className="btn w100"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default HistoCreate;

class HistoPane extends PureComponent {
  render() {
    const data = this.props.data;
    const misc = this.props.misc;
    return (
      <div className="histoPane fdCol">
        <div>
          <div className="histoPane_num">
            Question: {misc.num + 1}
          </div>
        </div>
        <div className="histoPane_bottom">
          <div className="histoPane_left">
            <div className="histoPane_left_img"></div>
          </div>
          <div className="histoPane_mid fdCol">
            <span>{data.title}</span>
            <span>Details: {data.details.length}</span>
          </div>
          <div className="histoPane_right">
            <div
              onClick={() => misc.drop(data, misc.num)}
              className="histoPane_right_icon one center"
            ></div>
          </div>
          <div className="histoPane_right">
            <div
              onClick={() => misc.func(misc.num)}
              className="histoPane_right_icon center"
            >
              &times;
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class HistoTextArea extends PureComponent {
  render() {
    const data = this.props.data;
    return (
      <>
        <textarea
          className="histo_textarea w100"
          name=""
          onChange={data.handleDetailText}
          value={data.detailText}
          autoFocus={data.autoFocus}
          id=""
          cols="30"
          rows="10"
          placeholder="Text goes here"
        ></textarea>
        <button
          style={{
            width: data.width ? '2rem' : 'barauto',
            minWidth: data.width ? '2rem' : 'barauto',
          }}
          onClick={(e) => {
            if (!data.detailText) {
              return;
            }
            data.handleDetails(
              e,
              data.num,
              data.close && typeof data.close === 'function'
                ? data.close
                : '',
            );
          }}
          className="btn"
        >
          {data.button}
        </button>
      </>
    );
  }
}
