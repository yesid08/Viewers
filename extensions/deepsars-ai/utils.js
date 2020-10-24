/* eslint-disable no-console */
import cornerstone from 'cornerstone-core';
import OHIF from '@ohif/core';
import cornerstoneTools from 'cornerstone-tools';
import probabilityDistributionModal from './Modals/ProbabilityDistributionModal';

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

export const isSeriesCT = () => {
  var dicomData = getDicomUIDs();
  var dicomMetadata = OHIF.utils.studyMetadataManager.get(
    dicomData.StudyInstanceUID
  );
  var studySeries = dicomMetadata._data.series;
  var currentSeriesMetadata = studySeries.find(
    currentSerie =>
      currentSerie.SeriesInstanceUID == dicomData.SeriesInstanceUID
  );
  if (currentSeriesMetadata.Modality.toLowerCase() == 'ct') {
    return true;
  } else {
    return false;
  }
};

export const getAllInstancesUIDs = () => {
  const allSlicesUIDS = [];
  const UIDsMap = OHIF.cornerstone.metadataProvider.imageIdToUIDs;
  for (const [value] of UIDsMap.entries()) {
    allSlicesUIDS.push(value);
  }
  return allSlicesUIDS;
};

export const makeTransaction = (route, operation, data) => {
  const urlParams = new URLSearchParams(window.location.search);
  const enterpriseParam = urlParams.get('entidad');
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
  const promisePetition = new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.timeout = 1000 * 120;
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          resolve(JSON.parse(xhttp.response));
        } else {
          const res = { error: 'Sin conexión', status: xhttp.status };
          console.log(res);
          reject(res);
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

export const getSeriesId = data => {
  const requestPayload = data;
  const promisePetition = new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.timeout = 1000 * 120;
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          resolve(JSON.parse(xhttp.response));
        } else {
          const res = { error: 'Sin conexión', status: xhttp.status };
          console.log(res);
          reject(res);
        }
      }
    };
    xhttp.open(
      'POST',
      'https://deepsarspruebas.uis.edu.co/orthanc/tools/find',
      true
    );
    xhttp.setRequestHeader(
      'Authorization',
      window.localStorage.getItem('token')
    );
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(requestPayload));
  });

  return promisePetition;
};

export const segmentate_roi = async (
  toolName,
  activeSegmentIndex,
  eraseWithRightClick
) => {
  var segmentationModule = cornerstoneTools.getModule('segmentation');
  var element = cornerstone.getEnabledElements()[0].element;
  segmentationModule.getters.labelmap2D(element);

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
    if (toolName == 'FreehandScissors') {
      const FreehandScissorsTool = cornerstoneTools.FreehandScissorsTool;

      cornerstoneTools.addTool(FreehandScissorsTool);
      cornerstoneTools.setToolActive('FreehandScissors', {
        mouseButtonMask: 1,
      });
    } else {
      cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
    }

    if (eraseWithRightClick && toolName != 'BrushEraser') {
      cornerstoneTools.setToolActive('BrushEraser', { mouseButtonMask: 2 });
    } else {
      cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
    }
    console.log('IDS:', getDicomUIDs());
  });
};

export const guid = () => {
  const getFourRandomValues = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return (
    getFourRandomValues() +
    getFourRandomValues() +
    '-' +
    getFourRandomValues() +
    '-' +
    getFourRandomValues() +
    '-' +
    getFourRandomValues() +
    '-' +
    getFourRandomValues() +
    getFourRandomValues() +
    getFourRandomValues()
  );
};

export const generate_distribution = (title_layout, title_xaxis, pathologiesData, services) => {
  const title = 'Resultados del modelo:';
  const data = [
    {
      type: 'bar',
      marker: {
        color: '#7cb342',
      },
      orientation: 'v',
      x: Object.keys(pathologiesData),
      y: Object.values(pathologiesData),
    },
  ];
  const layout = {
    title: title_layout,
    plot_bgcolor: '#151A1F',
    paper_bgcolor: '#151A1F',
    font: {
      family: 'Roboto',
      color: '#ffffff',
    },
    xaxis: {
      title: title_xaxis,
      tickangle: -45,
    },
    yaxis: {
      title: 'Probabilidad [%]',
      gridcolor: '#ffffff',
      domain: [0, 100],
    },
    showlegend: false,
  };

  services.modal.show({
    content: probabilityDistributionModal,
    title,
    contentProps: {
      chartData: data,
      chartLayout: layout,
    },
  });

}
