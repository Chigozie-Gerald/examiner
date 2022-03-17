exports.randomize = (number, shuffle = false) => {
  let array = new Array(number).fill(0).map((data, n) => n);
  if (shuffle) {
    var t, i;
    while (number) {
      i = Math.floor(Math.random() * number--);

      t = array[number];
      array[number] = array[i];
      array[i] = t;
    }
  }

  return array;
};
