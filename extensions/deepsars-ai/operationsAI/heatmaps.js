/*TODO List: By Yesid G.
  1) Create petitions utilities inside of utils.py
  2) Create the logic of each button in the corresponding section (heatmaps.js or predictions.js) by using functions.
  3) Inside this file(commands module) just call the functions from heatmaps.js or predictions.js in front of each commandFn.
  4) This file should have the same form of the one that is currently in index, the idea is to export the whole object to index.
  5) In the file index.js import this commandsModule.js file and return the object of this file
  6) commit the changes and have fun!
*/
import * as utils from '../utils';

export const heatMaps = UINotificationService => {
  var dicomData = utils.getDicomUIDs();
  var dicomDataArray = Object.values(dicomData);
  var studyData = {
    microservice: 'models',
    file_mod: 'CT',
    file_view: 'axial',
    task: 'prepare',
    file_type: 'slice',
    file_ID: dicomDataArray[1],
  };
  var promisePetition = utils.makeTransaction('aiModels', 'read', studyData);

  UINotificationService.show({
    title: 'Generando mapas de calor',
    message: 'Este proceso tomara unos segundos.',
  });

  promisePetition
    .then(response => {
      if (response.data.hasOwnProperty('error')) {
        UINotificationService.show({
          title: 'Error de Predicción',
          type: 'warning',
          message: 'Por favor intente de nuevo',
        });
      } else {
        UINotificationService.show({
          title: 'Mapas de calor generados',
          message: 'Para visualizarlos por favor recargue la página',
        });
      }
    })
    .catch(rst => {
      UINotificationService.show({
        type: 'error',
        title: 'Error',
        message: 'Sin conexión.',
      });
    });
};
