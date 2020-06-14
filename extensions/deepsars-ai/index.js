import { OHIF } from '@ohif/core';
import { utils } from '@ohif/core';
import PropTypes from 'prop-types';
import * as dcmjs from 'dcmjs';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import CornerstoneViewport from 'react-cornerstone-viewport';

const { studyMetadataManager } = utils;
//const studies = studyMetadataManager.all();
const { StudyPrefetcher } = OHIF.classes;
const studies = StudyPrefetcher.getInstance();
// viewportSpecificData and activeViewportIndex are exposed in redux under `viewports`
//const { displaySetInstanceUid, studyInstanceUid } =

/* const study = studies.find(
  study => study.studyInstanceUID === studyInstanceUid
); */
// viewportSpecificData and activeViewportIndex are exposed in redux under `viewports`
/* const { displaySetInstanceUid, studyInstanceUid } = viewportSpecificData[
  activeViewportIndex
]; */

var pLayButtonCtVolumes = {
  id: 'PredecirVolumen',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'comando01',
};
var pathologyButtonCtVolumes = {
  id: 'pathologyVolumen',
  label: 'Patología',
  icon: 'lung',
};
var precisionButtonCtVolumes = {
  id: 'precisionVolumen',
  label: 'Precisión',
  icon: 'measure-target',
};
export const DeepSARSAIExtension = {
  id: 'volumenExtension',
  getToolbarModule() {
    return {
      definitions: [
        {
          id: 'Volumen-CT',
          label: 'Volumen-CT',
          icon: 'brain',
          buttons: [
            pLayButtonCtVolumes,
            pathologyButtonCtVolumes,
            precisionButtonCtVolumes,
          ],
        },
      ],
      defaultContext: 'VIEWER',
    };
  },
  getCommandsModule({ servicesManager, commandsManager }) {
    const { UINotificationService } = servicesManager.services;
    return {
      definitions: {
        comando01: {
          commandFn: function() {
            console.log(OHIF.utils.DicomLoaderService);
            console.log(OHIF.redux.actions);
            console.log(cornerstone);
            console.log(PropTypes);
            console.log(StudyPrefetcher);
            //console.log(activeViewportIndex);
            UINotificationService.show({
              title: 'Realizando predicción',
              message: 'Este proceso tomara un par de segundos',
            });
          },
          storeContexts: [],
          options: {},
        },
      },
      defaultContext: ['VIEWER'],
    };
  },
};
