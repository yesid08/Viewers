import * as utils from '../utils';

export const calculateHeatmap = (services, payloadData) => {
  const UINotificationService = services.notification;
  var promisePetition = utils.makeTransaction('aiModels', 'read', payloadData);
  UINotificationService.show({
    title: 'Generando mapas de calor',
    message: 'Este proceso tomara unos segundos.',
  });
  promisePetition
    .then(response => {
      if (response.data.hasOwnProperty('error')) {
        UINotificationService.show({
          title: 'Error de Predicción',
          message: 'Por favor intente de nuevo',
          type: 'warning',
          duration: 5 * 1000,
          position: 'topRight',
        });
      } else {
        UINotificationService.show({
          title: 'Mapas de calor generados',
          message: 'Para visualizarlos por favor recargue la página',
          duration: 5 * 1000,
          type: 'success',
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
