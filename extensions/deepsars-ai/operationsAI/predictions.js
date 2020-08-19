import * as utils from '../utils';

export const predictAPathology = (buttons, services, payloadData) => {
  const BUTTON_PATHOLOGY = buttons.pathology;
  const BUTTON_PROBABILITY = buttons.probability;
  const UINotificationService = services.notification;

  var promisePetition = utils.makeTransaction('aiModels', 'read', payloadData);

  UINotificationService.show({
    title: 'Realizando predicción',
    message: 'Este proceso tomara unos segundos.',
    duration: 1000 * 2,
  });

  promisePetition
    .then(response => {
      console.log(response);
      console.log(response.data.hasOwnProperty('error'));
      if (response.data.hasOwnProperty('error')) {
        UINotificationService.show({
          title: 'Error de Predicción',
          type: 'warning',
          message: 'Por favor intente de nuevo',
        });
      } else {
        var pathology = response.data.class;
        var probability = response.data.probability.toFixed(2) * 100 + '%';
        BUTTON_PATHOLOGY.label = pathology;
        BUTTON_PROBABILITY.label = probability;
        UINotificationService.show({
          title: 'Predicción exitosa',
          message:
            'La clase predicha fue ' +
            pathology +
            ' con una confianza de ' +
            probability,
          duration: 1000 * 15,
          type: 'success',
        });
      }
    })
    .catch(rst => {
      console.log(rst);
      UINotificationService.show({
        type: 'error',
        title: 'Error',
        message: 'Sin conexión.',
      });
    });
};

export const predictMultiplePathologies = payloadData => {
  var promisePetition = utils.makeTransaction('aiModels', 'read', payloadData);
  const promisePrediction = new Promise((resolve, reject) => {
    promisePetition
      .then(response => {
        console.log(response);
        console.log(response.data.hasOwnProperty('error'));
        if (response.data.hasOwnProperty('error')) {
          resolve({ error: response.data.error });
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
        resolve({ error: 'There is no connection', result: rst });
      });
  });
  return promisePrediction;
};
