import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import './ProbabilityDistributionModalStyles.styl'

const probabilityDistributionModal = ({ chartData, chartLayout, predictedClass, probability }) => {
  return (
    <div>
      <div className='title'>
        {
          'La clase predicha por le modelo fue '.concat("'", predictedClass, "'", ' con una confianza de ', probability, "%")
        }
      </div>
      <Plot data={chartData} layout={chartLayout} style={{ width: '100%' }} />
    </div>
  );
};

probabilityDistributionModal.propTypes = {
  chartData: PropTypes.array,
  chartLayout: PropTypes.object,
};
export default probabilityDistributionModal;
