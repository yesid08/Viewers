import cornerstone from 'cornerstone-core';

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
            console.log(cornerstone.getEnabledElements());
            UINotificationService.show({
              title: 'Modal de prueba',
              message: 'Esto es un modal',
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
