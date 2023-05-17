const Responses = require('../common/API_Responses');

exports.handler = async (event) => {
  console.log('event', event);

  const body = JSON.parse(event.body);
};
