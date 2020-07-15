import * as utils from '../utils';
import { exampleMeasurement } from './../mocks/MeasurementsMock';
import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';

const createMeasurement = (coordenate, aClass, probability) => {
  console.log(cornerstoneTools);
  var annotation = exampleMeasurement;
  console.log('coordinates', coordenate);
  console.log('class', aClass);
  console.log('probability', probability);
  //FRCNN
  annotation.handles.start.x = parseInt(coordenate[0]);
  annotation.handles.start.y = parseInt(coordenate[1]);
  annotation.handles.end.x = parseInt(coordenate[2]);
  annotation.handles.end.y = parseInt(coordenate[3]);
  annotation.description = `${aClass} : ${probability}`;
  //DICOM
  var dicomUIDs = utils.getDicomUIDs();
  annotation.StudyInstanceUID = dicomUIDs.StudyInstanceUID;
  annotation.SeriesInstanceUID = dicomUIDs.SeriesInstanceUID;
  annotation.SOPInstanceUID = dicomUIDs.SOPInstanceUID;
  annotation.imagePath = `${annotation.StudyInstanceUID}_${annotation.SeriesInstanceUID}_${annotation.SOPInstanceUID}_${annotation.frameIndex}`;
  return annotation;
};

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
        console.log(response);
        if (response.data.coordenates.length > 0) {
          UINotificationService.show({
            title: 'Zonas de interés detectadas',
            message:
              'Recuerda abrir el panel "measurements" para más información',
          });
          var annotations = [];
          for (var i = 0; i < response.data.coordenates.length; i++) {
            var coordenate = response.data.coordenates[i];
            var probability = response.data.probabilities[i];
            var aClass = response.data.classes[i];
            var annotation = createMeasurement(coordenate, aClass, probability);
            console.log(annotation);
            //add to annotations
            annotations.push(annotation);
            annotation = undefined;
          }
          const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
          console.log(annotations);
          annotations.forEach(measurement => {
            localMeasurementAPI.addMeasurement(
              measurement.toolType,
              measurement
            );
          });
          // Sync Measurements -------------------//
          localMeasurementAPI.syncMeasurementsAndToolData();
          cornerstone.getEnabledElements().forEach(enabledElement => {
            cornerstone.updateImage(enabledElement.element);
          });
          // Let others know that the measurements are updated
          localMeasurementAPI.onMeasurementsUpdated();
        } else {
          console.log('there are NOT annotations');
          UINotificationService.show({
            title: 'No hay zonas de interés',
            message: 'El modelo IA no detectó zonas de interés.',
          });
        }
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
