export default {
  definitions: [
    {
      id: 'Volumen-CT',
      label: 'Volumen-CT',
      icon: 'brain',
      buttons: [
        {
          id: 'PredecirVolumen',
          label: 'Predecir',
          icon: 'play',
          type: 'command',
          commandName: 'predecirVolumenCt',
        },
        {
          id: 'pathologyVolumen',
          label: 'Patología',
          icon: 'lung',
        },
        {
          id: 'precisionVolumen',
          label: 'Precisión',
          icon: 'measure-target',
        },
      ],
    },
    {
      id: 'Slice-CT',
      label: 'Slice-CT',
      icon: 'brain',
      buttons: [
        {
          id: 'PredecirSlice',
          label: 'Predecir',
          icon: 'play',
          type: 'command',
          commandName: 'predecirSliceCt',
        },
        {
          id: 'pathologySlice',
          label: 'Patología',
          icon: 'lung',
        },
        {
          id: 'precisionSlice',
          label: 'Precisión',
          icon: 'measure-target',
        },
      ],
    },
    {
      id: 'Slice-RX',
      label: 'Slice-RX',
      icon: 'brain',
      buttons: [
        {
          id: 'PredecirSlice',
          label: 'Predecir',
          icon: 'play',
          type: 'command',
          commandName: 'predecirSliceRx',
        },
        {
          id: 'pathologySlice',
          label: 'Patología',
          icon: 'lung',
        },
        {
          id: 'precisionSlice',
          label: 'Precisión',
          icon: 'measure-target',
        },
      ],
    },
  ],
  defaultContext: 'VIEWER',
};
