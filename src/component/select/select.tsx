import React, { useEffect, useRef, useState } from 'react';
import './select.css';

type tag = { name: string; _id: string };
type selectData = {
  selected: tag | null;
  func: (_id: string) => void;
  holder: string;
  data: tag[];
};

const Select = ({
  data,
  fill,
}:
  | {
      data: selectData;
      fill: boolean;
    }
  | {
      data: selectData;
      fill?: never;
    }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const ref = useRef<HTMLDivElement>(null);

  const removeDropOnClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', removeDropOnClick);

    return () => {
      window.removeEventListener('click', removeDropOnClick);
    };
  }, []);

  const { selected, func, holder, data: data_inner } = data;
  return (
    <div ref={ref} className={`selectWrap ${fill ? `fill` : ``}`}>
      <div
        onClick={handleOpen}
        className={`selectBox head ellipsis ${
          selected ? 'bold' : ''
        }`}
      >
        {selected ? selected.name : holder}
      </div>
      {data && Array.isArray(data_inner) && (
        <div
          className={`selectBox_float_box scroller ${
            open ? 'open' : ''
          }`}
        >
          {data_inner.map((item, n) => (
            <div
              onClick={() => {
                func(item._id);
                setOpen(false);
              }}
              key={`select${n}`}
              className={`selectBox_float ellipsis ${
                selected?._id === item._id ? 'chosen' : ''
              }`}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

//@ts-ignore
export default Select;
