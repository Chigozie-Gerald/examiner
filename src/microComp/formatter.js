exports.revEngineer = (string, bold = `*`) => {
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

exports.handleFormat = (
  start,
  stop,
  stringMark = `*`,
  details,
  name,
  onChange,
  func,
) => {
  console.log(`formatiing`);
  if (start === stop) {
    return;
  }

  let preString = details.substring(0, start);
  let postString = details.substring(stop, details.length);
  let textExtract = details.substring(start, stop);
  textExtract = this.revEngineer(textExtract, stringMark);

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

exports.handleSelected = (start, stop, func, details) => {
  console.log({
    selected: [start, stop],
    textSelect: details.substring(start, stop),
  });
  if (start !== stop) {
    func({
      selected: [start, stop],
      textSelect: details.substring(start, stop),
    });
  }
};

exports.clean = (text) => {
  //removes the special characters
  return text.replace(/\*\*|~~|<</g, ``);
};

exports.transformer = (text) => {
  //Converts each sentence to an array of words
  //text for boldness or the likes
  //Returns the text or an object if special
  text = text.split(` `);
  const arr = text.map((data) => {
    let single = new RegExp(/\*\*[A-z0-9\W]+\*\*/gi);
    let line = new RegExp(/~~[A-z0-9\W]+~~/gi);
    let italicize = new RegExp(/<<[A-z0-9\W]+<</gi);
    const bold = single.test(data);
    const underline = line.test(data);
    const italic = italicize.test(data);
    if (!bold && !underline && !italic) {
      return data + ` `;
    } else {
      return {
        text: ` ` + this.clean(data) + ` `,
        format: bold ? `bold` : underline ? `underline` : `italic`,
      };
    }
  });
  return arr;
};

exports.formatter = (text) => {
  //Split text based on line spaces
  return text.split(/(?:\r\n|\n)/g);
};

exports.cleaner = (text) => {
  //removes the special characters
  return text.replace(/\*\*|~~|<</g, ``);
};

exports.transform = (text) => {
  //Return matches for strings that
  /*
  - Start and end with `[[` `]]` with any intervening character |
  - Start and end with `{{` `}}` with any intervening character |
  - Start and END with whitespaces of any length (zero or more) with any intervening character
  */
  text = text.match(
    /\*\*.*?\*\*|~~.*?~~?|<<.*?<<?|\s*[^**~~<<]+\s*/g,
  );
  const arr = !text
    ? [``]
    : text.map((data) => {
        const boldTest = new RegExp(/\*\*.*?\*\*/); //Test bold
        const lineTest = new RegExp(/~~.*?~~?/); //Test line
        const italicTest = new RegExp(/<<.*?<<?/); //Test italic
        const bold = boldTest.test(data);
        const line = lineTest.test(data);
        const italic = italicTest.test(data);

        if (!bold && !line && !italic) {
          //No processing needed when special characters do not exist
          return data;
        } else {
          return {
            text: this.cleaner(data),
            format: bold ? `bold` : line ? `underline` : `italic`,
          };
        }
      });
  return arr;
  //Nesetd formatters will always return an array instead of an object, hence the need to flatten the array
};
