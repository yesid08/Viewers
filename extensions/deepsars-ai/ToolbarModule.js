const BUTTON_CT_VOLUME_PREDICT = {
  id: 'PredecirVolumen',
  label: 'Predecir volumen',
  icon: 'play',
  type: 'command',
  commandName: 'predictAxialCovidVolumeCt',
};
const BUTTON_CT_AXIAL_HEAT_MAP_3D = {
  id: 'ct_axial_heat_map_3d',
  label: 'CT-3D',
  icon: 'sun',
  commandName: 'heatmapAxialCovidVolumeCt',
};
const BUTTON_CT_VOLUME = {
  id: 'Volumen-CT',
  label: 'Volumen-CT',
  icon: 'brain',
  buttons: [BUTTON_CT_VOLUME_PREDICT, BUTTON_CT_AXIAL_HEAT_MAP_3D],
};
const BUTTON_CT_SLICE_PREDICT = {
  id: 'PredecirSlice',
  label: 'Predecir slice',
  icon: 'play',
  type: 'command',
  commandName: 'predictAxialCovidSliceCt',
};
const BUTTON_CT_AXIAL_HEAT_MAP_2D = {
  id: 'ct_axial_heat_map_2d',
  label: 'CT-2D',
  icon: 'sun',
  commandName: 'heatmapAxialCovidSliceCt',
};
const BUTTON_CT_AXIAL_ANALYZE = {
  id: 'ct_axial_slice_analyze',
  label: 'Zonas de interés slice',
  icon: 'search',
  commandName: 'analyzeAxialSliceCt',
};
const BUTTON_CT_SLICE = {
  id: 'Slice-CT',
  label: 'Slice-CT',
  icon: 'brain',
  buttons: [
    BUTTON_CT_SLICE_PREDICT,
    BUTTON_CT_AXIAL_ANALYZE,
    BUTTON_CT_AXIAL_HEAT_MAP_2D,
  ],
};
const BUTTON_RX_PREDICT = {
  id: 'PredecirSlice',
  label: 'Predecir hallazgos',
  icon: 'play',
  type: 'command',
  commandName: 'predictFrontalMultilabelRx',
};

const BUTTON_RX_FRONTAL_HEAT_MAP_3D = {
  id: 'rx_frontal_heat_map_3d',
  label: 'RX-Hallazgos',
  icon: 'sun',
  commandName: 'heatmapFrontalMultilabelRx',
};
const BUTTON_RX_FRONTAL_ANALYZE = {
  id: 'ct_axial_slice_analyze',
  label: 'Zonas de interés',
  icon: 'search',
  commandName: 'analyzeFrontalSliceRx',
};
const BUTTON_RX = {
  id: 'Hallazgos-RX',
  label: 'Hallazgos-RX',
  icon: 'brain',
  buttons: [
    BUTTON_RX_PREDICT,
    BUTTON_RX_FRONTAL_ANALYZE,
    BUTTON_RX_FRONTAL_HEAT_MAP_3D,
  ],
};

const BUTTON_RX_COVID_PREDICT = {
  id: 'deepsars-rx-covid-predict',
  label: 'Predecir covid',
  icon: 'play',
  type: 'command',
  commandName: 'predictFrontalCovidRx',
};

const BUTTON_RX_COVID_HEATMAP = {
  id: 'deepsars-rx-covid-heatmap',
  label: 'RX-Covid',
  icon: 'sun',
  type: 'command',
  commandName: 'heatmapFrontalCovidRx',
};

const BUTTON_RX_COVID = {
  id: 'deepsars-rx-covid',
  label: 'RX-Covid',
  icon: 'brain',
  buttons: [BUTTON_RX_COVID_PREDICT, BUTTON_RX_COVID_HEATMAP],
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

const BUTTON_SEGMENTATION = {
  id: 'deepsars_seg',
  label: 'Segmentación',
  icon: 'soft-tissue',
  type: TOOLBAR_BUTTON_TYPES.SET_TOOL_ACTIVE,
  buttons: [
    BUTTON_CREAR_SEGMENTATION,
    BUTTON_SAVE_SEGMENTATION,
    //BUTTON_RECOVER_SEGMENTATION,
    BUTTON_SHOW_SEGMENTATION,
  ],
};

const BUTTON_COVID_LEVELS = {
  id: 'covid_levels',
  label: 'Niveles de covid',
  icon: 'play',
  type: 'command',
  commandName: 'covid_levels',
};

export const BUTTON_CT_STUDIES = {
  id: 'deepsars-ct-studies',
  label: 'Predicciones-CT',
  icon: 'brain',
  buttons: [
    BUTTON_CT_VOLUME_PREDICT,
    BUTTON_CT_SLICE_PREDICT,
    BUTTON_CT_AXIAL_ANALYZE,
    BUTTON_COVID_LEVELS,
  ],
};

export const BUTTON_RX_STUDIES = {
  id: 'deepsars-rx-studies',
  label: 'Predicciones-RX',
  icon: 'brain',
  buttons: [
    BUTTON_RX_COVID_PREDICT,
    BUTTON_RX_PREDICT,
    BUTTON_RX_FRONTAL_ANALYZE,
  ],
};

export const BUTTON_HEATMAP = {
  label: 'Mapas xia',
  icon: 'brain',
  buttons: [
    BUTTON_CT_AXIAL_HEAT_MAP_2D,
    BUTTON_CT_AXIAL_HEAT_MAP_3D,
    BUTTON_RX_FRONTAL_HEAT_MAP_3D,
    BUTTON_RX_COVID_HEATMAP,
  ],
};

export const BUTTON_PATHOLOGY = {
  id: 'deepsars-pathology',
  label: 'Patología',
  icon: 'lung',
};

export const BUTTON_PROBABILITY = {
  id: 'deepsars-probability',
  label: 'Probabilidad',
  icon: 'measure-target',
};

const BUTTON_SARS_2D = {
  id: 'Sars_2d',
  label: 'Sars slice',
  icon: 'play',
  type: 'command',
  commandName: 'sars2d',
};

const BUTTON_SARS = {
  label: 'Sars',
  icon: 'brain',
  buttons: [BUTTON_SARS_2D],
};

export default {
  definitions: [
    BUTTON_SEGMENTATION,
    BUTTON_MEASUREMENT,
    BUTTON_RELOAD,
    BUTTON_CT_STUDIES,
    BUTTON_RX_STUDIES,
    BUTTON_HEATMAP,
    BUTTON_SARS,
    //BUTTON_CT_VOLUME,
    //BUTTON_CT_SLICE,
    //BUTTON_RX,
    //BUTTON_RX_COVID,
    BUTTON_PATHOLOGY,
    BUTTON_PROBABILITY,
  ],
  defaultContext: 'VIEWER',
};
