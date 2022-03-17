exports.singularize = (text, startVal = false, render = false) => {
  //Render is used when putting into question bank
  //Gets the second to last value should a pipe separate texts
  //Only put text with info format around parentheses
  const textArr = text.split(`|`);
  if (textArr.length > 1) {
    const frontInd = textArr.length > 2 ? 2 : textArr.length - 1;
    const sendText = textArr
      .splice(frontInd, textArr.length - frontInd)
      .join(` `);
    const italic = render ? `<<` : ``;
    return startVal
      ? italic + `(` + sendText + `)` + italic
      : sendText;
  } else {
    const italic = render ? `<<` : ``;
    return startVal ? italic + `(` + text + `)` + italic : text;
  }
};

exports.resolveMult = (newStr, both, render = false) => {
  //Render is used to parsed text to be displayed in question bank

  //For nested formatters
  newStr = this.singularize(
    newStr.substr(2, newStr.length - 4),
    true,
    render,
  );
  //The 4 indicates the opener and closer i.e. `{{` `}}`
  //Removes the pipes if any, performs a transfor which return an
  //...array instead of an object or string
  //This will be flattened in the final transform return
  return this.transform(newStr).map((data) => {
    if (typeof data === `object`) {
      data.both = 1;
      //the both marker above marks the section for double formatting
      if (render) {
        const attach = `**`;
        return attach + data.text + attach;
      } else return data;
    } else {
      if (render) {
        return data;
      } else
        return {
          text: data,
          format: both === 1 ? `info` : `link`,
          //In a double format seqeunce, there exist a general formatter
          //That formatter is added here from both recieved from a regex enumeration
          both: 0,
          //Plain texts which are not objects receive only the general format and here both is resolved to `0`
        };
    }
  });
};

exports.clean = (text, info, render = false) => {
  //removes the special characters
  return this.singularize(
    text.replace(/\{\{|\[\[|\]\]|\}\}/g, ``),
    info,
    render,
  );
};

exports.transform = (text, render = false) => {
  //Render is used to parsed text to be displayed in question bank

  //Return matches for strings that
  /*
  - Start and end with `[[` `]]` with any intervening character |
  - Start and end with `{{` `}}` with any intervening character |
  - Start and END with whitespaces of any length (zero or more) with any intervening character
  */
  text = text.match(/\[\[.*?\]\]|\{\{.*?\}\}?|\s*[^[[{{]+\s*/g);
  const arr = text.map((data) => {
    const linkTest = new RegExp(/\[\[.*?\]\]/); //Test links
    const infoTest = new RegExp(/\{\{.*?\}\}/); //Test infos
    const bothTest1 = new RegExp(/\{\{.*?\[\[.*?\]\].*?\}\}/); //Test both links and info with info covers
    const bothTest2 = new RegExp(/\[\[.*?\{\{.*?\}\}.*?\]\]/); //Test both links and info with link covers
    const link = linkTest.test(data);
    const info = infoTest.test(data);
    const link_info1 = bothTest1.test(data);
    const link_info2 = bothTest2.test(data);
    if (!link && !info) {
      //No processing needed when special characters do not exist
      return data;
    } else {
      if (link_info1 || link_info2) {
        return this.resolveMult(
          data,
          link_info1 ? 1 : link_info2 ? 2 : -1,
          render,
        );
        //This will return an array hence the need to flatten
      } else {
        if (render) {
          const attach = link ? `**` : ``;
          return (
            attach +
            this.clean(data, link ? false : true, true) +
            attach
          );
        } else {
          return {
            text: this.clean(data, link ? false : true),
            format: link ? `link` : info ? `info` : ``,
            both: -1,
          };
        }
      }
    }
  });
  return arr.flat();
  //Nesetd formatters will always return an array instead of an object, hence the need to flatten the array
};

exports.formatter = (text) => {
  //Split text based on line spaces
  return text.split(/(?:\r\n|\n)/g);
};
