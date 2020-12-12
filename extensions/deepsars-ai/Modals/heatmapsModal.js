/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@ohif/ui';
import * as utils from '../utils';
import * as heatmaps from '../operationsAI/heatmaps';

const heatmapsModal = ({ modality, view, services }) => {

  //const heatAlgArray = ohifConf.views[modality];
  //console.log('HOLA SOY EL MODAL');
  const heatmapAlgSelectOptions = [];
  const heatmapTypeSelectOptions = [];
  const heatAlgArray = ['cam', 'xrai', 'gradcam'];
  const heatTypesArray = (modality == 'ct') ? ["CT-2D", "CT-3D"] : ["RX-Hallazgos", "RX-Covid"];
  const [heatAlg, setHeatAlg] = useState(heatAlgArray[0]);
  const [heatTyp, setHeatTyp] = useState(heatTypesArray[0]);
  heatAlgArray.forEach(item => {
    heatmapAlgSelectOptions.push({ key: item, value: item });
  });
  heatTypesArray.forEach(item => {
    heatmapTypeSelectOptions.push({ key: item, value: item });
  });
  const onSave = () => {
    var dicomData = utils.getDicomUIDs();
    var payloadData = {
      microservice: 'models',
      file_mod: modality,
      file_view: view,
      task: (heatTyp == 'CT-2D') ? 'prepare' : 'diagnose',
      file_type: (heatTyp == 'CT-3D') ? 'volumen' : 'slice',
      task_class: 'classify',
      task_mode: (heatTyp == 'RX-Hallazgos') ? 'diseases' : 'covid',
      file_ID: (heatTyp == "CT-2D" || heatTyp == "CT-3D") ? dicomData.SeriesInstanceUID : dicomData.SOPInstanceUID,
      heatmap_algorithm: heatAlg
    };
    console.log(`UID : ${(heatTyp == "CT-2D" || heatTyp == "CT-3D") ? 'Serie' : 'Instancia'}`)
    console.log(`Opciones Seleccionadas :${heatTyp} , ${heatAlg}`);
    console.log('Payload :', payloadData);
    heatmaps.calculateHeatmap(services, payloadData);
    services.modal.hide();
  };

  return (
    <div>
      <div>
        <Select
          onChange={event => setHeatTyp(event.target.value)}
          options={heatmapTypeSelectOptions}
          label={'Tipo :'}
        />
        <Select
          onChange={event => setHeatAlg(event.target.value)}
          options={heatmapAlgSelectOptions}
          label={'Algoritmo :'}
        />
      </div>
      <div className="actions">
        <div className="action-cancel">
          <button
            type="button"
            className="btn btn-danger"
            onClick={services.modal.hide}
          >
            {'Cancelar'}
          </button>
        </div>
        <div className="action-save">
          <button className="btn btn-primary" onClick={onSave}>
            {'Predecir'}
          </button>
        </div>
      </div>
    </div>

  );


};

heatmapsModal.PropTypes = {
  modality: PropTypes.string,
  view: PropTypes.string,
  services: PropTypes.object
};

export default heatmapsModal;
