const BUTTON_CT_VOLUME_PREDICT = {
  id: 'PredecirVolumen',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'predictAxialCovidVolumeCt',
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
const BUTTON_CT_AXIAL_HEAT_MAP_3D = {
  id: 'ct_axial_heat_map_3d',
  label: 'Mapa de calor',
  icon: 'sun',
  commandName: 'heatmapAxialCovidVolumeCt',
};
const BUTTON_CT_VOLUME = {
  id: 'Volumen-CT',
  label: 'Volumen-CT',
  icon: 'brain',
  buttons: [
    BUTTON_CT_VOLUME_PREDICT,
    BUTTON_CT_VOLUME_PATHOLOGY,
    BUTTON_CT_VOLUME_PROBABILITY,
    BUTTON_CT_AXIAL_HEAT_MAP_3D,
  ],
};
const BUTTON_CT_SLICE_PREDICT = {
  id: 'PredecirSlice',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'predictAxialCovidSliceCt',
};
export const BUTTON_CT_SLICE_PATHOLOGY = {
  id: 'pathologySlice',
  label: 'Patología',
  icon: 'lung',
};
export const BUTTON_CT_SLICE_PROBABILITY = {
  id: 'precisionSlice',
  label: 'Precisión',
  icon: 'measure-target',
};
const BUTTON_CT_AXIAL_HEAT_MAP_2D = {
  id: 'ct_axial_heat_map_2d',
  label: 'Mapa de calor',
  icon: 'sun',
  commandName: 'heatmapAxialCovidSliceCt',
};
const BUTTON_CT_AXIAL_ANALYZE = {
  id: 'ct_axial_slice_analyze',
  label: 'zonas de interés',
  icon: 'search',
  commandName: 'analyzeAxialSliceCt',
};
const BUTTON_CT_SLICE = {
  id: 'Slice-CT',
  label: 'Slice-CT',
  icon: 'brain',
  buttons: [
    BUTTON_CT_SLICE_PREDICT,
    BUTTON_CT_SLICE_PATHOLOGY,
    BUTTON_CT_SLICE_PROBABILITY,
    BUTTON_CT_AXIAL_HEAT_MAP_2D,
    BUTTON_CT_AXIAL_ANALYZE,
  ],
};
const BUTTON_RX_PREDICT = {
  id: 'PredecirSlice',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'predictFrontalMultilabelRx',
};

export const BUTTON_RX_PATHOLOGY = {
  id: 'pathologySlice',
  label: 'Patología',
  icon: 'lung',
};
export const BUTTON_RX_PROBABILITY = {
  id: 'precisionSlice',
  label: 'Precisión',
  icon: 'measure-target',
};

const BUTTON_RX_FRONTAL_HEAT_MAP_3D = {
  id: 'rx_frontal_heat_map_3d',
  label: 'Mapa de calor',
  icon: 'sun',
  commandName: 'heatmapFrontalMultilabelRx',
};
const BUTTON_RX_FRONTAL_ANALYZE = {
  id: 'ct_axial_slice_analyze',
  label: 'zonas de interés',
  icon: 'search',
  commandName: 'analyzeFrontalSliceRx',
};
const BUTTON_RX = {
  id: 'Hallazgos-RX',
  label: 'Hallazgos-RX',
  icon: 'brain',
  buttons: [
    BUTTON_RX_PREDICT,
    BUTTON_RX_PATHOLOGY,
    BUTTON_RX_PROBABILITY,
    BUTTON_RX_FRONTAL_ANALYZE,
    BUTTON_RX_FRONTAL_HEAT_MAP_3D,
  ],
};

const BUTTON_RX_COVID_PREDICT = {
  id: 'deepsars-rx-covid-predict',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'predictFrontalCovidRx',
};

const BUTTON_RX_COVID_HEATMAP = {
  id: 'deepsars-rx-covid-heatmap',
  label: 'mapa de calor',
  icon: 'sun',
  type: 'command',
  commandName: 'heatmapFrontalCovidRx',
};

export const BUTTON_RX_COVID_PATHOLOGY = {
  id: 'deepsars-rx-covid-pathology',
  label: 'Patología',
  icon: 'lung',
};

export const BUTTON_RX_COVID_PROBABILITY = {
  id: 'deepsars-rx-covid-probability',
  label: 'Precisión',
  icon: 'measure-target',
};

const BUTTON_RX_COVID = {
  id: 'deepsars-rx-covid',
  label: 'RX-Covid',
  icon: 'brain',
  buttons: [
    BUTTON_RX_COVID_PREDICT,
    BUTTON_RX_COVID_PATHOLOGY,
    BUTTON_RX_COVID_PROBABILITY,
    BUTTON_RX_COVID_HEATMAP,
  ],
};

const BUTTON_MEASUREMENT_SAVE = {
  id: 'saveMeasurement',
  label: 'Guardar',
  icon: 'database',
  type: 'command',
  commandName: 'saveMeasurement',
};
const BUTTON_MEASUREMENT_LOAD = {
  id: 'loadMeasurement',
  label: 'Recuperar',
  icon: 'inline-edit',
  type: 'command',
  commandName: 'loadMeasurement',
};
const BUTTON_MEASUREMENT = {
  id: 'measurement',
  label: 'Anotaciones',
  icon: 'list',
  buttons: [BUTTON_MEASUREMENT_SAVE, BUTTON_MEASUREMENT_LOAD],
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
  commandName: 'showCurrentSegmentation',
};

const TOOLBAR_BUTTON_TYPES = {
  COMMAND: 'command',
  SET_TOOL_ACTIVE: 'setToolActive',
  BUILT_IN: 'builtIn',
};

const BUTTON_CREAR_SEGMENTATION = {
  id: 'Crear',
  label: 'Crear',
  icon: 'palette',
  commandName: 'createSegmentation',
};

const BUTTON_SAVE_SEGMENTATION = {
  id: 'Guardar',
  label: 'Guardar',
  icon: 'database',
  commandName: 'saveSegmentation',
};

const BUTTON_RECOVER_SEGMENTATION = {
  id: 'Recuperar',
  label: 'Recuperar',
  icon: 'info',
  commandName: 'recoverSegmentation',
};
const BUTTON_SEGMENTATION = {
  id: 'deepsars_seg',
  label: 'Segmentación',
  icon: 'palette',
  type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
  buttons: [
    BUTTON_CREAR_SEGMENTATION,
    BUTTON_SAVE_SEGMENTATION,
    //BUTTON_RECOVER_SEGMENTATION,
    BUTTON_SHOW_SEGMENTATION,
  ],
};

export default {
  definitions: [
    BUTTON_SEGMENTATION,
    BUTTON_MEASUREMENT,
    BUTTON_RELOAD,
    BUTTON_CT_VOLUME,
    BUTTON_CT_SLICE,
    BUTTON_RX,
    BUTTON_RX_COVID,
  ],
  defaultContext: 'VIEWER',
};
