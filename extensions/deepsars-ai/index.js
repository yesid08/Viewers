import cornerstone from 'cornerstone-core';
import OHIF from '@ohif/core';

const annotation = [
  {
    visible: true,
    active: true,
    invalidated: false,
    handles: {
      start: {
        x: 128.4839319470699,
        y: 100.89981096408314,
        highlight: true,
        active: false,
      },
      end: {
        x: 249.70888468809068,
        y: 241.72400756143662,
        highlight: true,
        active: false,
      },
      initialRotation: 0,
      textBox: {
        active: false,
        hasMoved: false,
        movesIndependently: false,
        drawnIndependently: true,
        allowedOutsideImage: true,
        hasBoundingBox: true,
        x: 249.70888468809068,
        y: 171.31190926275988,
        boundingBox: {
          width: 236.9765625,
          height: 45,
          left: 371.99999999999994,
          top: 213.49999999999994,
        },
      },
    },
    uuid: '257ad091-8e36-42e4-90fd-6c76791f80e1',
    PatientID: 'ProstateX-0004',
    StudyInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7311.5101.170561193612723093192571245493',
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7311.5101.206828891270520544417996275680',
    SOPInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7311.5101.105945183098328980140457962163',
    frameIndex: 0,
    imagePath:
      '1.3.6.1.4.1.14519.5.2.1.7311.5101.170561193612723093192571245493_1.3.6.1.4.1.14519.5.2.1.7311.5101.206828891270520544417996275680_1.3.6.1.4.1.14519.5.2.1.7311.5101.105945183098328980140457962163_0',
    lesionNamingNumber: 1,
    userId: null,
    toolType: 'RectangleRoi',
    _id: '8b5f5c5d-824c-af91-61e6-00ebc251e868',
    timepointId: 'TimepointId',
    measurementNumber: 1,
    cachedStats: {
      area: 4267.851644326599,
      count: 17202,
      mean: 179.5631903267062,
      variance: 8125.742112086664,
      stdDev: 90.14289828980796,
      min: 5,
      max: 662,
    },
    viewport: {
      scale: 1.3776041666666667,
      translation: { x: 0, y: 0 },
      voi: { windowWidth: 1072.453125, windowCenter: 603.5390625 },
      invert: false,
      pixelReplication: false,
      rotation: 0,
      hflip: false,
      vflip: false,
      labelmap: false,
      displayedArea: {
        tlhc: { x: 1, y: 1 },
        brhc: { x: 384, y: 384 },
        rowPixelSpacing: 0.5,
        columnPixelSpacing: 0.5,
        presentationSizeMode: 'NONE',
      },
    },
    unit: '',
  },
];

const tempMeasurements = [
  {
    visible: true,
    active: false,
    invalidated: false,
    handles: {
      start: {
        x: 91.60631834750913,
        y: 92.07290400972055,
        highlight: true,
        active: false,
      },
      end: {
        x: 123.3341433778858,
        y: 121.62332928311058,
        highlight: true,
        active: false,
      },
      initialRotation: 0,
      textBox: {
        active: false,
        hasMoved: false,
        movesIndependently: false,
        drawnIndependently: true,
        allowedOutsideImage: true,
        hasBoundingBox: true,
        x: 123.3341433778858,
        y: 106.84811664641556,
        boundingBox: {
          width: 137.7265625,
          height: 25,
          left: 393.0103280680438,
          top: 333.3134872417983,
        },
      },
    },
    uuid: 'a9258b5b-faad-4737-a9e1-26c05023fa62',
    PatientID: '91478093',
    StudyInstanceUID:
      '1.2.392.200036.9116.2.6.1.3268.2046851292.1585095892.695144',
    SeriesInstanceUID:
      '1.2.392.200036.9116.2.6.1.3268.2046851292.1354201.666.1',
    SOPInstanceUID: '1.2.392.200036.9116.2.6.1.3268.2046851292.1354201.666.2',
    frameIndex: 0,
    imagePath:
      '1.2.392.200036.9116.2.6.1.3268.2046851292.1585095892.695144_1.2.392.200036.9116.2.6.1.3268.2046851292.1354201.666.1_1.2.392.200036.9116.2.6.1.3268.2046851292.1354201.666.1_0',
    lesionNamingNumber: 1,
    userId: null,
    toolType: 'RectangleRoi',
    _id: '4b233a12-898c-8e5e-4243-a44e041ba99c',
    timepointId: 'TimepointId',
    measurementNumber: 1,
    cachedStats: {
      area: 571.8815755566939,
      count: 960,
      mean: 166.91041666666666,
      variance: 12368.531558159724,
      stdDev: 111.21390002225317,
      min: 0,
      max: 255,
    },
    unit: 'HU',
    viewport: {
      scale: 3.21484375,
      translation: { x: 0, y: 0 },
      voi: { windowWidth: 255, windowCenter: 127 },
      invert: false,
      pixelReplication: false,
      rotation: 0,
      hflip: false,
      vflip: false,
      labelmap: false,
      displayedArea: {
        tlhc: { x: 1, y: 1 },
        brhc: { x: 256, y: 256 },
        rowPixelSpacing: 0.781,
        columnPixelSpacing: 0.781,
        presentationSizeMode: 'NONE',
      },
    },
  },
  {
    visible: true,
    active: true,
    invalidated: false,
    handles: {
      start: {
        x: 186.76729559748426,
        y: 142.32955974842767,
        highlight: true,
        active: false,
      },
      end: {
        x: 270.49056603773585,
        y: 208.0201257861635,
        highlight: true,
        active: false,
      },
      initialRotation: 0,
      textBox: {
        active: false,
        hasMoved: false,
        movesIndependently: false,
        drawnIndependently: true,
        allowedOutsideImage: true,
        hasBoundingBox: true,
        x: 270.49056603773585,
        y: 175.1748427672956,
        boundingBox: { width: 284.953125, height: 45, left: 430, top: 263.5 },
      },
    },
    uuid: '84410254-3a69-45d7-9417-1a425bea665f',
    PatientID: '91478093',
    StudyInstanceUID:
      '1.2.392.200036.9116.2.6.1.3268.2046851292.1585095892.695144',
    SeriesInstanceUID:
      '1.2.392.200036.9116.2.6.1.3268.2046851292.1585096063.853389',
    SOPInstanceUID:
      '1.2.392.200036.9116.2.6.1.3268.2046851292.1585096063.854256',
    frameIndex: 0,
    imagePath:
      '1.2.392.200036.9116.2.6.1.3268.2046851292.1585095892.695144_1.2.392.200036.9116.2.6.1.3268.2046851292.1585096063.853389_1.2.392.200036.9116.2.6.1.3268.2046851292.1585096063.854256_0',
    lesionNamingNumber: 1,
    userId: null,
    toolType: 'RectangleRoi',
    _id: '6e24daab-65fd-f39a-8c9b-283b68bf795b',
    timepointId: 'TimepointId',
    measurementNumber: 2,
    cachedStats: {
      area: 3354.6812123758396,
      count: 5544,
      mean: -31.76839826839827,
      variance: 25978.118077809635,
      stdDev: 161.17728772320757,
      min: -977,
      max: 688,
    },
    unit: 'HU',
    viewport: {
      scale: 1.552734375,
      translation: { x: 0, y: 0 },
      voi: { windowWidth: 1600, windowCenter: -550 },
      invert: false,
      pixelReplication: false,
      rotation: 0,
      hflip: false,
      vflip: false,
      labelmap: false,
      displayedArea: {
        tlhc: { x: 1, y: 1 },
        brhc: { x: 512, y: 512 },
        rowPixelSpacing: 0.781,
        columnPixelSpacing: 0.781,
        presentationSizeMode: 'NONE',
      },
    },
  },
];

const retrieveAllMeasurements = () => {
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

var pLayButtonCtVolumes = {
  id: 'PredecirVolumen',
  label: 'Predecir',
  icon: 'play',
  type: 'command',
  commandName: 'comando01',
};
var pathologyButtonCtVolumes = {
  id: 'pathologyVolumen',
  label: 'Patología',
  icon: 'lung',
};
var precisionButtonCtVolumes = {
  id: 'precisionVolumen',
  label: 'Precisión',
  icon: 'measure-target',
};

export const DeepSARSAIExtension = {
  id: 'volumenExtension',
  getToolbarModule() {
    return {
      definitions: [
        {
          id: 'Volumen-CT',
          label: 'Volumen-CT',
          icon: 'brain',
          buttons: [
            pLayButtonCtVolumes,
            pathologyButtonCtVolumes,
            precisionButtonCtVolumes,
          ],
        },
      ],
      defaultContext: 'VIEWER',
    };
  },
  getCommandsModule({ servicesManager, commandsManager }) {
    const { UINotificationService } = servicesManager.services;
    return {
      definitions: {
        comando01: {
          commandFn: function() {
            const defaultEnabledElement = cornerstone.getEnabledElements()[0];
            const image = defaultEnabledElement.image;
            const imageIdArray = image.imageId.split('/');
            const dicomUIDs = {
              StudyInstanceUID: imageIdArray.slice(-7)[0],
              SeriesInstanceUID: imageIdArray.slice(-5)[0],
              SOPInstanceUID: imageIdArray.slice(-3)[0],
            };
            var requestPrediction = {
              microservice: 'orthanc',
              task: 'predict_pathology',
              file_ID: dicomUIDs.SOPInstanceUID,
              file_type: 'slice',
              file_mod: 'ct',
              file_view: 'axial',
            };

            var requestPayload = {
              count: 0,
              data: requestPrediction,
              date: String(new Date().getTime()),
              enterprise: 1,
              ips: ['2QEJ8cO8CC'],
              operation: 'read',
              route: 'aiModels',
              _v: 3,
            };
            UINotificationService.show({
              title: 'Modal de prueba',
              message: 'Esto es un modal',
            });
            retrieveAllMeasurements();
            console.log(dicomUIDs);

            /* var xhttp = new XMLHttpRequest();
            xhttp.open('POST', 'http://localhost:10001/trs/aiModels', true);
            xhttp.setRequestHeader(
              'Authorization',
              'eW1I0vBmaURGlp0uo9a7gm3cQ8EpRgcQYyIa86uXIIFVEbWrrwnnfVgE8xtR22LkfIpXUPrM4h9FQwhdvqqioUPKHycVPNrSQ7ssV40JNUHmw35Jeks0Q8zI+ad8vaLD4tlhxQ87h7t57mNGP7Utgni37geebJ6lHzqwubrYgPfBjvu/ODLO/HItbC4/r4iT4sFG6r0ZjFWM76Gm8mk9+Qr/tFCIIszfpIecc34pinRoEoCmIZNjqJjEkjS5IiYQeNYNJmt4a1RESfLZ5Xf5LZw3pA5NhRisRGpoLTDqJdPUzo0qKMo3INpivZxjm93XOiJ5wKpQEgwblPQ2Qd+lbWp3aujQzEXWVzcK1AGZKGtzhnjOw+eAJEcEO4ygRntUDNIqv5wAlaLvr7d2UoLcbq42ZCKC/EcBXPhJ6MGBkYCi1Wh6zG5kXfuJeSaFvjzHHYDvstN39K6vyUbFJa+gow/pw1vSaLLellv1lQ/WPy4G1+JFQpeVC9iOGFaRKAaH7IaUfZLrjwSsMzF9hyZ53cO92mttVjNAwLx30fK4LfMRUzLGJwEk7nzxm+zElptqfSru/IIVqPWuBZdzGYuFK6JOXYLEf+1ULzXF5SShLCcMKT9hcIRB9FRzIELgEvUMTgKgW4s5AxQJckMUbkgTXziXWiT/iL49a03eLvc1i8Lm4UIWLTWU/+bm0VnHo+b4C5kYHIyyKkToThwTAWj8C5tmgWE1U5/rJrqXndt3fiVdQtk/fCHxD9BsM2gM/osF92KjmZ3axJLn3Zm0JTOVjBxsTN1Sz1S8nIHvIs/CVmJfp1UFz8FfETWwzJYjQKguOAW7xnPfypZGY544soXmGlo9fzFT+5b3uZBYPrf2al4cOUDNz/w2MtWdPSQeNgRmYS5oFLBUTUb7wsHqA3QJgTEK2Rkuy0ZSpzSlUzqtM33jPMz8uqAUVmGjk6kE+vixHpHwdT8drLcoEyvoaHPTfV1j1pmuGCJq2Bqk0qGpcHXH/4cp3yNockBwFEWXhGnp6A=='
            );
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhttp.setRequestHeader(
              'Access-Control-Allow-Methods',
              'GET, POST, PUT, DELETE, OPTIONS'
            );
            xhttp.setRequestHeader(
              'Access-Control-Allow-Headers',
              'x-requested-with'
            );
            xhttp.setRequestHeader(
              'Access-Control-Allow-Headers',
              'X-Requested-With, Content-Type, Authorization'
            );
            xhttp.send(JSON.stringify(requestPayload)); */
          },
          storeContexts: [],
          options: {},
        },
      },
      defaultContext: ['VIEWER'],
    };
  },
};
