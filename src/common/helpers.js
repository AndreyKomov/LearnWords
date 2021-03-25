const helpers = {
  getImageName: path => {
    return path.split('\\')[path.split('\\').length - 1];
  }
};
module.exports = { helpers };
