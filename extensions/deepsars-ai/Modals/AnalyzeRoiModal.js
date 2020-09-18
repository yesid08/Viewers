/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Range } from '@ohif/ui';
import * as utils from '../utils';
import * as analyzeRoi from '../operationsAI/analyzeRoi';

const AnalizeRoiModal = ({ modality, ohifConf, services }) => {
  const viewsArray = ohifConf.views[modality];
  const [threashold, setThreashold] = useState(0.5);
  const [view, setView] = useState(viewsArray[0]);
  const viewsSelectOptions = [];
  viewsArray.forEach(viewItem => {
    viewsSelectOptions.push({ key: viewItem, value: viewItem });
  });
  const onSave = () => {
    var dicomData = utils.getDicomUIDs();
    var payloadData = {
      microservice: 'models',
      file_mod: modality,
      file_view: view,
      task: 'analyze_zones',
      threashold: threashold,
      file_type: 'slice',
      task_class: 'detect',
      task_mode: 'covid',
      file_ID: dicomData.SOPInstanceUID,
    };
    analyzeRoi.analyzeSlice(services, payloadData);
    services.modal.hide();
  };

  return (
    <div>
      <div className="title">
        {'Seleccione el tipo de vista y la confianza de la predicción'}
      </div>

      <div>
        <Select
          onChange={event => setView(event.target.value)}
          options={viewsSelectOptions}
          label={'Vista'}
        />
      </div>
      <div className="range-example">
        <label>Confianza de predicción:</label>
        <br></br>
        <Range
          onChange={event =>
            setThreashold(parseFloat(event.target.value) / 100)
          }
          min={0}
          max={100}
          step={1}
          value={50}
          showPercentage={true}
          label={'Confianza de predicción'}
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

AnalizeRoiModal.propTypes = {
  onClose: PropTypes.func,
  ohifConf: PropTypes.object,
  modality: PropTypes.string,
  services: PropTypes.object,
};

export default AnalizeRoiModal;
