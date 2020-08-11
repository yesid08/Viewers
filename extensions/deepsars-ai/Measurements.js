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
      measurement.viewport = undefined;
      measurement._isLast = false;
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
  console.log('Sacando anotaciones del estudio =>', study);
  console.log('ANOTACIONES ACTUALES', currentMeasurements);
  const annotationsPromise = makeTransaction('roiAnnotations', 'readList', {
    StudyInstanceUID: study,
  });
  annotationsPromise.then(response => {
    const annotations = response.data;
    console.log(annotations);
    if (annotations != undefined) {
      annotations.forEach(annotation => {
        console.log(annotation);
        const alreadyExist = currentMeasurements.some(measurement => {
          return measurement._roiId === annotation._roiId;
        });
        if (!alreadyExist) {
          localMeasurementAPI.addMeasurement(annotation.toolType, annotation);
        }
      });
    }
  });
  annotationsPromise.catch(error => {
    console.error(error);
  });
};
