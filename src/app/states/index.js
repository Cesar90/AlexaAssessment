const mainStates = require("./main.states");
const defaultamazonStates = require("./defaultamazon.states");

function register(voxaApp) {
  mainStates(voxaApp);
  defaultamazonStates(voxaApp);
}

module.exports = register;
