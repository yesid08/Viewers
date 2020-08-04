import * as utils from '../utils';
import { exampleMeasurement } from './../mocks/MeasurementsMock';
import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';

const createMeasurementFromRoi = (coordenate, aClass, probability) => {
  probability = parseFloat(probability * 100).toFixed(3);
  var aDescription = `${aClass} : ${probability}%`;
  console.log('================================================');
  console.log('coordinates', coordenate);
  console.log('class', aClass);
  console.log('probability', probability);
  console.log('description', aDescription);
  console.log('================================================');
  const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
  const currentMeasurements = localMeasurementAPI.tools.RectangleRoi.concat(
    localMeasurementAPI.tools.EllipticalRoi
  );
  var dicomUIDs = utils.getDicomUIDs();
  var annotation = {
    visible: true,
    active: false,
    invalidated: false,
    StudyInstanceUID: dicomUIDs.StudyInstanceUID,
    SeriesInstanceUID: dicomUIDs.SeriesInstanceUID,
    SOPInstanceUID: dicomUIDs.SOPInstanceUID,
    frameIndex: 0,
    imagePath: `${dicomUIDs.StudyInstanceUID}_${dicomUIDs.SeriesInstanceUID}_${dicomUIDs.SOPInstanceUID}_0`,
    lesionNamingNumber: currentMeasurements.length + 1,
    measurementNumber: currentMeasurements.length + 1,
    userId: null,
    toolType: 'RectangleRoi',
    description: aDescription,
    handles: {
      start: {
        x: parseInt(coordenate[0]),
        y: parseInt(coordenate[1]),
        highlight: true,
        active: false,
      },
      end: {
        x: parseInt(coordenate[2]),
        y: parseInt(coordenate[3]),
        highlight: true,
        active: false,
      },
      initialRotation: 0,
      textBox: {
        active: false,
        hasMoved: false,
        movesIndependently: false,
        drawnIndependently: true,
        allowedOutsideImage: true,
        hasBoundingBox: true,
        x: 256,
        y: 248,
        boundingBox: { width: 293.9375, height: 45, left: 230, top: 295.125 },
      },
    },
    //PatientID: '13504175',

    //_id: OHIF.measurements.,
    timepointId: 'TimepointId',
    unit: 'HU',
    location: 'Lung',
    cachedStats: {
      area: 0,
      count: 0,
      mean: 0,
      variance: 0,
      stdDev: 0,
      min: 0,
      max: 0,
    },
  };
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
        if (response.data.coordenates.length > 0) {
          UINotificationService.show({
            title: 'Zonas de interés detectadas',
            message:
              'Recuerda abrir el panel "measurements" para más información',
          });
          var localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
          for (var i = 0; i < response.data.coordenates.length; i++) {
            var coordenate = response.data.coordenates[i];
            var probability = response.data.probabilities[i];
            var aClass = response.data.classes[i];
            var annotation = createMeasurementFromRoi(
              coordenate,
              aClass,
              probability
            );
            //add to annotations
            localMeasurementAPI.addMeasurement(annotation.toolType, annotation);
          }
          // Sync Measurements -------------------//
          localMeasurementAPI.syncMeasurementsAndToolData();
          cornerstone.getEnabledElements().forEach(enabledElement => {
            cornerstone.updateImage(enabledElement.element);
          });
          // Let others know that the measurements are updated
          localMeasurementAPI.onMeasurementsUpdated();
          console.log(localMeasurementAPI);
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

export const rxFrontalAnalyzeSlice = UINotificationService => {
  var dicomData = utils.getDicomUIDs();
  var studyData = {
    microservice: 'models',
    file_mod: 'rx',
    file_view: 'frontal',
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
        if (response.data.coordenates.length > 0) {
          UINotificationService.show({
            title: 'Zonas de interés detectadas',
            message:
              'Recuerda abrir el panel "measurements" para más información',
          });
          var localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
          for (var i = 0; i < response.data.coordenates.length; i++) {
            var coordenate = response.data.coordenates[i];
            var probability = response.data.probabilities[i];
            var aClass = response.data.classes[i];
            var annotation = createMeasurementFromRoi(
              coordenate,
              aClass,
              probability
            );
            //add to annotations
            localMeasurementAPI.addMeasurement(annotation.toolType, annotation);
          }
          // Sync Measurements -------------------//
          localMeasurementAPI.syncMeasurementsAndToolData();
          cornerstone.getEnabledElements().forEach(enabledElement => {
            cornerstone.updateImage(enabledElement.element);
          });
          // Let others know that the measurements are updated
          localMeasurementAPI.onMeasurementsUpdated();
          console.log(localMeasurementAPI);
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
