import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './write.css';
import '../account/login.css';

class Write extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      number: 0,
      questions: [],
    };
  }

  handleIncrease = () => {
    if (this.state.number === this.state.questions.length - 1) {
      return;
    } else {
      this.setState({
        number: this.state.number + 1,
        clicked: false,
      });
    }
  };

  componentDidMount = () => {
    const tag = this.props.location?.state?.tag;
    const questions = this.props.questions.filter(
      (data) => data.tag._id === tag || ``,
    );
    if (questions.length === 0) {
      this.props.history.replace(`/tagList`);
    } else {
      this.setState({ questions });
    }
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
    return (
      <div className="examWrite_wrap fdCol">
        <div className="examWrite_header w100">
          <div className="content">
            <span>
              <span>{this.state.questions[0]?.tag?.name}</span>
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
        <div className="examWrite_body w100">
          <div className="examWrite_left">
            <div className="examWrite_left_box w100">
              <div className="examWrite_L_header">
                Question {this.state.number + 1} of{' '}
                {this.state.questions.length}
              </div>
              <div className="examWrite_L_body">
                {this.state.questions.length > 0
                  ? this.state.questions[this.state.number].title
                  : ''}
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
            className={`examWrite_right center ${
              !this.state.clicked ? '' : 'active'
            }`}
          >
            {this.state.questions.length > 0
              ? this.state.questions[this.state.number].details
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
});

const mapDispatchToProps = (dispatch) => ({});

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
              <div className="examWrite_right_grid_box">
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
