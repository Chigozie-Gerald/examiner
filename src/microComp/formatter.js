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
    return str.split(` `).join(`_`);
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
  let single = /\*\*[A-z0-9\W]+\*\*/gi;
  let line = /~~[A-z0-9\W]+~~/gi;
  if (single.test(text)) {
    text = text.split(`**`).join(``);
  } else if (line.test(text)) {
    text = text.split(`~~`).join(``);
  } else {
    text = text.split(`<<`).join(``);
  }
  return text;
};

exports.transform = (text) => {
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
  return text.split(/(?:\r\n|\n)/g);
};
