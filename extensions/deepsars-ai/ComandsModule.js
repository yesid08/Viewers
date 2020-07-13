import { retrieveAllMeasurements, saveMeasurements } from './Measurements';
import { getDicomUIDs } from './utils';
import cornerstoneTools from 'cornerstone-tools';
import * as BUTTONS from './ToolbarModule';
import * as predictions from './operationsAI/predictions';
import * as heatmaps from './operationsAI/heatmaps';

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
      load_ct_axial_heat_map: {
        commandFn: () => {
          heatmaps.ctAxialheatMap(UINotificationService);
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
        commandFn: ({ toolName }) => {
          if (!toolName) {
            console.warn('No toolname provided to setToolActive command');
          }
          console.log('the tool ' + toolName + ' is being used');
          console.log(cornerstoneTools);
          cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
        },
      },
    },

    defaultContext: ['VIEWER'],
  };
};

export default deepsarsCommandsModule;
