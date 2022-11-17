module.exports = {
  generateRandomCode() {
    let randStr = '';
    for (let i = 0; i < 3; i += 1) {
      randStr += Math.floor(Math.random() * 10);
    }
    let code = ['M', '', randStr].join('');
    return code;
  },
};
