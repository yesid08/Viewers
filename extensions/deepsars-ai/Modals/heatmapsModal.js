/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@ohif/ui';
import * as utils from '../utils';
import * as heatmaps from '../operationsAI/heatmaps';

const heatmapsModal = ({ modality, view, services }) => {

  //const heatAlgArray = ohifConf.views[modality];
  console.log('HOLA SOY EL MODAL');
  const heatmapSelectOptions = [];
  const heatAlgArray = ['cam', 'xrai', 'gradcam'];
  const [heatAlg, setHeatAlg] = useState(heatAlgArray[0]);
  heatAlgArray.forEach(item => {
    heatmapSelectOptions.push({ key: item, value: item });
  });
  const onSave = () => {
    var dicomData = utils.getDicomUIDs();
    var payloadData = {
      microservice: 'models',
      file_mod: modality,
      file_view: view,
      task: 'diagnose',
      file_type: 'slice',
      task_class: 'classify',
      task_mode: 'covid',
      file_ID: dicomData.SOPInstanceUID,
      heatmap_algorithm: heatAlg
    };
    console.log(`Opción Seleccionada :`, heatAlg);
    console.log('Payload :', payloadData);
    heatmaps.calculateHeatmap(services, payloadData);
    services.modal.hide();
  };

  return (
    <div>
      <div>
        <Select
          onChange={event => setHeatAlg(event.target.value)}
          options={heatmapSelectOptions}
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
