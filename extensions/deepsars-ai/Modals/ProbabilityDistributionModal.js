import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import './ProbabilityDistributionModalStyles.styl'

const probabilityDistributionModal = ({ chartData, chartLayout, predictedClass, probability, trainingSamples, validationAcc }) => {
  console.log('ChartData:', chartData);
  console.log('ChartLayout:', chartLayout);
  var yValue = chartData[0].y;
  var xValue = chartData[0].x;
  //console.log(yValue, xValue.indexOf(predictedClass), xValue.length);
  chartData[0].text = yValue.map(String);
  chartData[0].textposition = 'auto';
  chartData[0].textfont = {
    "size": 22
  };

  chartLayout.yaxis.range = [0, 100];
  chartData[0].hoverinfo = 'none';
  var colors = new Array(xValue.length);
  for (var i = 0; i < xValue.length; i++) {
    if (i == xValue.indexOf(predictedClass)) {
      colors[i] = 'rgba(225,66,60,0.71)';
    }
    else {
      colors[i] = 'rgba(124,179,66,0.8)';
    }
  }
  console.log(colors);
  chartData[0].marker.color = colors;
  return (
    <div>
      <div className='title1'>
        {
          '-La clase predicha por el modelo fue '.concat("'", predictedClass, "'", ' con una confianza de ', probability, "%.")
        }
      </div>
      <Plot data={chartData} layout={chartLayout} style={{ width: '100%' }} config={{ displayModeBar: false }} />
      <div className='footer1'>
        {
          '-Modelo entrenado con  '.concat(trainingSamples, " muestras y exactitud del ", validationAcc, "%.")
        }
      </div>
    </div>

  );
};

probabilityDistributionModal.propTypes = {
  chartData: PropTypes.array,
  chartLayout: PropTypes.object,
};
export default probabilityDistributionModal;
