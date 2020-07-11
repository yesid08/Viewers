/* eslint-disable no-console */
/*TODO List: By Yesid G.
  1) Create petitions utilities inside of utils.py
  2) Create the logic of each button in the corresponding section (heatmaps.js or predictions.js) by using functions.
  3) Inside this file(commands module) just call the functions from heatmaps.js or predictions.js in front of each commandFn.
  4) This file should have the same form of the one that is currently in index, the idea is to export the whole object to index.
  5) In the file index.js import this commandsModule.js file and return the object of this file
  6) commit the changes and have fun!
*/
import * as utils from '../utils';

export const predecir = (
  study,
  BUTTON_CT_VOLUME_PATHOLOGY,
  BUTTON_CT_VOLUME_PROBABILITY,
  UINotificationService,
  file_type,
  file_view,
  file_mod
) => {
  var dicomData = utils.getDicomUIDs();
  var dicomDataArray = Object.values(dicomData);
  var studyData = utils.makeContract(
    dicomDataArray[study],
    file_type,
    file_view,
    file_mod
  );
  var promisePetition = utils.makeTransaction('aiModels', 'read', studyData);

  UINotificationService.show({
    title: 'Realizando predicción',
    message: 'Este proceso tomara unos segundos.',
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
        BUTTON_CT_VOLUME_PATHOLOGY.label = pathology;
        BUTTON_CT_VOLUME_PROBABILITY.label = probability;
        UINotificationService.show({
          title: 'Predicción exitosa',
          message:
            'La clase predicha fue ' +
            pathology +
            ' con una confianza de ' +
            probability,
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
