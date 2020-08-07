/* eslint-disable no-console */
import { retrieveAllMeasurements, saveMeasurements } from './Measurements';
import { getDicomUIDs } from './utils';
import cornerstoneTools from 'cornerstone-tools';
import * as BUTTONS from './ToolbarModule';
import * as predictions from './operationsAI/predictions';
import * as heatmaps from './operationsAI/heatmaps';
import * as analyzeRoi from './operationsAI/analyzeRoi';
import cornerstone from 'cornerstone-core';
import DeepsarsSegmentationForm from './DeepsarsSegmentationForm';
import * as coding from './segmentationModule/encoder';
import * as decoding from './segmentationModule/decoder';
import * as utils from './utils';
import { states } from './Estados/estadosHerramientas';

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
          const buttons = {
            pathology: BUTTONS.BUTTON_CT_VOLUME_PATHOLOGY,
            probability: BUTTONS.BUTTON_CT_VOLUME_PROBABILITY,
          };
          const services = {
            notification: UINotificationService,
            modal: UIModalService,
          };
          predictions.predictAPathology(buttons, services, payloadData);
        },
        storeContexts: [],
        options: {},
      },
      predictAxialCovidSliceCt: {
        commandFn: () => {
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
          const buttons = {
            pathology: BUTTONS.BUTTON_CT_SLICE_PATHOLOGY,
            probability: BUTTONS.BUTTON_CT_SLICE_PROBABILITY,
          };
          const services = {
            notification: UINotificationService,
            modal: UIModalService,
          };
          predictions.predictAPathology(buttons, services, payloadData);
        },
        storeContexts: [],
        options: {},
      },
      predictFrontalMultilabelRx: {
        commandFn: () => {
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
          predictions.predictMultiplePathologies(services, payloadData);
        },
        storeContexts: [],
        options: {},
      },
      predictFrontalCovidRx: {
        commandFn: () => {
          var dicomData = utils.getDicomUIDs();
          const payloadData = {
            microservice: 'orthanc',
            task: 'predict_pathology',
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
          const buttons = {
            pathology: BUTTONS.BUTTON_RX_COVID_PATHOLOGY,
            probability: BUTTONS.BUTTON_RX_COVID_PROBABILITY,
          };
          services.notification.show({
            title: 'En Desarrollo',
            message: 'Esta funcionalidad se encuentra en fase de desarrollo.',
            type: 'warning',
          });
          predictions.predictAPathology(buttons, services, payloadData);
        },
        storeContexts: [],
        options: {},
      },
      load_measurement: {
        commandFn: () => {
          UINotificationService.show({
            title: 'Recuperando marcaciones',
          });

          retrieveAllMeasurements(getDicomUIDs().StudyInstanceUID);
        },
        storeContexts: [],
        options: {},
      },
      save_measurement: {
        commandFn: () => {
          UINotificationService.show({
            title: 'Guardando marcaciones',
          });
          saveMeasurements();
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
          var dicomData = utils.getDicomUIDs();
          const services = {
            notification: UINotificationService,
            modal: UIModalService,
          };
          var payloadData = {
            microservice: 'models',
            file_mod: 'ct',
            file_view: 'axial',
            task: 'analyze_zones',
            file_type: 'slice',
            task_class: 'detect',
            task_mode: 'covid',
            file_ID: dicomData.SOPInstanceUID,
          };
          analyzeRoi.analyzeSlice(services, payloadData);
        },
        storeContexts: [],
        options: {},
      },

      analyzeFrontalSliceRx: {
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
            task: 'analyze_zones',
            file_type: 'slice',
            task_class: 'detect',
            task_mode: 'covid',
            file_ID: dicomData.SOPInstanceUID,
          };
          analyzeRoi.analyzeSlice(services, payloadData);
        },
        storeContexts: [],
        options: {},
      },
      show_current_segmentation: {
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
          const title = 'Establecer segmentacion';

          UIModalService.show({
            content: DeepsarsSegmentationForm,
            title,
            contentProps: {
              onClose: UIModalService.hide,
            },
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
            console.log(waddors);

            var segmentation =
              segmentationModule.state.series[waddors].labelmaps3D[0]
                .labelmaps2D;
            var columns = cornerstone.getEnabledElements()[0].image.columns;
            var rows = cornerstone.getEnabledElements()[0].image.rows;
            console.log(segmentation, columns, rows);
            var encodingSegmentation = coding.encodingSegmentations(
              segmentation,
              columns,
              rows
            );
            encodingSegmentation.StudyInstanceUID = ids.StudyInstanceUID;
            encodingSegmentation.SeriesInstanceUID = ids.SeriesInstanceUID;
            encodingSegmentation.clave = waddors;
            console.log(encodingSegmentation);
            utils.makeTransaction(
              'segmentations',
              'write',
              encodingSegmentation
            );
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
            var result = await utils.makeTransaction(
              'segmentations',
              'read',
              petition
            );
            console.log(result);
            var segmentation = decoding.decodingSegmentations(result.data);
            console.log(segmentation);
            segmentationModule.state.series[
              result.data.clave
            ].labelmaps3D[0].labelmaps2D = segmentation;
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
