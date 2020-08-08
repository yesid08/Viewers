import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
import { makeTransaction } from './utils';

export const saveMeasurements = services => {
  const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
  const currentMeasurements = localMeasurementAPI.tools.RectangleRoi.concat(
    localMeasurementAPI.tools.EllipticalRoi
  );
  console.log(
    `${currentMeasurements.length} tool anotations are going to be saved`
  );

  if (currentMeasurements.length !== 0) {
    currentMeasurements.forEach(measurement => {
      if (measurement._roiId) {
        console.log('Skipped the assignation of roiId');
      } else {
        measurement._roiId = measurement._id;
      }
      delete measurement._id;
      makeTransaction('roiAnnotations', 'write', measurement)
        .then(response => {
          console.log('Respuesta=>', response);
        })
        .catch(error => {
          console.log('Error=>', error);
        });
    });
    services.notification.show({
      title: 'Anotaciones Guardadas',
      message: 'Se guardaron las anotaciones correctamente.',
      type: 'success',
      duration: 5 * 1000,
    });
  } else {
    services.notification.show({
      title: 'No existen Anotaciones',
      message: 'No existen anotaciones guardadas, se omitió este proceso',
      type: 'success',
      duration: 5 * 1000,
    });
  }
};

export const retrieveAllMeasurements = (study, services) => {
  const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
  const currentMeasurements = localMeasurementAPI.tools.RectangleRoi.concat(
    localMeasurementAPI.tools.EllipticalRoi
  );
  const allTools = localMeasurementAPI.toolGroups.allTools;
  console.log('Sacando anotaciones del estudio =>', study);
  console.log('ANOTACIONES ACTUALES', currentMeasurements);
  makeTransaction('roiAnnotations', 'readList', { StudyInstanceUID: study })
    .then(response => {
      console.log('Respuesta=>', response.data);
      console.log('currentMeasurements', currentMeasurements);
      if (response.data != undefined) {
        const roiAnnotations = response.data;
        response.data.forEach((measurement, index) => {
          if (
            !currentMeasurements.some(e => {
              return e._roiId === measurement._roiId;
            })
          ) {
            console.log(
              'the meassurement e, doesnt exist in current measurements',
              measurement
            );
            measurement.lesionNamingNumber = localMeasurementAPI.calculateLesionNamingNumber(
              currentMeasurements
            );
            measurement.measurementNumber = localMeasurementAPI.calculateMeasurementNumber(
              measurement
            );
            measurement._id = measurement.roiId;
            console.log(measurement);
            localMeasurementAPI.addMeasurement(
              measurement.toolType,
              measurement
            );
            console.log(localMeasurementAPI);
            console.log(roiAnnotations);
            console.log(
              'measurement description after add',
              measurement.description
            );
          }
        });
        // Sync Measurements -------------------//
        localMeasurementAPI.syncMeasurementsAndToolData();
        cornerstone.getEnabledElements().forEach(enabledElement => {
          cornerstone.updateImage(enabledElement.element);
        });
        // Let others know that the measurements are updated
        localMeasurementAPI.onMeasurementsUpdated();
        services.notification.show({
          title: 'Anotaciones cargadas',
          message:
            'Recuerde abrir el panel derecho para obtener más información.',
          type: 'success',
          duration: 1000 * 5,
        });
      } else {
        services.notification.show({
          title: 'Anotaciones cargadas',
          message: 'Actualmente, este estudio no posee anotaciones guardadas.',
          type: 'success',
          duration: 1000 * 5,
        });
      }
      console.log(response.data);
    })
    .catch(error => {
      console.log('Error=>', error);
    });
};
