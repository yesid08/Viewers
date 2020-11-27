import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import './ProbabilityDistributionModalStyles.styl'


const probabilityDistributionModal = ({ chartData, chartLayout, predictedClass, probability, trainingSamples, validationAcc }) => {
  console.log('ChartData:', chartData[0]);
  var yValue = chartData[0].y;
  var xValue = chartData[0].x;
  //console.log(yValue, xValue.indexOf(predictedClass), xValue.length);
  chartData[0].text = yValue.map(String);
  chartData[0].textposition = 'outside';
  chartData[0].textfont = {
    "size": 22,
    "color": '#fffef7'
  };
  //---
  const [readMore, setReadMore] = useState(false);
  const extraContent = <div>
    <p className="extra-content">
      Modelo entrenado con {trainingSamples} muestras y exactitud del {validationAcc}%.
      </p>
  </div>
  const linkName = readMore ? '-Minimizar ' : '+Detalles del Modelo '
  //---
  chartLayout.yaxis.range = [0, 100];
  chartLayout.yaxis.gridcolor = '#697067';
  chartData[0].hoverinfo = 'y';
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
        {predictedClass} (Acc={probability}%).
      </div>
      <Plot data={chartData} layout={chartLayout} style={{ width: '100%' }} config={{ displayModeBar: false }} />


      <div className="App">
        <a className="read-more-link" onClick={() => { setReadMore(!readMore) }}><h2>{linkName}</h2></a>
        {readMore && extraContent}
      </div>
    </div>


  );
};

probabilityDistributionModal.propTypes = {
  chartData: PropTypes.array,
  chartLayout: PropTypes.object,
};
export default probabilityDistributionModal;
