const Responses = require('../common/API_Responses');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-comprehend/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-comprehend/classes/batchdetectentitiescommand.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-comprehend/classes/batchdetectsentimentcommand.html

const {
  ComprehendClient,
  BatchDetectEntitiesCommand,
  BatchDetectSentimentCommand,
} = require('@aws-sdk/client-comprehend');

const client = new ComprehendClient();

exports.handler = async (event) => {
  console.log('event', event);

  const body = JSON.parse(event.body);

  if (!body || !body.text) {
    return Responses._400({ message: 'missing text field in body' });
  }

  const { text } = body;

  const input = {
    LanguageCode: 'en',
    TextList: [text],
  };

  const commandDetectEntities = new BatchDetectEntitiesCommand(input);
  const commandDetectSentiment = new BatchDetectSentimentCommand(input);

  try {
    // send commands to AWS comprehend.
    const entityResults = await client.send(commandDetectEntities);
    const sentimentResults = await client.send(commandDetectSentiment);

    const entities = entityResults.ResultList[0];
    const sentiment = sentimentResults.ResultList[0];

    const responseData = { entities, sentiment };

    console.log('responseData', responseData);

    return Responses._200(responseData);
  } catch (err) {
    // error handling.
    console.log('error in Comprehend', err);
    return Responses._500({ message: err.message });
  }
};
