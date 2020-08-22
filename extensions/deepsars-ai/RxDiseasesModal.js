import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

const RxDiseasesModal = ({ chartData, chartLayout }) => {
  return (
    <div>
      <Plot data={chartData} layout={chartLayout} />
    </div>
  );
};

RxDiseasesModal.propTypes = {
  chartData: PropTypes.array,
  chartLayout: PropTypes.object,
};
export default RxDiseasesModal;
