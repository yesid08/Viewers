/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from '@ohif/ui';
import * as utils from './utils';
import './DeepSarsSegmentationFormStyles.styl';

const DeepsarsSegmentationForm = ({
  onClose,
  SEGMENTATION_OPTIONS,
  UINotificationService,
}) => {
  const [Segmentation, setSegmentation] = useState('169');
  const [Tool, setTool] = useState('FreehandScissors');
  const [eraserChecked, setEraserCheck] = useState(false);

  const TOOL_OPTIONS = [
    {
      value: 'FreehandScissors',
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

  const onSave = () => {
    /* console.log(Tool, parseInt(Segmentation)); */
    utils.segmentate_roi(Tool, parseInt(Segmentation), eraserChecked);
    onClose();
  };

  return (
    <div>
      <div className="title">
        {
          'Seleccione el tipo de segmentación a realizar. Para borrar parte de una segmentación usar el clic derecho.'
        }
      </div>

      <div>
        <Select
          value={Segmentation}
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
        <input
          type="checkbox"
          checked={eraserChecked}
          onChange={event => setEraserCheck(!eraserChecked)}
        />
        {'Borrar Con click Derecho ?'}
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
  SEGMENTATION_OPTIONS: PropTypes.array,
  UINotificationService: PropTypes.object,
};

export default DeepsarsSegmentationForm;
