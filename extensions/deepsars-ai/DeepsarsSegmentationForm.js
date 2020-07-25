import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@ohif/ui';
import './DeepSarsSegmentationFormStyles.styl';

const DeepsarsSegmentationForm = ({ onClose }) => {
  const [SegmentationName, setSegmentationName] = useState('');
  const [SegmentationIndex, setSegmentationIndex] = useState('');
  const [error, setError] = useState({
    SegmentationIndex: false,
    SegmentationName: false,
  });

  const error_messages = {
    SegmentationName: 'Este campo no debe estar vacio.',
  };

  const renderErrorHandler = errorType => {
    if (!error[errorType]) {
      return null;
    }

    return <div className="input-error">{error_messages[errorType]}</div>;
  };

  return (
    <div>
      <div className="title">
        {'Por favor indique el nombre e indice de la segmentación'}
      </div>

      <div className="name">
        <TextInput
          type="text"
          value={SegmentationName}
          onChange={event => setSegmentationName(event.target.value)}
          label={'Nombre de la segmentación'}
          id="SegmentationName"
        />
      </div>
      {renderErrorHandler('SegmentationName')}

      <div className="index">
        <TextInput
          type="number"
          value={SegmentationIndex}
          onChange={event => setSegmentationIndex(event.target.value)}
          label={'Indice de la segmentación'}
          id="SegmentationIndex"
        />
      </div>

      <div className="actions">
        <div className="action-cancel">
          <button type="button" className="btn btn-danger" onClick={onClose}>
            {'Cancelar'}
          </button>
        </div>
        <div className="action-save">
          <button className="btn btn-primary">{'Guardar'}</button>
        </div>
      </div>
    </div>
  );
};

DeepsarsSegmentationForm.propTypes = {
  onClose: PropTypes.func,
};

export default DeepsarsSegmentationForm;
