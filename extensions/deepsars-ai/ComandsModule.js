import { retrieveAllMeasurements, saveMeasurements } from './Measurements';
import { getDicomUIDs } from './utils';
import cornerstoneTools from 'cornerstone-tools';
import * as BUTTONS from './ToolbarModule';
import * as predictions from './operationsAI/predictions';
import * as heatmaps from './operationsAI/heatmaps';
import * as analyzeRoi from './operationsAI/analyzeRoi';
import cornerstone from 'cornerstone-core';

const deepsarsCommandsModule = ({ servicesManager, commandsManager }) => {
  const { UINotificationService } = servicesManager.services;
  return {
    definitions: {
      predecirVolumenCt: {
        commandFn: () => {
          predictions.predecir(
            BUTTONS.BUTTON_CT_VOLUME_PATHOLOGY,
            BUTTONS.BUTTON_CT_VOLUME_PROBABILITY,
            UINotificationService,
            'volumen',
            'ct',
            'axial'
          );
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
      show_current_segmentation: {
        commandFn: function() {
          const dicomUIDs = getDicomUIDs();
          var segmentationModule = cornerstoneTools.getModule('segmentation');
          var segmentationSeries = segmentationModule.state.series;
          var wadorsKey = Object.keys(segmentationSeries).find(wadors => {
            return wadors.split('/').slice(-7)[0] == dicomUIDs.StudyInstanceUID;
          });
          if (!wadorsKey) {
            console.log('There are no segmentations to show');
          } else {
            var segmentationSeriesMetadata =
              segmentationSeries[wadorsKey].labelmaps3D[0].metadata;
            console.log(segmentationSeriesMetadata);
            var segmentationMaskDataArray =
              segmentationSeries[wadorsKey].labelmaps3D[0].labelmaps2D;
            console.log(segmentationMaskDataArray);
          }
        },
        storeContexts: [],
        options: {},
      },
      segmentate_roi: {
        commandFn: ({ toolName, activeSegmentIndex }) => {
          var element = cornerstone.getEnabledElements()[0].element;
          var segmentationModule = cornerstoneTools.getModule('segmentation');
          console.log(segmentationModule);
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
      aumentar: {
        commandFn: () => {
          var imageId = cornerstone.getEnabledElements()[0].image.imageId;
          var segmentationModule = cornerstoneTools.getModule('segmentation');
          var indice =
            segmentationModule.state.series[imageId].labelmaps3D[0]
              .activeSegmentIndex;
          segmentationModule.state.series[
            imageId
          ].labelmaps3D[0].activeSegmentIndex = indice + 1;
        },
        storeContexts: [],
        options: {},
      },
      disminuir: {
        commandFn: () => {
          var imageId = cornerstone.getEnabledElements()[0].image.imageId;
          var segmentationModule = cornerstoneTools.getModule('segmentation');
          var indice =
            segmentationModule.state.series[imageId].labelmaps3D[0]
              .activeSegmentIndex;
          segmentationModule.state.series[
            imageId
          ].labelmaps3D[0].activeSegmentIndex = indice - 1;
        },
        storeContexts: [],
        options: {},
      },
    },

    defaultContext: ['VIEWER'],
  };
};

export default deepsarsCommandsModule;
