const shuffle = (array) => {
    const rand = [];
    const copy = array.slice(0, array.length);
    for (let i = 0; i < array.length; i++) {
      let random = Math.floor(Math.random() * copy.length);
      rand.push(copy.splice(random, 1)[0]);
    }
    return rand;
};

module.exports = { shuffle };