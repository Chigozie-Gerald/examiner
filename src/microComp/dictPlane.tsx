import axios from 'axios';
import React, {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import './dragBox.css';
import { transform } from './dictFormat';
import { formatter } from './formatter';

import { connect } from 'react-redux';
import { createQuestion, createTag } from '../redux/create/create';

type tag = { _id: string; name: string; imageAddress: string };
const DictPlane = ({
  tags,
  openEdit,
  createQuestion,
  createTag,
}: {
  tags: tag[];
  openEdit: boolean;
  createQuestion: (data: any) => void;
  createTag: (data: any) => void;
}) => {
  const assignRef = useRef<HTMLDivElement>(null);
  const assignBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [nextFnc, setNextFnc] = useState<{
    getTag: (...args: string[]) => tag[];
    title: string;
    details: string[];
    name: string;
  } | null>(null);
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [tracker, setTracker] = useState<string[]>([]);
  const [trackNum, setTrackNum] = useState(0);
  const [text, setText] = useState(``);
  const [result, setResult] = useState<
    (string | { text: string; format: string; both: number })[][][]
  >([]);
  const [rawResult, setRawResult] = useState({
    title: ``,
    details: [],
    added: false,
  });

  const handleTrack = (dir: number) => {
    /*
    handle track goes back and fort by delivering a value of
    1 or -1 which signify direction
    a tracker cannot go beyond the array index boundaries
    i.e. between 0 and array.length -1
    This is not the case for the starting point 0
    A workaround which checkes if the value is bigger was implemented
    */

    let trackVal = trackNum + dir;
    const align = notFound && tracker.length > 1 ? -1 : 0;
    const resolveTrack =
      trackVal >= tracker.length
        ? trackNum + align
        : trackVal < 0
        ? 0
        : trackVal + align;
    //DO not increase when a result is null
    setTrackNum(resolveTrack);
    handleSearch(
      undefined,
      tracker[resolveTrack],
      false,
      resolveTrack,
    );
    //false was put because we do not want to update
    //the tracker while naviating past histories
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const resize = (
    length: number,
    arr: string[],
    value: string,
    trackNumValue: number,
  ) => {
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
          if (trackNumValue === 0) {
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

  useEffect(() => {
    const preventBlur = (event: KeyboardEvent) => {
      if (!openEdit) {
        const key = event.key;
        const isForbidden =
          !(
            key === `Backspace` ||
            key === ` ` ||
            (key.length === 1 && /[A-Za-z]/.test(key))
          ) ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey;
        if (!isForbidden) {
          inputRef.current?.focus();
        }
      }
    };
    document.addEventListener('keydown', preventBlur);

    return () => {
      document.removeEventListener('keydown', preventBlur);
    };
  }, [openEdit]);

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement> | MouseEvent | undefined,
    value: string = ``,
    update = true,
    trackerNumValue: number,
  ) => {
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

    setSearching(true);
    if (!value) {
      if (e) {
        e.preventDefault();
      }
      //Sets the value to the state text value if action was from submit
      //This is because the submit action does not deliver any second parameter
      //This helps to distinguish between the submit action and others
      //It was done because `e` is only gotten on a submit action
      //And e cannot be gotten from other actions
      value = text;
    }
    if (!value.trim()) {
      setSearching(false);
      return;
    }
    const arr = tracker;
    if (update) {
      arr.splice(0, trackNum);
    }
    setText(value);
    const body = { text: value.trim() };
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
        const result = details?.data?.text.map((data: string) =>
          formatter(data).map((da, n) => transform(da)),
        );

        setSearching(false);
        setResult([...result]);
        setRawResult(
          details?.data?.text?.length > 0
            ? {
                title: value,
                details: details?.data.text,
                added: details?.data?.added,
              }
            : { title: ``, details: ``, added: false },
        );
        setNotFound(result.length ? false : true);
        setTrackNum(update ? 0 : trackerNumValue);
        setTracker([
          ...(update
            ? resize(result.length, arr, value, trackerNumValue)
            : tracker),
        ]);
      })
      .catch((e) => {
        setSearching(false);
        alert(e.response?.data || `Cannot find that word`);
        return;
      });
  };

  const handleFav = () => {
    const TagName = `Vocabulary (en)`;
    const man = (name: string) =>
      tags.filter((data) => data?.name === name && data);
    const available = man(TagName).length > 0;
    if (rawResult?.details.length > 0) {
      if (available) {
        const revolver = rawResult.details.map((det, n) =>
          transform(det, true)
            .join(``)
            .replace(/(?:\r\n|\n)/g, `\n • `),
        );
        createQuestion([
          {
            tag: man(TagName)[0]._id,
            title: rawResult.title,
            details: revolver.join(`\n\n`),
            image: '',
          },
        ]);
      } else {
        createTag({ name: TagName });
        setNextFnc({
          getTag: man,
          title: rawResult.title,
          details: rawResult.details,
          name: TagName,
        });
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    if (nextFnc) {
      const tag = nextFnc.getTag(nextFnc.name)[0]?._id;

      setNextFnc(null);
      if (tag) {
        createQuestion([
          {
            tag,
            title: rawResult.title,
            details: rawResult.details,
            image: '',
          },
        ]);
      }
    }
  }, [
    tags,
    nextFnc,
    createQuestion,
    rawResult.title,
    rawResult.details,
  ]);

  const leftBlur = () => !notFound && trackNum >= tracker.length - 1;
  const rightBlur = () => trackNum === 0;

  return (
    <div
      ref={assignRef}
      className={`dragBox_wrap placed box ${
        focused ? `focused` : ``
      }`}
    >
      <div className="dragBox_header w100">
        <div className="dragBox_bottom_left">
          <i
            onClick={() => {
              if (leftBlur()) return;
              handleTrack(1);
            }}
            className={`material-icons keyboard_arrow_left ${
              leftBlur() ? `navigator_disabled` : ``
            }`}
          ></i>
          <i
            onClick={() => {
              if (rightBlur()) return;
              handleTrack(-1);
            }}
            className={`material-icons keyboard_arrow_right ${
              rightBlur() ? `navigator_disabled` : ``
            }`}
          ></i>
        </div>
        <form
          action="POST"
          onKeyDown={(e) => e.stopPropagation()}
          onSubmit={(e) => handleSearch(e, undefined, true, trackNum)}
        >
          <input
            type="text"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            ref={inputRef}
            onChange={handleChange}
            placeholder="Dictionary"
            className="dragBox_input"
            value={text}
          />
        </form>
      </div>
      <div
        ref={assignBoxRef}
        className={`dragBox_body scroller w100`}
      >
        <div className="dragBox_part"></div>
        {result.length && !searching ? (
          result.map((data, n) => (
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
                                  txt.both > 0 ? 'italic' : 'inherit',
                              }}
                              onClick={(e) =>
                                handleSearch(
                                  e,
                                  txt.text,
                                  true,
                                  trackNum,
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
            {searching ? (
              <React.Fragment>
                <div className="blinkers one"></div>
                <div className="blinkers two"></div>
                <div className="blinkers three"></div>
              </React.Fragment>
            ) : text ? (
              !notFound &&
              trackNum >= tracker.length - 1 &&
              trackNum === 0 ? (
                ``
              ) : (
                `Nothing was found`
              )
            ) : (
              `Start Searching...`
            )}
          </div>
        )}
      </div>
      <div className="dragBox_bottom w100">
        <div className="dragBox_bottom_btn_wrap">
          {rawResult.details && (
            <div
              className={`dragBox_bottom_btn center box ${
                rawResult.added ? `mute` : ``
              }`}
              onClick={() => {
                if (!rawResult.added && rawResult.details) {
                  const added = {
                    ...rawResult,
                    added: true,
                  };
                  setRawResult({ ...added });
                  handleFav();
                } else {
                  return;
                }
              }}
            >
              {rawResult.added ? `Already Added` : `Add`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: { loader: { tags: any } }) => ({
  tags: state.loader.tags,
});

const mapDispatchToProps = (dispatch: (...args: any[]) => void) => ({
  createQuestion: (
    body: [
      {
        tag: string;
        title: string;
        details: string;
        image: File | string;
      },
    ],
  ) => dispatch(createQuestion(body)),
  createTag: (body: { name: string }) => dispatch(createTag(body)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DictPlane);
