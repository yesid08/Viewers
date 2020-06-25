const BUTTON_CT_VOLUME_PREDICT = {
  id: 'PredecirVolumen',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'predecirVolumenCt',
};
export const BUTTON_CT_VOLUME_PATHOLOGY = {
  id: 'pathologyVolumen',
  label: 'Patología',
  icon: 'lung',
};
export const BUTTON_CT_VOLUME_PROBABILITY = {
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
const BUTTON_MEASUREMENT_SAVE = {
  id: 'saveMeasurement',
  label: 'Guardar Marcaciones',
  icon: 'database',
  type: 'command',
  commandName: 'save_measurement',
};
const BUTTON_MEASUREMENT_LOAD = {
  id: 'loadMeasurement',
  label: 'Cargar Marcaciones',
  icon: 'inline-edit',
  type: 'command',
  commandName: 'load_measurement',
};
const BUTTON_MEASUREMENT = {
  id: 'measurement',
  label: 'Anotaciones',
  icon: 'list',
  buttons: [BUTTON_MEASUREMENT_SAVE, BUTTON_MEASUREMENT_LOAD],
};
const BUTTON_HEAT_MAP_2D = {
  id: 'heat_map_2d',
  label: 'Mapa de calor',
  icon: 'sun',
  commandName: 'load_heat_map',
};
const BUTTON_RELOAD = {
  id: 'reload',
  label: 'Recargar',
  icon: 'reset',
  commandName: 'reload',
};
const BUTTON_SHOW_SEGMENTATION = {
  id: 'segmentation',
  label: 'Mostrar segmentaciones',
  icon: 'dot-circle',
  commandName: 'show_current_segmentation',
};
export default {
  definitions: [
    BUTTON_CT_VOLUME,
    BUTTON_CT_SLICE,
    BUTTON_RX,
    BUTTON_MEASUREMENT,
    BUTTON_HEAT_MAP_2D,
    BUTTON_RELOAD,
    BUTTON_SHOW_SEGMENTATION,
  ],
  defaultContext: 'VIEWER',
};
