import ToolbarModule from './ToolbarModule';
import deepsarsCommandsModule from './ComandsModule';

export const DeepSARSAiExtension = {
  id: 'DeepSars extension',
  getToolbarModule() {
    return ToolbarModule;
  },
  getCommandsModule({ servicesManager, commandsManager }) {
    return deepsarsCommandsModule({ servicesManager, commandsManager });
  },
};
