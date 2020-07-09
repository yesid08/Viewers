/* eslint-disable no-console */
/*TODO List: By Yesid G.
  1) Create petitions utilities inside of utils.py
  2) Create the logic of each button in the corresponding section (heatmaps.js or predictions.js) by using functions.
  3) Inside this file(commands module) just call the functions from heatmaps.js or predictions.js in front of each commandFn.
  4) This file should have the same form of the one that is currently in index, the idea is to export the whole object to index.
  5) In the file index.js import this commandsModule.js file and return the object of this file
  6) commit the changes and have fun!
*/

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
            1,
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
            2,
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
            2,
            BUTTONS.BUTTON_RX_PATHOLOGY,
            BUTTONS.BUTTON_RX_PROBABILITY,
            UINotificationService,
            'slice',
            'RX',
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
      load_heat_map: {
        commandFn: () => {
          heatmaps.heatMaps(UINotificationService);
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
    },

    defaultContext: ['VIEWER'],
  };
};

export default deepsarsCommandsModule;
