import React, { PureComponent } from 'react';
import './questionTitle.css';

class QuestionTitle extends PureComponent {
  state = { text: '' };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const data = this.props?.data;
    return (
      <div className="questionTWrap">
        <div className="QTtitle">{data?.title}</div>
        <div className="QTlabel">{data?.label}</div>
        {data?.hasInput ? (
          <input
            className="w100"
            type="text"
            value={data?.text}
            onChange={this.handleChange}
            name="text"
            placeholder={data?.placeholder ? data?.placeholder : ''}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default QuestionTitle;
