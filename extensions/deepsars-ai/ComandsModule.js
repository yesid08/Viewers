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

const deepsarsCommandsModule = ({ servicesManager }) => {
  const { UINotificationService, UIModalService } = servicesManager.services;
  return {
    definitions: {
      predecirVolumenCt: {
        commandFn: () => {
          UINotificationService.show({
            title: 'No disponible',
            message: 'Esta funcionalidad se encuentra en mantenimiento.',
            type: 'warning',
          });
          /* predictions.predecir(
            BUTTONS.BUTTON_CT_VOLUME_PATHOLOGY,
            BUTTONS.BUTTON_CT_VOLUME_PROBABILITY,
            UINotificationService,
            'volumen',
            'ct',
            'axial'
          ); */
        },
        storeContexts: [],
        options: {},
      },
      predecirSliceCt: {
        commandFn: () => {
          predictions.predecir(
            BUTTONS.BUTTON_CT_SLICE_PATHOLOGY,
            BUTTONS.BUTTON_CT_SLICE_PROBABILITY,
            UINotificationService,
            'slice',
            'ct',
            'axial'
          );
        },
        storeContexts: [],
        options: {},
      },
      predecirSliceRx: {
        commandFn: () => {
          predictions.predecir(
            BUTTONS.BUTTON_RX_PATHOLOGY,
            BUTTONS.BUTTON_RX_PROBABILITY,
            UINotificationService,
            'slice',
            'rx',
            'frontal'
          );
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
      load_ct_axial_heat_map_volumen: {
        commandFn: () => {
          heatmaps.ctAxialheatMapVolumen(UINotificationService);
        },
        storeContexts: [],
        options: {},
      },
      load_ct_axial_heat_map_slice: {
        commandFn: () => {
          heatmaps.ctAxialheatMapSlice(UINotificationService);
        },
        storeContexts: [],
        options: {},
      },
      analyze_ct_axial_slice: {
        commandFn: () => {
          analyzeRoi.ctAxialAnalyzeSlice(UINotificationService);
        },
        storeContexts: [],
        options: {},
      },
      load_rx_frontal_heat_map: {
        commandFn: () => {
          heatmaps.rxFrontalheatMap(UINotificationService);
        },
        storeContexts: [],
        options: {},
      },
      analyze_rx_frontal_slice: {
        commandFn: () => {
          analyzeRoi.rxFrontalAnalyzeSlice(UINotificationService);
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
          var segmentationModule = cornerstoneTools.getModule('segmentation');
          /* var claves = Object.keys(segmentationModule.state.series);
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
            segmentationModule.state.series[waddors].labelmaps3D[0].labelmaps2D;
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
          utils.makeTransaction('segmentations', 'write', encodingSegmentation); */
        },
        storeContexts: [],
        options: {},
      },
      recoverSegmentation: {
        commandFn: async () => {
          console.log('Recover segmentation');
          /* var segmentationModule = cornerstoneTools.getModule('segmentation');
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
          ].labelmaps3D[0].labelmaps2D = segmentation; */
        },
        storeContexts: [],
        options: {},
      },
    },

    defaultContext: ['VIEWER'],
  };
};

export default deepsarsCommandsModule;
