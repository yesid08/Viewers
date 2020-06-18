const BUTTON_CT_VOLUME_PREDICT = {
  id: 'PredecirVolumen',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'predecirVolumenCt',
};
const BUTTON_CT_VOLUME_PATHOLOGY = {
  id: 'pathologyVolumen',
  label: 'Patología',
  icon: 'lung',
};
const BUTTON_CT_VOLUME_PROBABILITY = {
  id: 'precisionVolumen',
  label: 'Precisión',
  icon: 'measure-target',
};
const BUTTON_CT_VOLUME = {
  id: 'Volumen-CT',
  label: 'Volumen-CT',
  icon: 'brain',
  buttons: [
    BUTTON_CT_VOLUME_PREDICT,
    BUTTON_CT_VOLUME_PATHOLOGY,
    BUTTON_CT_VOLUME_PROBABILITY,
  ],
};
const BUTTON_CT_SLICE_PREDICT = {
  id: 'PredecirSlice',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'predecirSliceCt',
};
const BUTTON_CT_SLICE_PATHOLOGY = {
  id: 'pathologySlice',
  label: 'Patología',
  icon: 'lung',
};
const BUTTON_CT_SLICE_PROBABILITY = {
  id: 'precisionSlice',
  label: 'Precisión',
  icon: 'measure-target',
};
const BUTTON_CT_SLICE = {
  id: 'Slice-CT',
  label: 'Slice-CT',
  icon: 'brain',
  buttons: [
    BUTTON_CT_SLICE_PREDICT,
    BUTTON_CT_SLICE_PATHOLOGY,
    BUTTON_CT_SLICE_PROBABILITY,
  ],
};
const BUTTON_RX_PREDICT = {
  id: 'PredecirSlice',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'predecirSliceRx',
};
const BUTTON_RX_PATHOLOGY = {
  id: 'pathologySlice',
  label: 'Patología',
  icon: 'lung',
};
const BUTTON_RX_PROBABILITY = {
  id: 'precisionSlice',
  label: 'Precisión',
  icon: 'measure-target',
};
const BUTTON_RX = {
  id: 'Slice-RX',
  label: 'Slice-RX',
  icon: 'brain',
  buttons: [BUTTON_RX_PREDICT, BUTTON_RX_PATHOLOGY, BUTTON_RX_PROBABILITY],
};
export default {
  definitions: [BUTTON_CT_VOLUME, BUTTON_CT_SLICE, BUTTON_RX],
  defaultContext: 'VIEWER',
};
