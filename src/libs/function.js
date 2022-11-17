module.exports = {
  generateRandomCode(len) {
    let randStr = '';
    for (let i = 0; i < len; i += 1) {
      randStr += Math.floor(Math.random() * 10);
    }
    let code = 'M'+randStr;
    return code;
  },
};
