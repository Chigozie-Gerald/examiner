import React from 'react';
import { connect } from 'react-redux';
import { formatter, transform } from '../../microComp/formatter';
import { makeRipple } from '../../microComp/ripple';
import { EditWrite } from './write';
//@ts-ignore
import { Link, withRouter } from 'react-router-dom';
import DictPlane from '../../microComp/dictPlane';

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
  return (
    <div className="examWrite_wrap fdCol">
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
        <div className="examWrite_dict_wrapper"></div>
        <div className="content">
          <span>
            <span>
              {sessionStorage.getItem(`allQuest`) === `true`
                ? `All Questions`
                : `Tag`}
            </span>

            <span className="write_type_tag">
              {quest?.tag?.name || ``}
            </span>
          </span>
        </div>
        <Link
          to={{ pathname: '/tagList' }}
          className="Link inline auto examLogin_link"
        >
          <button
            onClick={(e) => makeRipple(e, true)}
            className="btn"
          >
            View Tags
          </button>
        </Link>
      </div>
      <div className="examWrite_body top w100">
        <div className="examWrite_dict_wrapper">
          <div className="examWrite_dict_container">
            <DictPlane openEdit={state.openEdit} />
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
                    {(
                      transform(data) as (
                        | string
                        | {
                            format: `bold` | `underline` | `italic`;
                            text: string;
                          }
                      )[]
                    ).map((txt, m) => {
                      if (typeof txt === `object`) {
                        return txt.format === `bold` ? (
                          <b key={`formatter_key_bold_${m}`}>
                            {txt.text}
                          </b>
                        ) : txt.format === `underline` ? (
                          <span
                            key={`formatter_key_span_${m}`}
                            style={{
                              textDecoration: 'underline',
                            }}
                          >
                            {txt.text}
                          </span>
                        ) : (
                          <span
                            key={`formatter_key_italic_${m}`}
                            style={{ fontStyle: 'italic' }}
                          >
                            {txt.text}
                          </span>
                        );
                      } else {
                        return txt;
                      }
                    })}
                    <br />
                  </p>
                );
              })
            : ''}
        </div>
      </div>
      <div className="examWrite_body second w100">
        <div className="examWrite_dict_wrapper"></div>
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
)(withRouter(WriteMicro));
