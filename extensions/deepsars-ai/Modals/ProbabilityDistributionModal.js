import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import './ProbabilityDistributionModalStyles.styl'

const probabilityDistributionModal = ({ chartData, chartLayout, predictedClass, probability, trainingSamples, validationAcc }) => {
  return (
    <div>
      <div className='title'>
        {
          '-Modelo entrenado con  '.concat(trainingSamples, " muestras.")
        }
        <div>
          {
            '-Modelo evaluado con una precisión del '.concat(validationAcc, "%.")
          }
        </div>
        <div>
          {
            '-La clase predicha por el modelo fue '.concat("'", predictedClass, "'", ' con una confianza de ', probability, "%.")
          }
        </div>
      </div>
      {/* <div className='title'>
        {
          'La clase predicha por el modelo fue '.concat("'", predictedClass, "'", ' con una confianza de ', probability, "%")
        }
      </div> */}
      <Plot data={chartData} layout={chartLayout} style={{ width: '100%' }} />
    </div>
  );
};

probabilityDistributionModal.propTypes = {
  chartData: PropTypes.array,
  chartLayout: PropTypes.object,
};
export default probabilityDistributionModal;
