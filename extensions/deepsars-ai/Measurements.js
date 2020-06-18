import OHIF from '@ohif/core';
import { tempMeasurements } from './mocks/MeasurementsMock';

export const retrieveAllMeasurements = () => {
  const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
  console.log(localMeasurementAPI);
  console.log(localMeasurementAPI.tools);
  tempMeasurements.forEach(tempMeasurements =>
    localMeasurementAPI.addMeasurement(
      tempMeasurements.toolType,
      tempMeasurements
    )
  );

  localMeasurementAPI.syncMeasurementsAndToolData();

  cornerstone.getEnabledElements().forEach(enabledElement => {
    cornerstone.updateImage(enabledElement.element);
  });

  // Let others know that the measurements are updated
  localMeasurementAPI.onMeasurementsUpdated();
};
