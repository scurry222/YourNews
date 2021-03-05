const shuffle = (array) => {
    const rand = [];
    const copy = array.slice(0, array.length);
    for (let i = 0; i < array.length; i++) {
      let random = Math.floor(Math.random() * copy.length);
      rand.push(copy.splice(random, 1)[0]);
    }
    return rand;
};

const debounce = (fn, ms) => {
  let timer;
  return _ => {
    clearTimeout(timer);
    timer = setTimeout(_ => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

module.exports = { shuffle, debounce };