import * as utils from '../utils';
export const predictAPathology = payloadData => {
  var promisePetition = utils.makeTransaction('aiModels', 'read', payloadData);
  return promisePetition;
};

export const predictMultiplePathologies = payloadData => {
  var promisePetition = utils.makeTransaction('aiModels', 'read', payloadData);
  const promisePrediction = new Promise((resolve, reject) => {
    promisePetition
      .then(response => {
        console.log(response);
        console.log(response.data.hasOwnProperty('error'));
        if (response.data.hasOwnProperty('error')) {
          reject({ error: response.data.error });
        } else {
          var pathologies = {};
          for (let [aClass, probability] of Object.entries(response.data)) {
            pathologies[aClass] = parseFloat(probability * 100).toFixed(2);
          }
          resolve(pathologies);
        }
      })
      .catch(rst => {
        console.log(rst);
        reject({ error: 'There is no connection', result: rst });
      });
  });
  return promisePrediction;
};
