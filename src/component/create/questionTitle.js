import React, { useEffect, useState } from 'react';
import './questionTitle.css';

const QuestionTitle = ({ data }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const downButton = (event) => {
      if (data?.labelFunc) {
        if (event.ctrlKey && event.keyCode === 66) {
          event.stopPropagation();
          event.preventDefault();
          data?.labelFunc();
        } else if (event.ctrlKey && event.keyCode === 73) {
          event.stopPropagation();
          event.preventDefault();
          data?.labelFunc(`<`);
        } else if (event.ctrlKey && event.keyCode === 85) {
          event.stopPropagation();
          event.preventDefault();
          data?.labelFunc(`~`);
        }
      }
    };
    document.addEventListener('keydown', downButton);

    return () => {
      document.removeEventListener('keydown', downButton);
    };
  }, [data]);

  const handleShow = () => {
    setShow(!show);
  };
  const size = [1.15, 1, 0.75];
  const sizeFont = ['lg', 'md', 'sm'];
  const fontSize = data?.title_size;
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
          <div className="QTlabel w100">{data?.label}</div>
        </div>
        <div className="questionFormat_cont">
          {data?.labelIcon && (
            <div className="questionFormat">
              <span
                onClick={handleShow}
                className="questionBoldWrap center"
              >
                <i className="material-icons sort"></i>
                {show && (
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
};

export default QuestionTitle;
