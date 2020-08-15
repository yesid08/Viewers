import ToolbarModule from './ToolbarModule';
import deepsarsCommandsModule from './ComandsModule';
import init from './init';
import DeepsarsSegmentationForm from './DeepsarsSegmentationForm';
import { ohifConf } from './configuration';

export const DeepSARSAiExtension = {
  id: 'DeepSars extension',
  async preRegistration({ servicesManager, configuration = {} }) {
    init({ servicesManager, configuration });
    console.log('*****', ohifConf, '*****');
  },
  getToolbarModule() {
    return ToolbarModule;
  },
  getCommandsModule({ servicesManager, commandsManager }) {
    return deepsarsCommandsModule({ servicesManager, commandsManager });
  },
};

export { DeepsarsSegmentationForm, ohifConf };
