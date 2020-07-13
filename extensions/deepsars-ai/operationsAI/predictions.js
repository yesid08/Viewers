import * as utils from '../utils';

export const predecir = (
  BUTTON_PATHOLOGY,
  BUTTON_PROBABILITY,
  UINotificationService,
  file_type,
  file_view,
  file_mod
) => {
  var dicomData = utils.getDicomUIDs();
  var studyData = utils.makeContract(
    file_type === 'slice'
      ? dicomData.SOPInstanceUID
      : dicomData.SeriesInstanceUID,
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
        BUTTON_PATHOLOGY.label = pathology;
        BUTTON_PROBABILITY.label = probability;
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
