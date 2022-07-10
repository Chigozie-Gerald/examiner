import React, { useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  handleFormat,
  handleSelected,
} from '../../microComp/formatter';
import { makeRipple } from '../../microComp/ripple';
import { createQuestion } from '../../redux/create/create';
import Select from '../select/select';
import './createMicro.css';

type tag = { imageAddress: string; name: string; _id: string };

const mapStateToProps = (state: { loader: { tags: tag[] } }) => ({
  tags: state.loader.tags,
});

const mapDispatchToProps = (dispatch: any) => ({
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
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type connectT = ConnectedProps<typeof connector>;

const CreateMicro = (props: connectT) => {
  const { tags, createQuestion } = props;
  const [selected, setSelected] = useState<tag | null>(null);
  const [title, setTitle] = useState(``);
  const [details, setDetails] = useState(``);
  const [selectedTextArray, setSelectedTextArray] = useState<
    [number, number] | []
  >([]);

  const changeSelected = (_id: string) => {
    const newSelect = tags.find((opt) => opt._id === _id);
    setSelected(newSelect || selected);
  };

  const handleFav = () => {
    if (selected && title && details) {
      createQuestion([
        {
          tag: selected._id,
          title: title,
          details: details,
          image: '',
        },
      ]);
    } else {
      return;
    }
  };

  const interFuncDetails = (formatObj: {
    target: { name: string; value: string };
  }) => {
    const value = formatObj.target.value;
    setDetails(value);
  };

  const interFuncSelected = (formatObj: { selected: [] }) => {
    setSelectedTextArray([...formatObj.selected]);
  };

  const selectFunc = (object: {
    selected: [number, number];
    textSelect: string;
  }) => {
    setSelectedTextArray([...object.selected]);
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatter = (stringMark = `*`) => {
    if (selectedTextArray.length > 0) {
      const start = selectedTextArray[0];
      const stop = selectedTextArray[1];

      handleFormat(
        start,
        stop,
        stringMark,
        details,
        `details`,
        interFuncDetails,
        interFuncSelected,
      );
    }
  };

  const downButton = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    event.stopPropagation();
    if (event.ctrlKey && event.key.toLowerCase() === `b`) {
      event.stopPropagation();
      event.preventDefault();
      formatter();
    } else if (event.ctrlKey && event.key.toLowerCase() === `i`) {
      event.stopPropagation();
      event.preventDefault();
      formatter(`<`);
    } else if (event.ctrlKey && event.key.toLowerCase() === `u`) {
      event.stopPropagation();
      event.preventDefault();
      formatter(`~`);
    }
  };

  return (
    <div className="create_micro_wrapper box">
      <div className="create_micro_container_gen">
        <Select
          data={{
            selected: selected,
            func: (_id: string) => {
              changeSelected(_id);
            },
            holder: 'Select a tag',
            data: tags,
          }}
          fill
        />
      </div>
      {selected && (
        <div className="create_micro_body">
          <div className="create_micro_container_gen">
            <div className="label">Title</div>
            <input
              autoFocus
              placeholder="Give a simple question title..."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="create_micro_container_gen">
            <div className="label">Details</div>
            <textarea
              onKeyDown={downButton}
              className="createInputField"
              onChange={(e) => setDetails(e.target.value)}
              value={details}
              ref={textareaRef}
              onSelect={() => {
                handleSelected(
                  textareaRef.current?.selectionStart!,
                  textareaRef.current?.selectionEnd!,
                  selectFunc,
                  details,
                );
              }}
            />
          </div>

          <div className="create_micro_container_gen last">
            <button
              onClick={(e) => {
                makeRipple(e, true);
                handleFav();
                setSelected(null);
              }}
              disabled={!selected || !details || !title}
              className="createITRight btn"
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default connector(CreateMicro);
