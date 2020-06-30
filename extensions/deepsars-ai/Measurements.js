import OHIF from '@ohif/core';
import cornerstone from 'cornerstone-core';
import { tempMeasurements } from './mocks/MeasurementsMock';
import studyMetadataManager from '../../platform/core/src/utils/studyMetadataManager.js';

export const saveMeasurements = () => {
  const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;
  console.log('The following tool anotations are going to be saved');
  console.log(localMeasurementAPI.tools);
};

export const retrieveAllMeasurements = () => {
  var tempMeasurements = [];
  const localMeasurementAPI = OHIF.measurements.MeasurementApi.Instance;

  /*Mocking Squares ---------*/
  const [studyObj] = studyMetadataManager.all()
  if (studyObj != undefined) {
    studyObj._displaySets.forEach((obj, idx) => {
      if (obj.Modality == "CT" || obj.Modality == "CR") {
        const [tempInstance] = obj.images
        tempMeasurements.push({
          "visible": true,
          "active": true,
          "invalidated": false,
          "handles": {
            "start": { "x": 162.68286755771564, "y": 159.88335358444715, "highlight": true, "active": false },
            "end": { "x": 265.3317132442284, "y": 263.1543134872418, "highlight": true, "active": false, "hasMoved": true },
            "initialRotation": 0,
            "textBox": { "active": false, "hasMoved": false, "movesIndependently": false, "drawnIndependently": true, "allowedOutsideImage": true, "hasBoundingBox": true, "x": 265.3317132442284, "y": 211.51883353584446, "boundingBox": { "width": 284.953125, "height": 45, "left": 482.49999999999994, "top": 317.5 } }
          },
          "uuid": "5f5bb77d-eb89-43b8-9e55-bc0839008186",
          "StudyInstanceUID": studyObj.studyInstanceUID,
          "SeriesInstanceUID": obj.SeriesInstanceUID,
          "SOPInstanceUID": tempInstance.SOPInstanceUID,
          "frameIndex": 0,
          "imagePath": studyObj.studyInstanceUID + "_" + obj.SeriesInstanceUID + "_" + tempInstance.SOPInstanceUID + "_0",
          "lesionNamingNumber": (idx + 1), //Change
          "measurementNumber": (idx + 1),  //Change
          "userId": null,
          "toolType": "RectangleRoi",
          "timepointId": "TimepointId",
          "cachedStats": { "area": 6465.979919297357, "count": 10712, "mean": -68.47638162808066, "variance": 37347.40926293427, "stdDev": 193.25477811152373, "min": -1217, "max": 379 },
          "viewport": { "scale": 1.607421875, "translation": { "x": 0, "y": 0 }, "voi": { "windowWidth": 1600, "windowCenter": -550 }, "invert": false, "pixelReplication": false, "rotation": 0, "hflip": false, "vflip": false, "labelmap": false, "displayedArea": { "tlhc": { "x": 1, "y": 1 }, "brhc": { "x": 512, "y": 512 }, "rowPixelSpacing": 0.781, "columnPixelSpacing": 0.781, "presentationSizeMode": "NONE" } },
          "unit": "HU", //inits
          "location": "Abdomen/Chest Wall", //Cattegory
          "description": "Sqr#" + (idx + 1) //measurement desc
        });
      }
    });
  }

  // Apply Measurements ------------------ //
  tempMeasurements.forEach(tempMeasurements =>
    localMeasurementAPI.addMeasurement(
      tempMeasurements.toolType,
      tempMeasurements
    )
  );
  // Sync Measurements -------------------//
  localMeasurementAPI.syncMeasurementsAndToolData();
  cornerstone.getEnabledElements().forEach(enabledElement => {
    cornerstone.updateImage(enabledElement.element);
  });
  // Let others know that the measurements are updated
  localMeasurementAPI.onMeasurementsUpdated();
};
