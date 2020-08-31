/* eslint-disable no-console */
import { retrieveAllMeasurements, saveMeasurements } from './Measurements';
import { getDicomUIDs } from './utils';
import cornerstoneTools from 'cornerstone-tools';
import * as BUTTONS from './ToolbarModule';
import * as predictions from './operationsAI/predictions';
import * as heatmaps from './operationsAI/heatmaps';
import cornerstone from 'cornerstone-core';
import DeepsarsSegmentationForm from './DeepsarsSegmentationForm';
import * as coding from './segmentationModule/encoderV4';
import * as decoding from './segmentationModule/decoderV4';
import * as utils from './utils';
import { states } from './Estados/estadosHerramientas';
import { ohifConf } from './index';
import probabilityDistributionModal from './Modals/ProbabilityDistributionModal';
import AnalizeRoiModal from './Modals/AnalyzeRoiModal';
const deepsarsCommandsModule = ({ servicesManager }) => {
  const { UINotificationService, UIModalService } = servicesManager.services;
  return {
    definitions: {
      predictAxialCovidVolumeCt: {
        commandFn: () => {
          /* UINotificationService.show({
            title: 'No disponible',
            message: 'Esta funcionalidad se encuentra en mantenimiento.',
            type: 'warning',
          }); */
          var dicomData = utils.getDicomUIDs();
          if (utils.isSeriesCT()) {
            const payloadData = {
              microservice: 'orthanc',
              task: 'predict_pathology',
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
              duration: 1000 * 2,
            });
            var promisePetition = predictions.predictAPathology(payloadData);

            promisePetition
              .then(response => {
                console.log(response);
                console.log(response.data.hasOwnProperty('error'));
                if (response.data.hasOwnProperty('error')) {
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
                  var pathology = response.data.class;
                  var probability =
                    response.data.probability.toFixed(2) * 100 + '%';
                  BUTTONS.BUTTON_PATHOLOGY.label = pathology;
                  BUTTONS.BUTTON_PROBABILITY.label = probability;

                  UINotificationService.show({
                    title: 'Predicción exitosa',
                    message:
                      'La clase predicha fue ' +
                      pathology +
                      ' con una confianza de ' +
                      probability,
                    duration: 1000 * 15,
                    type: 'success',
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
            var dicomData = utils.getDicomUIDs();
            const payloadData = {
              microservice: 'orthanc',
              task: 'predict_pathology',
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

            var promisePetition = predictions.predictAPathology(payloadData);

            promisePetition
              .then(response => {
                console.log(response);
                console.log(response.data.hasOwnProperty('error'));
                if (response.data.hasOwnProperty('error')) {
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
                  var pathology = response.data.class;
                  var probability =
                    response.data.probability.toFixed(2) * 100 + '%';
                  BUTTONS.BUTTON_PATHOLOGY.label = pathology;
                  BUTTONS.BUTTON_PROBABILITY.label = probability;
                  UINotificationService.show({
                    title: 'Predicción exitosa',
                    message:
                      'La clase predicha fue ' +
                      pathology +
                      ' con una confianza de ' +
                      probability,
                    duration: 1000 * 15,
                    type: 'success',
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
        //guia
        commandFn: async () => {
          const title = 'Hallazgos encontrados';
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
            description: 'Hubo un problema prediciendo el modelo RX-Hallazgos',
          });
          const pathologiesData = await predictions.predictMultiplePathologies(
            payloadData
          );
          if (pathologiesData.hasOwnProperty('error')) {
            services.notification.show({
              title: 'Error',
              message: 'Sin conexión',
              type: 'error',
              description:
                'Hubo un problema prediciendo el modelo RX-Hallazgos',
            });
          } else {
            console.log(pathologiesData);
            const data = [
              {
                type: 'bar',
                name: 'Probabilidad de patología',
                marker: {
                  color: '#7cb342',
                },
                orientation: 'v',
                x: Object.keys(pathologiesData),
                y: Object.values(pathologiesData),
              },
            ];
            const layout = {
              title: 'Probabilidad de patologías',
              plot_bgcolor: '#151A1F',
              paper_bgcolor: '#151A1F',
              font: {
                family: 'Roboto',
                color: '#ffffff',
              },
              xaxis: {
                title: 'Patologías',
                tickangle: -45,
              },
              yaxis: {
                title: 'Probabilidad [%]',
                gridcolor: '#ffffff',
                domain: [0, 100],
              },
              showlegend: false,
            };
            UIModalService.show({
              content: probabilityDistributionModal,
              title,
              contentProps: {
                chartData: data,
                chartLayout: layout,
              },
            });
          }
        },
        storeContexts: [],
        options: {},
      },
      predictFrontalCovidRx: {
        //cuadrar
        commandFn: async () => {
          const title = 'Hallazgos encontrados';
          console.log('algo');
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
            description: 'Hubo un problema prediciendo el modelo RX-Hallazgos',
          });
          const pathologiesData = await predictions.predictMultiplePathologies(
            payloadData
          );
          if (pathologiesData.hasOwnProperty('error')) {
            services.notification.show({
              title: 'Error',
              message: 'Sin conexión',
              type: 'error',
              description:
                'Hubo un problema prediciendo el modelo RX-Hallazgos',
            });
          } else {
            console.log(pathologiesData);
            const data = [
              {
                type: 'bar',
                name: 'Probabilidad de patología',
                marker: {
                  color: '#7cb342',
                },
                orientation: 'v',
                x: Object.keys(pathologiesData),
                y: Object.values(pathologiesData),
              },
            ];
            const layout = {
              title: 'Probabilidad de patologías',
              plot_bgcolor: '#151A1F',
              paper_bgcolor: '#151A1F',
              font: {
                family: 'Roboto',
                color: '#ffffff',
              },
              xaxis: {
                title: 'Patologías',
                tickangle: -45,
              },
              yaxis: {
                title: 'Probabilidad [%]',
                gridcolor: '#ffffff',
                domain: [0, 100],
              },
              showlegend: false,
            };
            UIModalService.show({
              content: probabilityDistributionModal,
              title,
              contentProps: {
                chartData: data,
                chartLayout: layout,
              },
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
        },
        storeContexts: [],
        options: {},
      },
      heatmapAxialCovidSliceCt: {
        commandFn: () => {
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
        },
        storeContexts: [],
        options: {},
      },
      heatmapFrontalMultilabelRx: {
        commandFn: () => {
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
        },
        storeContexts: [],
        options: {},
      },
      heatmapFrontalCovidRx: {
        commandFn: () => {
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
        },
        storeContexts: [],
        options: {},
      },
      analyzeAxialSliceCt: {
        commandFn: () => {
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
        },
        storeContexts: [],
        options: {},
      },

      analyzeFrontalSliceRx: {
        commandFn: () => {
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
        },
        storeContexts: [],
        options: {},
      },
      showCurrentSegmentation: {
        commandFn: function() {
          var segmentationModule = cornerstoneTools.getModule('segmentation');
          console.log(segmentationModule);
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
        commandFn: () => {
          if (states[0].isActive == false) {
            UINotificationService.show({
              title: states[0].name,
              message: states[0].message,
              type: states[0].state,
            });
          } else {
            var segmentationModule = cornerstoneTools.getModule('segmentation');
            var claves = Object.keys(segmentationModule.state.series);
            var ids = utils.getDicomUIDs();
            var waddors = undefined;
            claves.forEach(data => {
              var information = data.split('/');
              if (information[6] === ids.StudyInstanceUID) {
                waddors = data;
              }
            });

            var segmentation =
              segmentationModule.state.series[waddors].labelmaps3D[0]
                .labelmaps2D;
            var _segId = segmentation._segId;
            var columns = cornerstone.getEnabledElements()[0].image.columns;
            var rows = cornerstone.getEnabledElements()[0].image.rows;
            var encodingSegmentation = coding.encodingSegmentations(
              segmentation,
              columns,
              rows
            );

            encodingSegmentation.StudyInstanceUID = ids.StudyInstanceUID;
            encodingSegmentation.SeriesInstanceUID = ids.SeriesInstanceUID;
            encodingSegmentation.clave = waddors;
            encodingSegmentation._segId = _segId;

            console.log('***', encodingSegmentation);

            const result = utils.makeTransaction(
              'segmentations',
              'write',
              encodingSegmentation
            );
            result.then(param => {
              UINotificationService.show({
                title: 'Operacion exitosa',
                message: 'Segmentaciones guardadas.',
              }).catch(param => {
                UINotificationService.show({
                  title: 'Error al guardar',
                  message: 'Por favor intente de nuevo.',
                });
              });
            });

            console.log(result);
          }
        },
        storeContexts: [],
        options: {},
      },
      recoverSegmentation: {
        commandFn: async () => {
          if (states[0].isActive == false) {
            UINotificationService.show({
              title: states[0].name,
              message: states[0].message,
              type: states[0].state,
            });
          } else {
            var segmentationModule = cornerstoneTools.getModule('segmentation');
            var element = cornerstone.getEnabledElements()[0].element;
            segmentationModule.getters.labelmap2D(element);
            var ids = utils.getDicomUIDs();
            console.log(ids);
            var petition = {
              StudyInstanceUID: ids.StudyInstanceUID,
              SeriesInstanceUID: ids.SeriesInstanceUID,
            };

            try {
              var result = await utils.makeTransaction(
                'segmentations',
                'readList',
                petition
              );
              console.log(result.data.length, result);
              result.data.forEach(seg => {
                const _segId = seg._segId;
                var segmentation = decoding.decodingSegmentations(seg);
                segmentation._segId = _segId;
                console.log('+++', segmentation);
                segmentationModule.state.series[
                  seg.clave
                ].labelmaps3D[0].labelmaps2D = segmentation;
              });
              UINotificationService.show({
                title: 'Operacion exitosa',
                message: 'Segmentaciones recuperadas.',
              });
            } catch (error) {
              console.log(error);
              UINotificationService.show({
                title: 'Error',
                message: 'No hay segmentaciones guardadas para este estudio.',
              });
            }
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
