import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

const RxDiseasesModal = ({ chartData }) => {
  return (
    <div>
      <Plot data={chartData} layout={{ title: 'OHIF PLOT' }} />
    </div>
  );
};

RxDiseasesModal.propTypes = {
  chartData: PropTypes.array,
};
export default RxDiseasesModal;
