import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
import { makeTransaction } from './utils';

export const saveMeasurements = () => {
  const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
  const currentMeasurements = localMeasurementAPI.tools.RectangleRoi.concat(
    localMeasurementAPI.tools.EllipticalRoi
  );
  console.log(
    `${currentMeasurements.length} tool anotations are going to be saved`
  );

  if (currentMeasurements.length !== 0) {
    currentMeasurements.forEach(measurement => {
      delete measurement._id;
      makeTransaction('roiAnnotations', 'write', measurement)
        .then(response => {
          console.log('Respuesta=>', response);
        })
        .catch(error => {
          console.log('Error=>', error);
        });
    });
  }
};

export const retrieveAllMeasurements = study => {
  const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
  const currentMeasurements = localMeasurementAPI.tools.RectangleRoi.concat(
    localMeasurementAPI.tools.EllipticalRoi
  );
  console.log('Sacando anotaciones del estudio =>', study);
  console.log('ANOTACIONES ACTUALES', currentMeasurements);
  makeTransaction('roiAnnotations', 'readList', { StudyInstanceUID: study })
    .then(response => {
      console.log('Respuesta=>', response.data);
      response.data.forEach(measurement => {
        if (
          !currentMeasurements.some(e => {
            return e._roiId === measurement._roiId;
          })
        ) {
          measurement.lesionNamingNumber = currentMeasurements.length + 1;
          measurement.measurementNumber = currentMeasurements.length + 1;
          localMeasurementAPI.addMeasurement(measurement.toolType, measurement);
        }
      });
      console.log(OHIF.measurements.MeasurementApi.Instance);
      // Sync Measurements -------------------//
      localMeasurementAPI.syncMeasurementsAndToolData();
      cornerstone.getEnabledElements().forEach(enabledElement => {
        cornerstone.updateImage(enabledElement.element);
      });
      // Let others know that the measurements are updated
      localMeasurementAPI.onMeasurementsUpdated();
    })
    .catch(error => {
      console.log('Error=>', error);
    });
};
