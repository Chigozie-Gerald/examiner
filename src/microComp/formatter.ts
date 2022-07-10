export type formats = `bold` | `underline` | `italic`;
export const resolveMult = (
  newStr: string,
  new_format: formats[],
  parent_format: formats[],
) => {
  newStr = clean(newStr);
  return transform(newStr, [...new_format]).map((data) => {
    if (typeof data === `object`) {
      return data;
    } else {
      return {
        text: data,
        format: [...parent_format, ...new_format],
      };
    }
  });
};

export const clean = (text: string) => {
  //removes the start and end special characters
  const reg = /^\*\*|^<<|^~~|\*\*$|<<$|~~$/g;
  return text.replace(reg, ``);
};

const stripCheck = (value: string): { cover: formats } => {
  const mark = value.substring(0, 1);
  const format =
    mark === `*` ? `bold` : mark === `<` ? `italic` : `underline`;
  //gets the type of formatter
  return { cover: format };
};

export const disperse = (string: string): string[] => {
  const max = (num1: number, num2: number) =>
    num1 > num2 ? num1 : num2;
  const splitRegex = /\*\*.*?\*\*|<<.*?<<|~~.*?~~/g; // match text containing special characters
  const with_format = string.match(splitRegex); // gets array containing special characters
  const no_format = string.split(splitRegex); // split string into array if text with no specials
  const format_starts_first = !no_format[0] ? 1 : 0; //1 indicates that the special character began the sentence
  if (format_starts_first) {
    no_format.shift(); // when a special character begins a sentence, teh first item in the no special character array is usually a useless empty string
  }
  const highest = max(with_format?.length || 0, no_format.length);
  if (with_format) {
    const new_Array: string[] = [];
    for (let i = 0; i < highest; i++) {
      // for loop for juxtaposing the special character array and the non specials together in an alternating format
      const formElem = with_format[i];
      const no_formElem = no_format[i];
      if (format_starts_first) {
        if (formElem) {
          new_Array.push(formElem);
        }
        if (no_formElem) {
          new_Array.push(no_formElem);
        }
      } else {
        if (no_formElem) {
          new_Array.push(no_formElem);
        }
        if (formElem) {
          new_Array.push(formElem);
        }
      }
    }
    return new_Array;
  } else {
    return no_format;
  }
};

export const transform = (
  string: string,
  parent_format: formats[] = [],
): {
  text: string;
  format: formats[];
}[] => {
  const arr = disperse(string).map((data) => {
    const test = new RegExp(/\*\*.*?\*\*|<<.*?<<|~~.*?~~/); //Test bolds | italics | underline
    const result = test.test(data);
    if (!result) {
      //No processing needed when special characters do not exist
      return {
        text: data,
        format: [...parent_format],
      };
    } else {
      const { cover } = stripCheck(data);
      return resolveMult(
        data,
        [...parent_format, cover],
        parent_format,
      );
    }
  });
  //@ts-ignore
  return arr.flat();
  //Nesetd formatters will always return an array instead of an object, hence the need to flatten the array
};

export const formatter = (text: string = ``, listify = true) => {
  //Create bullet characters from `- `
  if (listify) {
    text = text.replace(/^(-\s)|^(-)/g, `• `);
    text = text.replace(
      /(?:\r\n|\n)-\s|(?:\r\n|\n)-|^(-\s)|^(-)/g,
      `\n• `,
    );
  }
  //Split text based on line spaces
  return text.split(/(?:\r\n|\n)/g);
};

export const getFormatResult = (parseObject: {
  text: string;
  format: formats[];
}): { [key in formats]: boolean } => {
  return {
    bold: parseObject.format.includes(`bold`),
    italic: parseObject.format.includes(`italic`),
    underline: parseObject.format.includes(`underline`),
  };
};

export const revEngineer = (string: string, bold = `*`) => {
  const stringMark = typeof bold === `string` ? bold.repeat(2) : `**`;
  const topSpace = string.search(/\S|$/);
  const botSpace =
    string.length - string.trim().length - string.search(/\S|$/);
  string = string.trim();
  string = stringMark + string + stringMark;
  let arr = string.split(/(?:\r\n|\n)/g);
  arr = arr.map((str, n) => {
    const tS = string.search(/\S|$/);
    const bS =
      string.length - string.trim().length - string.search(/\S|$/);
    if (n > 0) {
      str = ' '.repeat(tS) + stringMark + str.trim();
    }
    if (n < arr.length - 1) {
      str = str.trim() + stringMark + ' '.repeat(bS);
    }
    return str;
  });
  let finalString = arr.join('\n');

  finalString =
    ' '.repeat(topSpace) + finalString + ' '.repeat(botSpace);
  return finalString;
};

export const handleFormat = (
  start: number | undefined,
  stop: number | undefined,
  stringMark = `*`,
  details: string,
  name: string,
  onChange: (state: {
    target: {
      name: string;
      value: string;
    };
  }) => void,
  func: (data: any) => void,
) => {
  if (start === stop || start === undefined || stop === undefined) {
    return;
  }

  let preString = details.substring(0, start);
  let postString = details.substring(stop, details.length);
  let textExtract = details.substring(start, stop);
  textExtract = revEngineer(textExtract, stringMark);

  //Add the extract to the details pre and post strings
  const value = preString + textExtract + postString;

  //Create obj for workaround because name couldnt be extracted from react ref
  const obj = { target: { name, value } };
  onChange(obj);
  func({
    selected: [],
  });

  /*
    Take a string, add ** to each ends
    if trimmable, Translocate trimmable spaces to before the **
    Split the string into arrays by `enter` white spaces
    First: add ** to back, last: add ** to front, in between, add ** to both sides
    convert all horiz white spaces in each array to underscore
    Fix in the \n to after all array
    */
};

export const handleSelected = (
  start: number,
  stop: number,
  func: (object: {
    selected: [number, number];
    textSelect: string;
  }) => void,
  details: string,
) => {
  if (start !== stop) {
    func({
      selected: [start, stop],
      textSelect: details.substring(start, stop),
    });
  }
};
