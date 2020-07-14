import * as utils from '../utils';

export const ctAxialAnalyzeSlice = UINotificationService => {
  var dicomData = utils.getDicomUIDs();
  var studyData = {
    microservice: 'models',
    file_mod: 'ct',
    file_view: 'axial',
    task: 'analyze_zones',
    file_type: 'slice',
    file_ID: dicomData.SOPInstanceUID,
  };
  var promisePetition = utils.makeTransaction('aiModels', 'read', studyData);

  UINotificationService.show({
    title: 'Prediciendo zonas de interés',
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
          title: 'OK',
          message: 'Zonas predichas con éxito.',
        });
        console.log(response);
      }
    })
    .catch(rst => {
      UINotificationService.show({
        type: 'error',
        title: 'Error',
        message: 'Sin conexión.',
      });
      console.log(rst);
    });
};
