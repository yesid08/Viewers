/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@ohif/ui';
import * as utils from './utils';
import './DeepSarsSegmentationFormStyles.styl';

const DeepsarsSegmentationForm = ({ onClose }) => {
  const SEGMENTATION_OPTIONS = [
    {
      value: '',
      key: '',
    },
    {
      value: '1',
      key: 'Segmentación_1',
    },
    {
      value: '2',
      key: 'Segmentación_2',
    },
    {
      value: '3',
      key: 'Segmentación_3',
    },
    {
      value: '4',
      key: 'Segmentación_4',
    },
    {
      value: '5',
      key: 'Segmentación_5',
    },
  ];

  const TOOL_OPTIONS = [
    {
      value: '',
      key: '',
    },
    {
      value: 'CorrectionScissors',
      key: 'Tijeras',
    },
    {
      value: 'Brush',
      key: 'Pincel',
    },
    {
      value: 'BrushEraser',
      key: 'Borrador',
    },
  ];

  const [Segmentation, setSegmentation] = useState('');
  const [Tool, setTool] = useState('');

  const onSave = () => {
    console.log(Tool, parseInt(Segmentation));
    utils.segmentate_roi(Tool, parseInt(Segmentation));
    onClose();
  };

  return (
    <div>
      <div className="title">
        {'Seleccione el tipo de segmentación y la herramienta a usar'}
      </div>

      <div>
        <Select
          onChange={event => setSegmentation(event.target.value)}
          options={SEGMENTATION_OPTIONS}
          label={'Segmentación'}
        />
      </div>

      <div>
        <Select
          onChange={event => setTool(event.target.value)}
          options={TOOL_OPTIONS}
          label={'Herramienta'}
        />
      </div>

      <div className="actions">
        <div className="action-cancel">
          <button type="button" className="btn btn-danger" onClick={onClose}>
            {'Cancelar'}
          </button>
        </div>
        <div className="action-save">
          <button className="btn btn-primary" onClick={onSave}>
            {'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

DeepsarsSegmentationForm.propTypes = {
  onClose: PropTypes.func,
};

export default DeepsarsSegmentationForm;
