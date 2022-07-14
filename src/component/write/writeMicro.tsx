import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
  formatter,
  getFormatResult,
  transform,
} from '../../microComp/formatter';
import { makeRipple } from '../../microComp/ripple';
import { EditWrite } from './write';
//@ts-ignore
import { Link, withRouter } from 'react-router-dom';
import DictPlane from '../../microComp/dictPlane';
import Select from '../select/select';
import TagLeft from '../tag/tagLeft';
import CreateMicro from '../create/createMicro';

type question = {
  _id: string;
  details: string;
  imageAddress: string;
  tag: {
    imageAddress: string;
    name: string;
    _id: string;
  };
  title: string;
};

type writeQuestionState = {
  randArr: number[];
  number: number;
  openDelete: boolean;
  openEdit: boolean;
  clicked: boolean;
  binary: string;
  editObj: {
    tag: { imageAddress: string; name: string; _id: string };
    _id: string;
    title: string;
    details: string;
  };
  questions: question[];
};

type tag = { imageAddress: string; name: string; _id: string };

const selectOptions = [
  {
    name: 'Dictionary',
    _id: '1',
  },
  {
    name: 'Search',
    _id: '2',
  },
  {
    name: 'Add Question',
    _id: '3',
  },
];

const WriteMicro = ({
  tags,
  handleOpenEdit,
  handleChange,
  state,
  getTag,
  handleEditQuestion,
  handleTagSelect,
  handleDecrease,
  handleIncrease,
  quest,
  handleOpenDelete,
  handleDeleteQuestion,
  handleShowAnswer,
}: {
  tags: tag[];
  handleOpenEdit: (event: React.MouseEvent) => void;
  handleChange: (event: React.MouseEvent) => void;
  state: writeQuestionState;
  getTag: () => void;
  handleEditQuestion: (event: React.MouseEvent) => void;
  handleTagSelect: (tagId: string) => void;
  handleDecrease: () => void;
  handleIncrease: () => void;
  quest: question;
  handleOpenDelete: (event: React.MouseEvent) => void;
  handleDeleteQuestion: (event: React.MouseEvent, ID: string) => void;
  handleShowAnswer: (shouldShow: boolean) => void;
}) => {
  const [selected, setSelected] = useState(selectOptions[0]);
  const [viewingStats, setViewingStats] = useState(false);
  const [showFloat, setShowFloat] = useState(false);

  const floatRef = useRef<HTMLDivElement>(null);

  const changeSelected = (_id: string) => {
    const newSelect = selectOptions.find((opt) => opt._id === _id);
    setSelected(newSelect || selected);
  };

  const removeDropOnClick = (e: MouseEvent) => {
    if (
      floatRef.current &&
      !floatRef.current.contains(e.target as Node)
    ) {
      setShowFloat(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', removeDropOnClick);

    return () => {
      window.removeEventListener('click', removeDropOnClick);
    };
  }, []);

  return (
    <div className="examWrite_wrap fdCol">
      <div
        ref={floatRef}
        className={`examWrite_float_left box ${
          showFloat ? `active` : ``
        }`}
      >
        <div className="examWrite_extra_wrapper toFront">
          <Select
            data={{
              selected: selected,
              func: (_id: string) => {
                changeSelected(_id);
              },
              holder: 'Select an Option',
              data: selectOptions,
            }}
            fill
          />
        </div>
        <div className="examWrite_float_bot">
          <div
            className={`examWrite_extra_container ${
              selected.name !== `Dictionary` ? `noShow` : ``
            }`}
          >
            <DictPlane openEdit={state.openEdit} />
          </div>
          <div
            className={`examWrite_extra_container ${
              selected.name !== `Search` ? `noShow` : ``
            }`}
          >
            {/* @ts-ignore */}
            <TagLeft readOnly={true} />
          </div>
          <div
            className={`examWrite_extra_container ${
              selected.name !== 'Add Question' ? `noShow` : ``
            }`}
          >
            <CreateMicro />
          </div>
        </div>
      </div>
      {state.openEdit ? (
        <EditWrite
          data={{
            handleOpenEdit: handleOpenEdit,
            handleChange: handleChange,
            state: state,
            tags: tags,
            getTag: getTag,
            handleEditQuestion: handleEditQuestion,
            handleTagSelect: handleTagSelect,
          }}
        />
      ) : (
        ''
      )}
      <div className="examWrite_header w100">
        <div className="examWrite_extra_wrapper toFront">
          <Select
            data={{
              selected: selected,
              func: (_id: string) => {
                changeSelected(_id);
              },
              holder: 'Select an Option',
              data: selectOptions,
            }}
          />
        </div>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setShowFloat(!showFloat);
          }}
          className="material-icons menu write_menu"
        ></span>
        <div className="content">
          <span>
            <Link
              to={{ pathname: '/tagList' }}
              className="Link inline auto examLogin_link"
            >
              <span className="write_back_wrap box">
                <i className="material-icons arrow_back"></i>
              </span>
            </Link>
            <span className="write_type_tag">
              {quest?.tag?.name || ``}
            </span>
          </span>
        </div>
      </div>
      <div className="examWrite_body top w100">
        <div className="examWrite_extra_wrapper">
          <div
            className={`examWrite_extra_container ${
              selected.name !== `Dictionary` ? `noShow` : ``
            }`}
          >
            <DictPlane openEdit={state.openEdit} />
          </div>
          <div
            className={`examWrite_extra_container ${
              selected.name !== `Search` ? `noShow` : ``
            }`}
          >
            {/* @ts-ignore */}
            <TagLeft readOnly={true} />
          </div>
          <div
            className={`examWrite_extra_container ${
              selected.name !== 'Add Question' ? `noShow` : ``
            }`}
          >
            <CreateMicro />
          </div>
        </div>
        <div className="examWrite_left">
          <div className="examWrite_left_box w100">
            <div
              onClick={handleOpenEdit}
              className="examWrite_inner_float center"
            >
              <i className="material-icons edit"></i>
            </div>
            <div
              onClick={handleOpenDelete}
              className="examWrite_inner_float two center"
            >
              <div
                className={`examWrite_inner_delete_pane ${
                  state.openDelete ? '' : 'noShow'
                }`}
              >
                <p>Are you sure you want to delete?</p>
                <span>
                  <button
                    onClick={(e) => {
                      handleDeleteQuestion(e, quest?._id);
                    }}
                    className="btn"
                  >
                    Delete
                  </button>
                </span>
              </div>
              <i className="material-icons close"></i>
            </div>
            <div className="examWrite_L_header">
              Question {state.number + 1} of {state.questions.length}
            </div>
            <div className="examWrite_L_body">
              {state.questions.length > 0 ? quest?.title : ''}
            </div>
            <div
              onClick={() => setViewingStats(!viewingStats)}
              className="examWrite_L_stats"
            >
              {viewingStats ? 'Go Back' : ' View Stats'}
            </div>
            <div className="examWrite_L_image">
              {viewingStats ? (
                <div className="examWrite_L_image_inner">
                  <h1>Coming Soon...</h1>
                </div>
              ) : (
                <div className="examWrite_L_image_inner">
                  {quest?.imageAddress && (
                    <img
                      alt=""
                      className="img_div_cover"
                      src={`http://localhost:6060/api/loadImage/${quest.imageAddress}`}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="examWrite_L_btn">
              <button
                onClick={(e) => {
                  makeRipple(e);
                  handleShowAnswer(!state.clicked);
                }}
                className="examLogin_btn next btn"
              >
                {state.clicked ? 'Hide' : 'View'} Answer
              </button>
            </div>
          </div>
        </div>
        <div
          className={`examWrite_right ${
            !state.clicked ? '' : 'active'
          }`}
        >
          {state.questions.length > 0
            ? formatter(quest?.details).map((data, n) => {
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
      <div className="examWrite_body second w100">
        <div className="examWrite_extra_wrapper"></div>
        <div className="examWrite_left">
          <div className="examWrite_left_inner one">
            {state.number !== 0 && (
              <>
                <span onClick={handleDecrease} className="center">
                  <i className="material-icons keyboard_arrow_left"></i>
                </span>
                Prev
              </>
            )}
          </div>
          <div className="examWrite_left_inner two">
            {state.number !== state.questions.length - 1 && (
              <>
                Next
                <span onClick={handleIncrease} className="center">
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
};

const mapStateToProps = (state: { loader: { tags: tag[] } }) => ({
  tags: state.loader.tags,
});

export default connect(
  mapStateToProps,
  undefined,
  //@ts-ignore
)(withRouter(WriteMicro));
