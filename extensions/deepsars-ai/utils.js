import cornerstone from 'cornerstone-core';
import OHIF from '@ohif/core';

/*TODO List: By Yesid G.
  1) Create petitions utilities inside of utils.py
  2) Create the logic of each button in the corresponding section (heatmaps.js or predictions.js) by using functions.
  3) Inside this file(commands module) just call the functions from heatmaps.js or predictions.js in front of each commandFn.
  4) This file should have the same form of the one that is currently in index, the idea is to export the whole object to index.
  5) In the file index.js import this commandsModule.js file and return the object of this file
  6) commit the changes and have fun!
*/

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
  const requestPayload = {
    count: 0,
    data: data,
    date: String(new Date().getTime()),
    enterprise: 1,
    ips: ['2QEJ8cO8CC'],
    operation: operation,
    route: route,
    _v: 3,
  };

  const promisePetition = new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
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
      '75bN8S6k4UQvwhUJVjCfVuxAmjz3dDJfyaddN548kRc6Wf+aBUPkhYPvqT/o3B4L0GyD/2GovVWr/ZnZB8BoqLSBgiNsCLmxYNgZV2at8xIIqzDXuMgibd8lOho79usmH5oPtj1GYboJguYVML97SQB/j1oEJUmOek6/8Afa6cIsL+EK5RhHGoUTqL70KjIoydVIggmko9mqe3PBTMLsM9DSn4QBSpg7JmcYnVPOu761/YYoLpXABkfbmQ+eSljV15l5Lc37AkTUWMKNpX5bmNYzNu9R+jABLEiHF7rdcO6yyWq3/feAyigYaQUY5O/jykou6lndEUvW3dPjaAlR15gtRWzqk7d4viZD02pq9pbbmDfamyKYFdPI6+nsQQ6sx0BZWg89P/3aZeHjvMIleyYZ1XxMzFxA4hiG1zEnpyVbpqqV7r50hSkTiq2UTQmjyWNnC+/uCkuupLmdtqIclNgtNmcMsbbnGx/XFviYXfpevR34LXbBsHSIDatKW1VyKttbAa4pXD0M2IZgNwTh1UEatk1Ob8qMil9vsU2ji0XDNz6a29Lle1hKABf2DrJYWrtPX+AKccpQfrnAiQuL+Q=='
    );
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(requestPayload));
  });

  return promisePetition;
};
