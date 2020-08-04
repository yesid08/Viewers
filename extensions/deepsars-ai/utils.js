import cornerstone from 'cornerstone-core';
import OHIF from '@ohif/core';
import cornerstoneTools from 'cornerstone-tools';

export const makeContract = (dicomData, file_type, file_mod, file_view) => {
  var contract = {
    microservice: 'orthanc',
    task: 'predict_pathology',
    file_ID: dicomData,
    file_type: file_type,
    file_mod: file_mod,
    file_view: file_view,
  };

  return contract;
};

export const getDicomUIDs = () => {
  const defaultEnabledElement = cornerstone.getEnabledElements()[0];
  const image = defaultEnabledElement.image;
  const imageIdArray = image.imageId.split('/');
  return {
    StudyInstanceUID: imageIdArray.slice(-7)[0],
    SeriesInstanceUID: imageIdArray.slice(-5)[0],
    SOPInstanceUID: imageIdArray.slice(-3)[0],
  };
};

export const getAllInstancesUIDs = () => {
  const allSlicesUIDS = [];
  const UIDsMap = OHIF.cornerstone.metadataProvider.imageIdToUIDs;
  for (const [key, value] of UIDsMap.entries()) {
    allSlicesUIDS.push(value);
  }
  return allSlicesUIDS;
};

export const makeTransaction = (route, operation, data) => {
  const urlParams = new URLSearchParams(window.location.search);
  const enterpriseParam = urlParams.get('_e');
  const requestPayload = {
    count: 0,
    data: data,
    date: String(new Date().getTime()),
    enterprise: enterpriseParam == undefined ? 2 : enterpriseParam,
    ips: [window.localStorage.getItem('saraid')],
    operation: operation,
    route: route,
    _v: 3,
  };
  console.log(requestPayload);

  const promisePetition = new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.timeout = 1000 * 120;
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          resolve(JSON.parse(xhttp.response));
        } else {
          reject('Sin conexión');
        }
      }
    };
    xhttp.open('POST', `/trs/${route}/`, true);
    xhttp.setRequestHeader(
      'Authorization',
      window.localStorage.getItem('token')
    );
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(requestPayload));
  });

  return promisePetition;
};

export const segmentate_roi = (
  toolName,
  activeSegmentIndex,
  eraseWithRightClick
) => {
  console.log('ToolName and ActiveSegment Index', toolName, activeSegmentIndex);
  var elements = cornerstone.getEnabledElements();
  elements.forEach(anElement => {
    var element = anElement.element;
    var segmentationModule = cornerstoneTools.getModule('segmentation');
    console.log('The new segmentIndex will be ', activeSegmentIndex);
    segmentationModule.setters.activeLabelmapIndex(element, 0);
    segmentationModule.setters.activeSegmentIndex(element, activeSegmentIndex);
    segmentationModule.setters.activeSegmentIndex(element, activeSegmentIndex);
    console.log('Segmentation Module', segmentationModule);
    cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
    if (eraseWithRightClick && toolName != 'BrushEraser') {
      cornerstoneTools.setToolActive('BrushEraser', { mouseButtonMask: 2 });
    } else {
      cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
    }
  });
};
