const moment = require("moment");

function formatMessage(socketId, username, text) {
  return {
    socketId,
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
