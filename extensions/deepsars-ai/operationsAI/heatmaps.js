import * as utils from '../utils';

export const ctAxialheatMapVolumen = UINotificationService => {
  var dicomData = utils.getDicomUIDs();
  var studyData = {
    microservice: 'models',
    file_mod: 'ct',
    file_view: 'axial',
    task: 'diagnose',
    file_type: 'volumen',
    file_ID: dicomData.SeriesInstanceUID,
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

export const ctAxialheatMapSlice = UINotificationService => {
  var dicomData = utils.getDicomUIDs();
  var studyData = {
    microservice: 'models',
    file_mod: 'ct',
    file_view: 'axial',
    task: 'prepare',
    file_type: 'slice',
    file_ID: dicomData.SeriesInstanceUID,
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

export const rxFrontalheatMap = UINotificationService => {
  var dicomData = utils.getDicomUIDs();
  var studyData = {
    microservice: 'models',
    file_mod: 'rx',
    file_view: 'frontal',
    task: 'diagnose',
    file_type: 'slice',
    file_ID: dicomData.SOPInstanceUID,
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
