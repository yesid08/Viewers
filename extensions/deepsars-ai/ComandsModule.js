/* eslint-disable no-console */
import { retrieveAllMeasurements, saveMeasurements } from './Measurements';
import { getDicomUIDs } from './utils';
import cornerstoneTools from 'cornerstone-tools';
import * as BUTTONS from './ToolbarModule';
import * as predictions from './operationsAI/predictions';
import * as heatmaps from './operationsAI/heatmaps';
import cornerstone from 'cornerstone-core';
import DeepsarsSegmentationForm from './DeepsarsSegmentationForm';
import * as coding from './segmentationModule/encoderV41';
import * as decoding from './segmentationModule/decoderV41';
import * as utils from './utils';
import { states } from './Estados/estadosHerramientas';
import { ohifConf } from './index';
import { MODELS_INFORMATION } from './mocks/models_information';
import AnalizeRoiModal from './Modals/AnalyzeRoiModal';
const deepsarsCommandsModule = ({ servicesManager }) => {
  const { UINotificationService, UIModalService } = servicesManager.services;
  return {
    definitions: {
      predictAxialCovidVolumeCt: {
        commandFn: () => {
          var dicomData = utils.getDicomUIDs();
          console.log('this is the print:', MODELS_INFORMATION.ct_3d.train_samples, MODELS_INFORMATION.ct_3d.acc);
          if (utils.isSeriesCT()) {
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            const payloadData = {
              microservice: 'orthanc',
              task: 'predict_pathologies',
              file_ID: dicomData.SeriesInstanceUID,
              file_type: 'volumen',
              file_mod: 'ct',
              file_view: 'axial',
              task_class: 'classify',
              task_mode: 'covid',
            };
            UINotificationService.show({
              title: 'Realizando predicción',
              message: 'Este proceso tomara unos segundos.',
              duration: 1000 * 4,
            });
            var promisePetition = predictions.predictMultiplePathologies(payloadData);

            promisePetition
              .then(response => {
                console.log(response);
                console.log(response.hasOwnProperty('error'));
                if (response.hasOwnProperty('error')) {
                  //Handle model with less than 20 slices
                  var uidData = utils.getAllInstancesUIDs();
                  const minInstancesNumber = 20;
                  if (
                    uidData.length < minInstancesNumber &&
                    payloadData.file_type == 'volumen'
                  ) {
                    UINotificationService.show({
                      title: 'Insuficientes instancias',
                      type: 'warning',
                      duration: 15 * 1000,
                      autoClose: false,
                      position: 'topRight',
                      message:
                        'El modelo requiere más instancias dicom para realizar un diagnóstico.',
                    });
                  } else {
                    UINotificationService.show({
                      title: 'Error de Predicción',
                      type: 'warning',
                      duration: 5 * 1000,
                      position: 'topRight',
                      message: 'Por favor intente de nuevo',
                    });
                  }
                } else {
                  console.log(response);
                  utils.generate_distribution('Probabilidades por clase', '', response, services, MODELS_INFORMATION.ct_3d.train_samples, MODELS_INFORMATION.ct_3d.acc);
                }
              })
              .catch(rst => {
                console.log(rst);

                if (rst.status == 400) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de entidad',
                    message:
                      'Por favor verificar la entidad asociada a su usuario.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 403) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Recurso prohibido',
                    message: 'Sin permisos para este servicio.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 401) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de autenticación',
                    message: 'Usuario no autenticado.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 404) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexion.',
                    duration: 1000 * 4,
                  });
                }
              });
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un CT, se recomienda utilizar este modelo sobre series CT.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      predictAxialCovidSliceCt: {
        commandFn: () => {
          if (utils.isSeriesCT()) {
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            var dicomData = utils.getDicomUIDs();
            const payloadData = {
              microservice: 'orthanc',
              task: 'predict_pathologies',
              file_ID: dicomData.SOPInstanceUID,
              file_type: 'slice',
              file_mod: 'ct',
              file_view: 'axial',
              task_class: 'classify',
              task_mode: 'covid',
            };

            UINotificationService.show({
              title: 'Realizando predicción',
              message: 'Este proceso tomara unos segundos.',
              duration: 1000 * 2,
            });

            var promisePetition = predictions.predictMultiplePathologies(payloadData);

            promisePetition
              .then(response => {
                console.log(response);
                console.log(response.hasOwnProperty('error'));
                if (response.hasOwnProperty('error')) {
                  //Handle model with less than 20 slices
                  var uidData = utils.getAllInstancesUIDs();
                  const minInstancesNumber = 20;
                  if (
                    uidData.length < minInstancesNumber &&
                    payloadData.file_type == 'volumen'
                  ) {
                    UINotificationService.show({
                      title: 'Insuficientes instancias',
                      type: 'warning',
                      duration: 15 * 1000,
                      autoClose: false,
                      position: 'topRight',
                      message:
                        'El modelo requiere más instancias dicom para realizar un diagnóstico.',
                    });
                  } else {
                    UINotificationService.show({
                      title: 'Error de Predicción',
                      type: 'warning',
                      duration: 5 * 1000,
                      position: 'topRight',
                      message: 'Por favor intente de nuevo',
                    });
                  }
                } else {
                  console.log(response);
                  utils.generate_distribution('Probabilidades por clase', '', response, services, MODELS_INFORMATION.ct_2d.train_samples, MODELS_INFORMATION.ct_2d.acc);
                }
              })
              .catch(rst => {
                console.log(rst);
                if (rst.status == 400) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de entidad',
                    message:
                      'Por favor verificar la entidad asociada a su usuario.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 403) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Recurso prohibido',
                    message: 'Sin permisos para este servicio.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 401) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de autenticación',
                    message: 'Usuario no autenticado.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 404) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexion.',
                    duration: 1000 * 4,
                  });
                }
              });
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un CT, se recomienda utilizar este modelo sobre series CT.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      predictFrontalMultilabelRx: {
        commandFn: async () => {
          if (!utils.isSeriesCT()) {
            var dicomData = utils.getDicomUIDs();
            const payloadData = {
              microservice: 'orthanc',
              task: 'predict_pathologies',
              file_ID: dicomData.SOPInstanceUID,
              file_type: 'slice',
              file_mod: 'rx',
              file_view: 'frontal',
              task_class: 'classify',
              task_mode: 'diseases',
            };
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            services.notification.show({
              title: 'Prediciendo hallazgos RX',
              message:
                'Por favor espere un momento, mientras se calculan los hallazgos RX de la imágen.',
              type: 'info',
              description:
                'Hubo un problema prediciendo el modelo RX-Hallazgos',
              duration: 1000 * 2,
            });
            var promisePetition = predictions.predictMultiplePathologies(payloadData);
            promisePetition
              .then(response => {
                console.log(response);
                console.log(response.hasOwnProperty('error'));
                if (response.hasOwnProperty('error')) {
                  //Handle model with less than 20 slices
                  var uidData = utils.getAllInstancesUIDs();
                  const minInstancesNumber = 20;
                  if (
                    uidData.length < minInstancesNumber &&
                    payloadData.file_type == 'volumen'
                  ) {
                    UINotificationService.show({
                      title: 'Insuficientes instancias',
                      type: 'warning',
                      duration: 15 * 1000,
                      autoClose: false,
                      position: 'topRight',
                      message:
                        'El modelo requiere más instancias dicom para realizar un diagnóstico.',
                    });
                  } else {
                    UINotificationService.show({
                      title: 'Error de Predicción',
                      type: 'warning',
                      duration: 5 * 1000,
                      position: 'topRight',
                      message: 'Por favor intente de nuevo',
                    });
                  }
                } else {
                  console.log(response);
                  utils.generate_distribution('Probabilidades de patologías', 'Patologías', response, services, MODELS_INFORMATION.rx_hallazgos.train_samples, MODELS_INFORMATION.rx_hallazgos.acc);
                }
              })
              .catch(rst => {
                console.log(rst);
                if (rst.status == 400) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de entidad',
                    message:
                      'Por favor verificar la entidad asociada a su usuario.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 403) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Recurso prohibido',
                    message: 'Sin permisos para este servicio.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 401) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de autenticación',
                    message: 'Usuario no autenticado.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 404) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexion.',
                    duration: 1000 * 4,
                  });
                }
              });
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un RX, se recomienda utilizar este modelo sobre series RX.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      predictFrontalCovidRx: {
        commandFn: async () => {
          if (!utils.isSeriesCT()) {
            var dicomData = utils.getDicomUIDs();
            const payloadData = {
              microservice: 'orthanc',
              task: 'predict_pathologies',
              file_ID: dicomData.SOPInstanceUID,
              file_type: 'slice',
              file_mod: 'rx',
              file_view: 'frontal',
              task_class: 'classify',
              task_mode: 'covid',
            };
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            services.notification.show({
              title: 'Prediciendo hallazgos RX',
              message:
                'Por favor espere un momento, mientras se calculan los hallazgos RX de la imágen.',
              type: 'info',
              duration: 1000 * 2,
            });
            var promisePetition = predictions.predictMultiplePathologies(payloadData);
            promisePetition
              .then(response => {
                console.log(response);
                console.log(response.hasOwnProperty('error'));
                if (response.hasOwnProperty('error')) {
                  //Handle model with less than 20 slices
                  var uidData = utils.getAllInstancesUIDs();
                  const minInstancesNumber = 20;
                  if (
                    uidData.length < minInstancesNumber &&
                    payloadData.file_type == 'volumen'
                  ) {
                    UINotificationService.show({
                      title: 'Insuficientes instancias',
                      type: 'warning',
                      duration: 15 * 1000,
                      autoClose: false,
                      position: 'topRight',
                      message:
                        'El modelo requiere más instancias dicom para realizar un diagnóstico.',
                    });
                  } else {
                    UINotificationService.show({
                      title: 'Error de Predicción',
                      type: 'warning',
                      duration: 5 * 1000,
                      position: 'topRight',
                      message: 'Por favor intente de nuevo',
                    });
                  }
                } else {
                  console.log(response);
                  utils.generate_distribution('Probabilidades de patologías', 'Patologías', response, services, MODELS_INFORMATION.rx_pneumonia.train_samples, MODELS_INFORMATION.rx_pneumonia.acc);
                }
              })
              .catch(rst => {
                console.log(rst);
                if (rst.status == 400) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de entidad',
                    message:
                      'Por favor verificar la entidad asociada a su usuario.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 403) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Recurso prohibido',
                    message: 'Sin permisos para este servicio.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 401) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de autenticación',
                    message: 'Usuario no autenticado.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 404) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexion.',
                    duration: 1000 * 4,
                  });
                }
              });
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un RX, se recomienda utilizar este modelo sobre series RX.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      loadMeasurement: {
        commandFn: () => {
          UINotificationService.show({
            title: 'Recuperando marcaciones',
          });
          const services = {
            notification: UINotificationService,
            modal: UIModalService,
          };
          retrieveAllMeasurements(getDicomUIDs().StudyInstanceUID, services);
        },
        storeContexts: [],
        options: {},
      },
      saveMeasurement: {
        commandFn: () => {
          UINotificationService.show({
            title: 'Guardando marcaciones',
          });
          const services = {
            notification: UINotificationService,
            modal: UIModalService,
          };
          saveMeasurements(services);
        },
        storeContexts: [],
        options: {},
      },
      reload: {
        commandFn: () => {
          location.reload();
        },
        storeContexts: [],
        options: {},
      },
      heatmapAxialCovidVolumeCt: {
        commandFn: () => {
          if (utils.isSeriesCT()) {
            var dicomData = utils.getDicomUIDs();
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            var payloadData = {
              microservice: 'models',
              file_mod: 'ct',
              file_view: 'axial',
              task: 'diagnose',
              file_type: 'volumen',
              file_ID: dicomData.SeriesInstanceUID,
              task_class: 'classify',
              task_mode: 'covid',
            };
            heatmaps.calculateHeatmap(services, payloadData);
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un CT, se recomienda utilizar este modelo sobre series CT.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      heatmapAxialCovidSliceCt: {
        commandFn: () => {
          if (utils.isSeriesCT()) {
            var dicomData = utils.getDicomUIDs();
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            var payloadData = {
              microservice: 'models',
              file_mod: 'ct',
              file_view: 'axial',
              task: 'prepare',
              file_type: 'slice',
              file_ID: dicomData.SeriesInstanceUID,
              task_class: 'classify',
              task_mode: 'covid',
            };
            heatmaps.calculateHeatmap(services, payloadData);
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un CT, se recomienda utilizar este modelo sobre series CT.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      heatmapFrontalMultilabelRx: {
        commandFn: () => {
          if (!utils.isSeriesCT()) {
            var dicomData = utils.getDicomUIDs();
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            var payloadData = {
              microservice: 'models',
              file_mod: 'rx',
              file_view: 'frontal',
              task: 'diagnose',
              file_type: 'slice',
              task_class: 'classify',
              task_mode: 'diseases',
              file_ID: dicomData.SOPInstanceUID,
            };
            heatmaps.calculateHeatmap(services, payloadData);
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un RX, se recomienda utilizar este modelo sobre series RX.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      heatmapFrontalCovidRx: {
        commandFn: () => {
          if (!utils.isSeriesCT()) {
            var dicomData = utils.getDicomUIDs();
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            var payloadData = {
              microservice: 'models',
              file_mod: 'rx',
              file_view: 'frontal',
              task: 'diagnose',
              file_type: 'slice',
              task_class: 'classify',
              task_mode: 'covid',
              file_ID: dicomData.SOPInstanceUID,
            };
            heatmaps.calculateHeatmap(services, payloadData);
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un RX, se recomienda utilizar este modelo sobre series RX.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      analyzeAxialSliceCt: {
        commandFn: () => {
          if (utils.isSeriesCT()) {
            const title = 'Regiones de interés';
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            ohifConf.then(configuration => {
              services.modal.show({
                content: AnalizeRoiModal,
                title,
                contentProps: {
                  modality: 'ct',
                  ohifConf: configuration,
                  services: services,
                },
              });
            });
            ohifConf.catch(error => {
              services.notification.show({
                title: 'Error',
                message: 'No se pudo cargar la configuración de OHIF.',
                type: 'error',
              });
              console.error(error);
            });
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un CT, se recomienda utilizar este modelo sobre series CT.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },

      analyzeFrontalSliceRx: {
        commandFn: () => {
          if (!utils.isSeriesCT()) {
            const title = 'Regiones de interés';
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            ohifConf.then(configuration => {
              services.modal.show({
                content: AnalizeRoiModal,
                title,
                contentProps: {
                  modality: 'rx',
                  ohifConf: configuration,
                  services: services,
                },
              });
            });
            ohifConf.catch(error => {
              services.notification.show({
                title: 'Error',
                message: 'No se pudo cargar la configuración de OHIF.',
                type: 'error',
              });
              console.error(error);
            });
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un RX, se recomienda utilizar este modelo sobre series RX.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      showCurrentSegmentation: {
        commandFn: function () {
          const urlParams = new URLSearchParams(window.location.search);
          const segmentationParam = urlParams.get('sec_user') == 'true';
          console.log('segmentationParam', segmentationParam);

          var segmentationModule = cornerstoneTools.getModule('segmentation');
          var element = cornerstone.getEnabledElements()[0].element;
          segmentationModule.getters.labelmap2D(element);
          var claves = Object.keys(segmentationModule.state.series);
          var ids = getDicomUIDs();
          var waddors = undefined;
          var _idUser = localStorage.getItem('UID');
          claves.forEach(data => {
            var information = data.split('/');
            console.log('ids', ids);
            console.log('information', information);
            if (information[4] === ids.StudyInstanceUID) {
              waddors = data;
            }
          });
          var petition = undefined;
          if (segmentationParam == true) {
            petition = {
              StudyInstanceUID: ids.StudyInstanceUID,
              SeriesInstanceUID: ids.SeriesInstanceUID,
              _idUser: _idUser,
            };
          } else {
            petition = {
              StudyInstanceUID: ids.StudyInstanceUID,
              SeriesInstanceUID: ids.SeriesInstanceUID,
            };
          }

          var len =
            segmentationModule.state.series[waddors].labelmaps3D[0].labelmaps2D
              .length;
          if (
            segmentationModule.state.series[waddors].labelmaps3D[0].labelmaps2D[
              len - 1
            ].segmentsOnLabelmap.length == 0
          ) {
            var result = utils.makeTransaction(
              'segmentations',
              'readList',
              petition
            );
            result
              .then(respuesta => {
                if (respuesta.data == undefined) {
                  UINotificationService.show({
                    title: 'Advertencia',
                    message:
                      'No hay segmentaciones guardadas para este estudio.',
                    type: 'warning',
                  });
                } else {
                  respuesta.data.forEach(seg => {
                    var _segId = seg._segId;
                    console.log('Recuper ada:', JSON.stringify(seg));
                    var segmentation = decoding.decodingSegmentations(seg);
                    console.log('Decodific ada:', JSON.stringify(segmentation));
                    segmentation._segId = _segId;
                    console.log('Para comparar:**********', segmentationModule);
                    console.log(seg.clave, waddors);
                    segmentationModule.state.series[
                      seg.clave
                    ].labelmaps3D[0].labelmaps2D = segmentation;
                  });
                  UINotificationService.show({
                    title: 'Operacion exitosa',
                    message: 'Segmentaciones recuperadas.',
                  });
                }
              })
              .catch(error => {
                console.log(error);
                if (error.status == 400) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de entidad',
                    message:
                      'Por favor verificar la entidad asociada a su usuario.',
                    duration: 1000 * 4,
                  });
                }
                if (error.status == 403) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Recurso prohibido',
                    message: 'Sin permisos para este servicio.',
                    duration: 1000 * 4,
                  });
                }
                if (error.status == 401) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de autenticación',
                    message: 'Usuario no autenticado.',
                    duration: 1000 * 4,
                  });
                }
                if (error.status == 404) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexion.',
                    duration: 1000 * 4,
                  });
                }
              });
          } else {
            UINotificationService.show({
              title: 'No se puede realizar operación',
              message: 'Este estudio ya contiene segmentaciones.',
              type: 'warning',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      segmentate_roi: {
        commandFn: ({ toolName, activeSegmentIndex }) => {
          console.log(toolName, activeSegmentIndex);
          var element = cornerstone.getEnabledElements()[0].element;
          var segmentationModule = cornerstoneTools.getModule('segmentation');
          const {
            labelmap2D,
            labelmap3D,
            currentImageIdIndex,
            activeLabelmapIndex,
          } = segmentationModule.getters.labelmap2D(element);

          console.log(
            toolName,
            labelmap2D,
            labelmap3D,
            currentImageIdIndex,
            activeLabelmapIndex
          );
          cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
          segmentationModule.setters.activeSegmentIndex(
            element,
            activeSegmentIndex
          );
        },
        storeContexts: [],
        options: {},
      },
      createSegmentation: {
        commandFn: () => {
          const services = {
            notification: UINotificationService,
            modal: UIModalService,
          };
          console.log('algo', ohifConf, 'algo');
          const title = 'Establecer segmentacion';
          ohifConf.then(configuration => {
            console.log(configuration.segmentationClasses);
            UIModalService.show({
              content: DeepsarsSegmentationForm,
              title,
              contentProps: {
                onClose: UIModalService.hide,
                SEGMENTATION_OPTIONS: configuration.segmentationClasses,
                UINotificationService: UINotificationService,
              },
            });
          });
          ohifConf.catch(error => {
            services.notification.show({
              title: 'Error',
              message: 'No se pudo cargar la configuración de OHIF.',
              type: 'error',
            });
            console.error(error);
          });
        },
        storeContexts: [],
        options: {},
      },
      saveSegmentation: {
        commandFn: async () => {
          try {
            const urlParams = new URLSearchParams(window.location.search);
            const segmentationParam = urlParams.get('sec_user') == 'true';
            //const segmentationParam = 'true' == 'true';
            console.log('segmentationParam', segmentationParam);

            var segmentationModule = cornerstoneTools.getModule('segmentation');
            var claves = Object.keys(segmentationModule.state.series);
            var ids = utils.getDicomUIDs();
            var waddors = undefined;
            claves.forEach(data => {
              var information = data.split('/');
              console.log('information:', information);
              if (
                information[4] === ids.StudyInstanceUID &&
                information[6] === ids.SeriesInstanceUID
              ) {
                waddors = data;
              }
            });
            var _idUser = localStorage.getItem('UID');
            var segmentation =
              segmentationModule.state.series[waddors].labelmaps3D[0]
                .labelmaps2D;

            var _segId = segmentation._segId;
            console.log(_segId);
            var columns = cornerstone.getEnabledElements()[0].image.columns;
            var rows = cornerstone.getEnabledElements()[0].image.rows;
            var encodingSegmentation = coding.encodingSegmentations(
              segmentation,
              rows,
              columns
            );

            encodingSegmentation.StudyInstanceUID = ids.StudyInstanceUID;
            encodingSegmentation.SeriesInstanceUID = ids.SeriesInstanceUID;
            encodingSegmentation.clave = waddors;

            if (segmentationParam == true) {
              console.log(typeof segmentationParam, 'por usuario');
              encodingSegmentation._idUser = _idUser;
              console.log('id del usuario', _idUser);
              const algo = await utils.getSeriesId({
                Level: 'Series',
                Limit: 2,
                Query: {
                  SeriesInstanceUID: ids.SeriesInstanceUID,
                },
              });
              console.log('id de la serie:', algo[0]);
              const data = {
                query: { ParentSeries: algo[0] },
                add: { annotated: parseInt(_idUser) },
              };

              const respuesta = await utils.makeTransaction(
                'unlabeledStudies',
                'add',
                data
              );

              console.log('respuesta del make transactions', respuesta);
            }
            encodingSegmentation._segId = _segId;

            const result = utils.makeTransaction(
              'segmentations',
              'write',
              encodingSegmentation
            );

            result
              .then(param => {
                UINotificationService.show({
                  title: 'Operacion exitosa',
                  message: 'Segmentaciones guardadas.',
                });
              })
              .catch(rst => {
                if (rst.status == 400) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de entidad',
                    message:
                      'Por favor verificar la entidad asociada a su usuario.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 403) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Recurso prohibido',
                    message: 'Sin permisos para este servicio.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 401) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de autenticación',
                    message: 'Usuario no autenticado.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 404) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexion.',
                    duration: 1000 * 4,
                  });
                }
              });
          } catch (error) {
            console.log(error);
            UINotificationService.show({
              title: 'Operación invalida',
              message: 'No hay segmentaciones para guardar.',
              type: 'warning',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      covid_levels: {
        commandFn: () => {
          if (utils.isSeriesCT()) {
            var dicomData = utils.getDicomUIDs();
            const payloadData = {
              microservice: 'orthanc',
              task: 'predict_pathologies',
              file_ID: dicomData.SeriesInstanceUID,
              file_type: 'volumen',
              file_mod: 'ct',
              file_view: 'axial',
              task_class: 'classify',
              task_mode: 'covid_levels',
            };
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            services.notification.show({
              title: 'Realizando predicción',
              message: 'Por favor espere un momento.',
              type: 'info',
              description: 'Hubo un problema prediciendo.',
              duration: 1000 * 2,
            });

            var promisePetition = predictions.predictMultiplePathologies(
              payloadData
            );
            promisePetition
              .then(response => {
                console.log(response);
                console.log(response.hasOwnProperty('error'));
                if (response.hasOwnProperty('error')) {
                  //Handle model with less than 20 slices
                  var uidData = utils.getAllInstancesUIDs();
                  const minInstancesNumber = 20;
                  if (
                    uidData.length < minInstancesNumber &&
                    payloadData.file_type == 'volumen'
                  ) {
                    UINotificationService.show({
                      title: 'Insuficientes instancias',
                      type: 'warning',
                      duration: 15 * 1000,
                      autoClose: false,
                      position: 'topRight',
                      message:
                        'El modelo requiere más instancias dicom para realizar un diagnóstico.',
                    });
                  } else {
                    UINotificationService.show({
                      title: 'Error de Predicción',
                      type: 'warning',
                      duration: 5 * 1000,
                      position: 'topRight',
                      message: 'Por favor intente de nuevo',
                    });
                  }
                } else {
                  console.log(response);
                  utils.generate_distribution('Niveles de covid', 'Niveles', response, services, MODELS_INFORMATION.covid_levels.train_samples, MODELS_INFORMATION.covid_levels.acc);
                }
              })
              .catch(rst => {
                console.log(rst);
                if (rst.status == 400) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de entidad',
                    message:
                      'Por favor verificar la entidad asociada a su usuario.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 403) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Recurso prohibido',
                    message: 'Sin permisos para este servicio.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 401) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de autenticación',
                    message: 'Usuario no autenticado.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 404) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexion.',
                    duration: 1000 * 4,
                  });
                }
              });
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un CT, se recomienda utilizar este modelo sobre series CT.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      sars2d: {
        commandFn: () => {
          if (utils.isSeriesCT()) {
            var dicomData = utils.getDicomUIDs();
            const payloadData = {
              microservice: 'orthanc',
              task: 'predict_pathologies',
              file_ID: dicomData.SOPInstanceUID,
              file_type: 'slice',
              file_mod: 'ct',
              file_view: 'axial',
              task_class: 'classify',
              task_mode: 'sars',
            };
            const services = {
              notification: UINotificationService,
              modal: UIModalService,
            };
            UINotificationService.show({
              title: 'Realizando predicción',
              message: 'Este proceso tomara unos segundos.',
              duration: 1000 * 2,
            });

            var promisePetition = predictions.predictMultiplePathologies(payloadData);

            promisePetition
              .then(response => {
                console.log(response);
                console.log(response.hasOwnProperty('error'));
                if (response.hasOwnProperty('error')) {
                  //Handle model with less than 20 slices
                  var uidData = utils.getAllInstancesUIDs();
                  const minInstancesNumber = 20;
                  if (
                    uidData.length < minInstancesNumber &&
                    payloadData.file_type == 'volumen'
                  ) {
                    UINotificationService.show({
                      title: 'Insuficientes instancias',
                      type: 'warning',
                      duration: 15 * 1000,
                      autoClose: false,
                      position: 'topRight',
                      message:
                        'El modelo requiere más instancias dicom para realizar un diagnóstico.',
                    });
                  } else {
                    UINotificationService.show({
                      title: 'Error de Predicción',
                      type: 'warning',
                      duration: 5 * 1000,
                      position: 'topRight',
                      message: 'Por favor intente de nuevo',
                    });
                  }
                } else {
                  console.log(response);
                  utils.generate_distribution('Probabilidades por clase', '', response, services, MODELS_INFORMATION.sars_2d.train_samples, MODELS_INFORMATION.sars_2d.acc);
                }
              })
              .catch(rst => {
                console.log(rst);
                if (rst.status == 400) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de entidad',
                    message:
                      'Por favor verificar la entidad asociada a su usuario.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 403) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Recurso prohibido',
                    message: 'Sin permisos para este servicio.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 401) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error de autenticación',
                    message: 'Usuario no autenticado.',
                    duration: 1000 * 4,
                  });
                }
                if (rst.status == 404) {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexion.',
                    duration: 1000 * 4,
                  });
                }
              });
          } else {
            UINotificationService.show({
              title: 'Modalidad incorrecta',
              type: 'warning',
              duration: 15 * 1000,
              autoClose: false,
              position: 'topRight',
              message:
                'la serie actual no es un CT, se recomienda utilizar este modelo sobre series CT.',
            });
          }
        },
        storeContexts: [],
        options: {},
      },
    },

    defaultContext: ['VIEWER'],
  };
};

export default deepsarsCommandsModule;
