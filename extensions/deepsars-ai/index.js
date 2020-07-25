import ToolbarModule from './ToolbarModule';
import deepsarsCommandsModule from './ComandsModule';
import init from './init';
import DeepsarsSegmentationForm from './DeepsarsSegmentationForm';

export const DeepSARSAiExtension = {
  id: 'DeepSars extension',
  preRegistration({ servicesManager, configuration = {} }) {
    init({ servicesManager, configuration });
  },
  getToolbarModule() {
    return ToolbarModule;
  },
  getCommandsModule({ servicesManager, commandsManager }) {
    return deepsarsCommandsModule({ servicesManager, commandsManager });
  },
};

export { DeepsarsSegmentationForm };
