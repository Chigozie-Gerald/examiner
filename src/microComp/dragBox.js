import axios from 'axios';
import React, { PureComponent } from 'react';
import './dragBox.css';
import { transform } from './dictFormat';
import { formatter } from './formatter';

import { connect } from 'react-redux';
import { createQuestion, createTag } from '../redux/create/create';

export class DragBox extends PureComponent {
  constructor(props) {
    super(props);
    this.coordinateX = 0;
    this.coordinateY = 0;
  }
  state = {
    tagCreated: false,
    nextFnc: null,
    searching: false,
    tracker: [],
    pastTracker: [`value`, `index`],
    trackNum: 0,
    text: ``,
    result: [],
    rawResult: { title: ``, details: `` },
    expand: false,
    X: 16,
    Y: window.innerHeight - 352,
    shouldMove: false,
  };

  handleTrack = (dir) => {
    /*
    handle track goes back and fort by delivering a value of
    1 or -1 which signify direction
    a tracker cannot go beyond the array index boundaries
    i.e. between 0 and array.length -1
    This is not the case for the starting point 0
    A workaround which checkes if the value is bigger was implemented
    */
    let trackVal = this.state.trackNum + parseInt(dir);
    const align =
      this.state.notFound && this.state.tracker.length > 1 ? -1 : 0;
    //DO not increase when a result is null
    this.setState(
      {
        trackNum:
          trackVal >= this.state.tracker.length
            ? this.state.trackNum + align
            : trackVal < 0
            ? 0
            : trackVal + align,
      },
      () =>
        this.handleSearch(
          this.container,
          this.state.tracker[this.state.trackNum],
          false,
        ),
      //false was put because we do not want to update
      //the tracker while naviating past histories
    );
  };
  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };
  eventCheck = (elem) => {
    //The function was put to enable efficient removal of event listners
    //The aim is to package (sort of) the function into a single unit
    this.mover(elem, this.coordinateX, this.coordinateY);
  };
  dragMouseDown = (e) => {
    //Will be called when mouse presses down in the vicinity of the element
    this.setState({
      shouldMove: true,
      //This is to tell the events if something had initially started
    });
    this.coordinateX = e.clientX;
    this.coordinateY = e.clientY;
    /*The coordinates above were gotten from
        the elements event variables
        They represent initial values which are independent of the ones the window
        event uses
        The reason for attaching them to a this statement is to ensure its global availability
        This is so because it is necessary for removing event handlers*/
    window.addEventListener(`mousemove`, this.eventCheck);
  };

  closeDragElement = () => {
    //Calls when the mouse is up
    window.removeEventListener(`mousemove`, this.eventCheck);
    this.setState({
      shouldMove: false,
      X: this.container.getBoundingClientRect().left,
      Y: this.container.getBoundingClientRect().top,
      //This sets the style parameters to the final values gotten from the movers
    });
  };

  mover = (e, X, Y) => {
    //Sets the top and left values as element moves
    if (this.state.shouldMove) {
      let leftVal = this.state.X + e.clientX - X,
        topValue = this.state.Y + e.clientY - Y;
      //Space available (up or left) + Initial values - Continuous values
      if (leftVal < 0) leftVal = 0;
      if (topValue < 0) topValue = 0;
      this.container.style.left = `${leftVal}px`;
      this.container.style.top = `${topValue}px`;
    }
  };

  resize = (length, arr, value) => {
    //Function to edit tracker
    //Tracker length should not be more than that specified here
    /*
    When the limiy is about reaching, the tracker 
    ...array pops (removes the oldest element)
    New elements are added at the beginning of the array
    This is a STACK implementation with a `trackLen` number of item limit
    The array is not changed when the result gotten from the search is empty
    */

    /*
    if your history is [1,2,3,4,7] and trackNum is 3 (youre in the `4` page)
    Going forward to another page say `0` will remove other pages in front of 4
    i.e it will turn to [0,4,7] pages [1,2,3] were removed
    */
    const trackerLen = 20;
    if (length) {
      if (arr.length >= trackerLen) {
        if (arr[0] !== value) {
          //Only pop if there are no elements to remove
          //This occurs when this.trackNum is not zero
          if (this.state.trackNum === 0) {
            arr.pop();
          }
          arr.unshift(value);
        }
      } else {
        if (arr[0] !== value) {
          //This if statements ensures shifts only on entry of different values
          arr.unshift(value);
        }
      }
      return arr;
    } else {
      return arr;
    }
  };
  handleSearch = (e, value, update = true) => {
    /*
Update by removing everything in front of you when you just navigated and want to move a letter forward
Hence, this only happens when the Starnum value is not 0
*/

    /*
    Retrieves information from the dictionary api
    Sets the tracker
    If text presented was from a navigation (back and forward icon),
    ... Tracker isnt changed
    Values can be sent through `submit form action`, `navigation`
    or `links` in meaning page 
    All the above value presenters have an update action except navigation
    */

    //Set searching to true
    // On resolve, set searching to false

    this.setState({ searching: true }, () => {
      if (!value) {
        e.preventDefault();
        //Sets the value to the state text value if action was from submit
        //This is because the submit action does not deliver any second parameter
        //This helps to distinguish between the submit action and others
        //It was done because `e` is only gotten on a submit action
        //And e cannot be gotten from other actions
        value = this.state.text;
      }
      const arr = this.state.tracker;
      if (update) {
        arr.splice(0, this.state.trackNum);
      }
      this.setState({ text: value }, () => {
        const body = { text: this.state.text };
        axios
          .post(
            'http://localhost:6060/api/dictSearch',
            JSON.stringify(body),
            {
              headers: {
                'content-type': 'application/json',
              },
            },
          )
          .then((details) => {
            const result = details?.data.map((data) =>
              formatter(data).map((da, n) => transform(da)),
            );

            this.setState({
              searching: false,
              result,
              rawResult:
                details?.data?.length > 0
                  ? { title: value, details: details?.data }
                  : { title: ``, details: `` },
              notFound: result.length ? false : true,
              trackNum: update ? 0 : this.state.trackNum,
              tracker: update
                ? this.resize(result.length, arr, value)
                : this.state.tracker,
            });
          })
          .catch(() => {
            return;
          });
      });
    });
  };
  expand = () => {
    /*
    this.container.getBoundingClientRect() gives you the height width
    ... and distance between the div and the top, left, right and bottom
    This function is used for increasing dictionary window size
    The dictionary cannot be bigger than 50 percent of the windows height
    Also no update happens when the box is 36px above the bottom of the page 
    */
    const height = window.innerHeight;
    const bot = this.container.getBoundingClientRect().bottom;
    const diff = height - bot;
    let finalVal;
    if (
      diff <= 36 &&
      this.container.getBoundingClientRect().height === 160
    ) {
      return;
    } else {
      this.setState({ expand: !this.state.expand }, () => {
        if (this.state.expand) {
          if (diff > 0.6 * height) {
            finalVal = 0.5 * height;
          } else {
            if (diff <= 36) {
              finalVal = 0;
            } else {
              finalVal = diff - 16;
            }
          }
          this.container.style.height = `${
            finalVal + this.container.getBoundingClientRect().height
          }px`;
        } else {
          this.container.style.height = `10rem`;
        }
      });
    }
  };

  handleFav = () => {
    const TagName = `Vocabulary (en)`;
    const man = (name, arr) =>
      arr && Array.isArray(arr)
        ? arr
        : this.props.tags.filter(
            (data) => data?.name === name && data,
          );
    const available = man(TagName).length > 0;
    if (this.state.rawResult?.details.length > 0) {
      if (available) {
        const revolver = this.state.rawResult.details.map((det, n) =>
          transform(det, true)
            .join(``)
            .replace(/(?:\r\n|\n)/g, `\n • `),
        );
        this.props.createQuestion([
          {
            tag: man(TagName)[0]._id,
            title: this.state.rawResult.title,
            details: revolver.join(`\n\n`),
            image: '',
          },
        ]);
      } else {
        this.props.createTag({ name: TagName });
        this.setState({
          nextFnc: {
            getTag: man,
            title: this.state.rawResult.title,
            details: this.state.rawResult.details,
            name: TagName,
          },
        });
        /*this.props.createQuestion([
          {
            tag: man(TagName)[0]._id,
            title: this.state.rawResult.title,
            details: this.state.rawResult.details,
            image: '',
          },
        ]);*/
      }
    } else {
      return;
    }
  };

  assignRef = (e) => (this.container = e);
  componentDidMount() {
    this.setState({
      Y: this.container.getBoundingClientRect().top,
    });
    //Sets the space above the element before any action is taken
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.tags.length < this.props.tags.length &&
      this.state.nextFnc
    ) {
      const tag = this.state.nextFnc.getTag(
        this.state.nextFnc.name,
      )[0]?._id;

      this.setState(
        {
          nextFnc: null,
        },
        tag &&
          this.props.createQuestion([
            {
              tag,
              title: this.state.rawResult.title,
              details: this.state.rawResult.details,
              image: '',
            },
          ]),
      );
    }
  }
  componentWillUnmount() {
    window.removeEventListener(`mousemove`, this.mover);
  }

  render() {
    return (
      <div ref={this.assignRef} className="dragBox_wrap box">
        <div className="dragBox_header w100">
          <div className="dragBox_bottom_left">
            <i
              disabled={
                !this.state.notFound &&
                this.state.trackNum >= this.state.tracker.length - 1
              }
              onClick={() => {
                if (
                  !this.state.notFound &&
                  this.state.trackNum >= this.state.tracker.length - 1
                )
                  return;
                this.handleTrack(1);
              }}
              className="material-icons keyboard_arrow_left"
            ></i>
            <i
              disabled={this.state.trackNum === 0}
              onClick={() => {
                if (this.state.trackNum === 0) return;
                this.handleTrack(-1);
              }}
              className="material-icons keyboard_arrow_right"
            ></i>
          </div>
          <form action="POST" onSubmit={this.handleSearch}>
            <input
              autoFocus={true}
              type="text"
              onChange={this.handleChange}
              placeholder="Dictionary"
              className="dragBox_input"
              value={this.state.text}
            />
          </form>

          <div
            className="move_pad center"
            onMouseDown={this.dragMouseDown}
            onMouseUp={this.closeDragElement}
          >
            <i className="material-icons drag_indicator"></i>
          </div>
        </div>
        <div
          className={`dragBox_body scroller ${
            this.state.expand ? 'open' : ''
          } w100`}
        >
          <div className="dragBox_part"></div>
          {this.state.result.length && !this.state.searching ? (
            this.state.result.map((data, n) => (
              <div
                key={`formatter_key_sense_${n}`}
                className="sense_sect"
              >
                {data.map((dtxt, m) => (
                  <div key={`formatter_key_dict_${m}`}>
                    <p key={`formatter_key${n}`}>
                      {dtxt.map((txt, nd) =>
                        typeof txt === `object` ? (
                          txt.format === `link` ? (
                            <React.Fragment
                              key={`formatter_key_link_${nd}_${m}_${n}`}
                            >
                              {
                                /*
                            if first paragraph, attach meaning number to first element n
                            Other paragraphs attach their paragraph numbers m
                            if nd is zero and aslo, attach n, if not attached nd
                            */

                                m === 0 && nd === 0
                                  ? `${n + 1}. `
                                  : nd === 0
                                  ? `${m}. `
                                  : ``
                              }
                              <b
                                style={{
                                  fontStyle:
                                    txt.both > 0
                                      ? 'italic'
                                      : 'inherit',
                                }}
                                onClick={() =>
                                  this.handleSearch(
                                    this.container,
                                    txt.text,
                                  )
                                }
                                dangerouslySetInnerHTML={{
                                  __html: txt.text,
                                }}
                              >
                                {/*txt.text*/}
                              </b>
                            </React.Fragment>
                          ) : (
                            <React.Fragment
                              key={`formatter_key_info_${nd}_${m}_${n}`}
                            >
                              {
                                /*
                          if nd is zero, attach n, if not attached nd
                          */
                                m === 0 && nd === 0
                                  ? `${n + 1}. `
                                  : nd === 0
                                  ? `${m}. `
                                  : ``
                              }
                              <span
                                style={{
                                  fontStyle: 'italic',
                                  fontWeight:
                                    txt.both > 0 ? `bold` : `inherit`,
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: txt.text,
                                }}
                              >
                                {/*txt.text*/}
                              </span>
                            </React.Fragment>
                          )
                        ) : m === 0 && nd === 0 ? (
                          <React.Fragment
                            key={`formatter_key_em1_${nd}_${m}_${n}`}
                          >
                            {`${n + 1}. `}
                            <span
                              dangerouslySetInnerHTML={{
                                __html: txt,
                              }}
                            ></span>
                          </React.Fragment>
                        ) : /*`${n + 1}. ${txt}`*/
                        nd === 0 ? (
                          <React.Fragment
                            key={`formatter_key_em2_${nd}_${m}_${n}`}
                          >
                            {`${m}. `}
                            <span
                              dangerouslySetInnerHTML={{
                                __html: txt,
                              }}
                            ></span>
                          </React.Fragment>
                        ) : (
                          /*`${m}. ${txt}`*/ <span
                            key={`formatter_key_ord_${nd}_${m}_${n}`}
                            dangerouslySetInnerHTML={{
                              __html: txt,
                            }}
                          ></span>
                          /*txt*/
                        ),
                      )}
                      <br />
                    </p>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div
              key={`formatter_key_empty`}
              className="drag_box_empty center"
            >
              {this.state.searching ? (
                <React.Fragment>
                  <div className="blinkers one"></div>
                  <div className="blinkers two"></div>
                  <div className="blinkers three"></div>
                </React.Fragment>
              ) : this.state.text ? (
                `Nothing was found`
              ) : (
                `Start Searching...`
              )}
            </div>
          )}
        </div>
        <div className="dragBox_bottom w100">
          <div className="dragBox_bottom_btn_wrap">
            <div
              className="dragBox_bottom_btn center box"
              onClick={this.handleFav}
            >
              Add
            </div>
          </div>
          <i
            onClick={this.expand}
            className={`material-icons expand_less ${
              this.state.expand ? 'reverse' : ''
            }`}
          ></i>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tags: state.loader.tags,
});

const mapDispatchToProps = (dispatch) => ({
  createQuestion: (body) => dispatch(createQuestion(body)),
  createTag: (body) => dispatch(createTag(body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DragBox);
