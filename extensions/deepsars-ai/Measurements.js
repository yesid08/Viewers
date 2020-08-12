import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
import { makeTransaction, guid } from './utils';

export const saveMeasurements = services => {
  const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
  const currentMeasurements = localMeasurementAPI.tools.RectangleRoi.concat(
    localMeasurementAPI.tools.EllipticalRoi
  );
  console.log(
    `${currentMeasurements.length} tool anotations are going to be saved`
  );

  if (currentMeasurements.length !== 0) {
    currentMeasurements.forEach((measurement, index) => {
      measurement.viewport = undefined;
      if (measurement._roiId) {
        console.log('Skipped the assignation of roiId');
      } else {
        measurement._roiId = guid();
      }
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
  currentMeasurements.forEach((measurement, index) => {
    measurement.lesionNamingNumber = index + 1;
    measurement.measurementNumber = index + 1;
  });
  console.log('Sacando anotaciones del estudio =>', study);
  console.log('ANOTACIONES ACTUALES', currentMeasurements);
  const annotationsPromise = makeTransaction('roiAnnotations', 'readList', {
    StudyInstanceUID: study,
  });
  annotationsPromise.then(response => {
    const annotations = response.data;
    console.log(annotations);
    if (annotations != undefined) {
      annotations.forEach((annotation, index) => {
        annotation.lesionNamingNumber = currentMeasurements.length + index + 1;
        annotation.measurementNumber = currentMeasurements.length + index + 1;
        console.log(annotation);
        const alreadyExist = currentMeasurements.some(measurement => {
          return measurement._roiId === annotation._roiId;
        });
        if (!alreadyExist) {
          localMeasurementAPI.addMeasurement(annotation.toolType, annotation);
        }
      });
      services.notification.show({
        title: 'Anotaciones cargadas',
        message:
          'Se han cargado las anotaciones, por favor revise el panel derecho para más información.',
        type: 'success',
        duration: 5 * 1000,
      });
    } else {
      services.notification.show({
        title: 'Sin anotaciones',
        message: 'El estudio actual no cuenta con anotaciones guardadas.',
        type: 'success',
        duration: 5 * 1000,
      });
    }
  });
  annotationsPromise.catch(error => {
    console.error(error);
  });
};
