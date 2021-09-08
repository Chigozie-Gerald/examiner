import React, { PureComponent } from 'react';
import './questionTitle.css';

class QuestionTitle extends PureComponent {
  render() {
    const data = this.props?.data;
    const size = [1.15, 1, 0.75];
    const sizeFont = ['lg', 'md', 'sm'];
    const fontSize = this.props?.data?.title_size;
    const font = () =>
      fontSize
        ? sizeFont.indexOf(fontSize) !== -1
          ? size[sizeFont.indexOf(fontSize)]
          : size[1]
        : size[1];

    return (
      <div className="questionTWrap">
        <div style={{ fontSize: `${font()}rem` }} className="QTtitle">
          {data?.title}
        </div>
        <div className="QTlabel">{data?.label}</div>
        {data?.hasInput ? (
          <input
            className="w100"
            type="text"
            autoFocus={data.autoFocus || false}
            value={data?.text}
            onChange={data.onChange}
            name={data?.name || 'text'}
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
