import React, { PureComponent } from 'react';
import './questionTitle.css';

class QuestionTitle extends PureComponent {
  state = { show: false };

  handleShow = () => {
    this.setState({ show: !this.state.show });
  };
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
        <div className="QTwrapper w100">
          <div className="fdCol QTHeadSect">
            <div
              style={{ fontSize: `${font()}rem` }}
              className="QTtitle ellipsis"
            >
              {data?.title}
            </div>
            <div className="QTlabel w100 ellipsis">{data?.label}</div>
          </div>
          {data?.labelIcon && (
            <div className="questionFormat">
              <span
                onClick={this.handleShow}
                className="questionBoldWrap center"
              >
                <i className="material-icons sort"></i>
                {this.state.show && (
                  <div className="questionBoldWrap_sort box">
                    Are you sure you want to Sort
                    <button className="btn" onClick={data?.sort}>
                      Click here
                    </button>
                  </div>
                )}
              </span>
              <span
                onClick={() => data?.labelFunc(`<`)}
                className="questionBoldWrap center"
              >
                <i className="material-icons format_italic"></i>
              </span>
              <span
                onClick={() => data?.labelFunc(`~`)}
                className="questionBoldWrap center"
              >
                <i className="material-icons format_underline"></i>
              </span>
              <span
                onClick={() => data?.labelFunc()}
                className="questionBoldWrap center"
              >
                <i className="material-icons format_bold"></i>
              </span>
            </div>
          )}
        </div>

        {data?.hasInput ? (
          <input
            className={`w100 ${data?.hasIcon ? 'iconed' : ''}`}
            type="text"
            autoComplete="off"
            autoFocus={data.autoFocus || false}
            value={data?.text}
            onChange={data.onChange}
            name={data?.name || 'text'}
            placeholder={data?.placeholder ? data?.placeholder : ''}
          />
        ) : (
          ''
        )}
        {data?.hasInput && data?.hasIcon ? (
          <div className="QTlabelIcon">
            <label htmlFor="inputFile" className="center">
              <i className="material-icons image"></i>
            </label>
            <input
              onChange={data?.iconChange}
              type="file"
              name="file"
              className="noShow"
              id="inputFile"
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default QuestionTitle;
