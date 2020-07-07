/* eslint-disable no-console */
import { retrieveAllMeasurements, saveMeasurements } from './Measurements';
import {
  launchPetition,
  generatePetitionData,
  responseNotification,
} from './ComandsModule';
import { getDicomUIDs, getAllInstancesUIDs } from './utils';
import cornerstoneTools from 'cornerstone-tools';

import ToolbarModule from './ToolbarModule';
import * as BUTTONS from './ToolbarModule';
export const DeepSARSAiExtension = {
  id: 'volumenCtExtension',
  getToolbarModule() {
    return ToolbarModule;
  },
  getCommandsModule({ servicesManager, commandsManager }) {
    const { UINotificationService } = servicesManager.services;
    return {
      definitions: {
        predecirVolumenCt: {
          commandFn: function() {
            var requestPayload = generatePetitionData(
              'volumen',
              'ct',
              'axial',
              'predict_pathology'
            );

            UINotificationService.show({
              title: 'Realizando predicción',
              message: 'Este proceso tomara unos segundos.',
            });

            var requestPromise = launchPetition(
              'POST',
              'http://localhost/trs/aiModels/',
              requestPayload
            );
            requestPromise
              .then(response => {
                responseNotification(response, UINotificationService, BUTTONS);
              })
              .catch(error => {
                UINotificationService.show({
                  type: 'error',
                  title: 'Error',
                  message: 'Sin conexión.',
                });
              });
          },
          storeContexts: [],
          options: {},
        },
        predecirSliceCt: {
          commandFn: function() {
            const dicomUIDs = getDicomUIDs();
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
              title: 'Realizando predicción',
              message: 'Este proceso tomara unos segundos.',
            });
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                  var response = JSON.parse(xhttp.response);
                  if (response.data.hasOwnProperty('error')) {
                    UINotificationService.show({
                      title: 'Error de Predicción',
                      type: 'warning',
                      message: 'Por favor intente de nuevo',
                    });
                  } else {
                    var pathology = response.data.class;
                    var probability =
                      response.data.probability.toFixed(2) * 100 + '%';
                    BUTTONS.BUTTON_CT_SLICE_PATHOLOGY.label = pathology;
                    BUTTONS.BUTTON_CT_SLICE_PROBABILITY.label = probability;
                    UINotificationService.show({
                      title: 'Predicción exitosa',
                      message:
                        'La clase predicha fue ' +
                        pathology +
                        ' con una confianza de ' +
                        probability,
                    });
                  }
                } else {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexión.',
                  });
                }
              }
            };
            xhttp.open(
              'POST',
              'https://deepsars.uis.edu.co/trs/aiModels/',
              true
            );
            xhttp.setRequestHeader(
              'Authorization',
              'eW1I0vBmaURGlp0uo9a7gm3cQ8EpRgcQYyIa86uXIIFVEbWrrwnnfVgE8xtR22LkfIpXUPrM4h9FQwhdvqqioUPKHycVPNrSQ7ssV40JNUHmw35Jeks0Q8zI+ad8vaLD4tlhxQ87h7t57mNGP7Utgni37geebJ6lHzqwubrYgPfBjvu/ODLO/HItbC4/r4iT4sFG6r0ZjFWM76Gm8mk9+Qr/tFCIIszfpIecc34pinRoEoCmIZNjqJjEkjS5IiYQeNYNJmt4a1RESfLZ5Xf5LZw3pA5NhRisRGpoLTDqJdPUzo0qKMo3INpivZxjm93XOiJ5wKpQEgwblPQ2Qd+lbWp3aujQzEXWVzcK1AGZKGtzhnjOw+eAJEcEO4ygRntUDNIqv5wAlaLvr7d2UoLcbq42ZCKC/EcBXPhJ6MGBkYCi1Wh6zG5kXfuJeSaFvjzHHYDvstN39K6vyUbFJa+gow/pw1vSaLLellv1lQ/WPy4G1+JFQpeVC9iOGFaRKAaH7IaUfZLrjwSsMzF9hyZ53cO92mttVjNAwLx30fK4LfMRUzLGJwEk7nzxm+zElptqfSru/IIVqPWuBZdzGYuFK6JOXYLEf+1ULzXF5SShLCcMKT9hcIRB9FRzIELgEvUMTgKgW4s5AxQJckMUbkgTXziXWiT/iL49a03eLvc1i8Lm4UIWLTWU/+bm0VnHo+b4C5kYHIyyKkToThwTAWj8C5tmgWE1U5/rJrqXndt3fiVdQtk/fCHxD9BsM2gM/osF92KjmZ3axJLn3Zm0JTOVjBxsTN1Sz1S8nIHvIs/CVmJfp1UFz8FfETWwzJYjQKguOAW7xnPfypZGY544soXmGlo9fzFT+5b3uZBYPrf2al4cOUDNz/w2MtWdPSQeNgRmYS5oFLBUTUb7wsHqA3QJgTEK2Rkuy0ZSpzSlUzqtM33jPMz8uqAUVmGjk6kE+vixHpHwdT8drLcoEyvoaHPTfV1j1pmuGCJq2Bqk0qGpcHXH/4cp3yNockBwFEWXhGnp6A=='
            );
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(requestPayload));
          },
          storeContexts: [],
          options: {},
        },
        predecirSliceRx: {
          commandFn: function() {
            const dicomUIDs = getDicomUIDs();
            var requestPrediction = {
              microservice: 'orthanc',
              task: 'predict_pathology',
              file_ID: dicomUIDs.SOPInstanceUID,
              file_type: 'slice',
              file_mod: 'RX',
              file_view: 'frontal',
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
              title: 'Realizando predicción',
              message: 'Este proceso tomara unos segundos.',
            });
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                  var response = JSON.parse(xhttp.response);
                  if (response.data.hasOwnProperty('error')) {
                    UINotificationService.show({
                      title: 'Error de Predicción',
                      type: 'warning',
                      message: 'Por favor intente de nuevo',
                    });
                  } else {
                    var pathology = response.data.class;
                    var probability =
                      response.data.probability.toFixed(2) * 100 + '%';
                    BUTTONS.BUTTON_RX_PATHOLOGY.label = pathology;
                    BUTTONS.BUTTON_RX_PROBABILITY.label = probability;
                    UINotificationService.show({
                      title: 'Predicción exitosa',
                      message:
                        'La clase predicha fue ' +
                        pathology +
                        ' con una confianza de ' +
                        probability,
                    });
                  }
                } else {
                  UINotificationService.show({
                    type: 'error',
                    title: 'Error',
                    message: 'Sin conexión.',
                  });
                }
              }
            };
            xhttp.open('POST', 'http://localhost/trs/aiModels/', true);
            xhttp.timeout = 80000;
            xhttp.setRequestHeader(
              'Authorization',
              'eW1I0vBmaURGlp0uo9a7gm3cQ8EpRgcQYyIa86uXIIFVEbWrrwnnfVgE8xtR22LkfIpXUPrM4h9FQwhdvqqioUPKHycVPNrSQ7ssV40JNUHmw35Jeks0Q8zI+ad8vaLD4tlhxQ87h7t57mNGP7Utgni37geebJ6lHzqwubrYgPfBjvu/ODLO/HItbC4/r4iT4sFG6r0ZjFWM76Gm8mk9+Qr/tFCIIszfpIecc34pinRoEoCmIZNjqJjEkjS5IiYQeNYNJmt4a1RESfLZ5Xf5LZw3pA5NhRisRGpoLTDqJdPUzo0qKMo3INpivZxjm93XOiJ5wKpQEgwblPQ2Qd+lbWp3aujQzEXWVzcK1AGZKGtzhnjOw+eAJEcEO4ygRntUDNIqv5wAlaLvr7d2UoLcbq42ZCKC/EcBXPhJ6MGBkYCi1Wh6zG5kXfuJeSaFvjzHHYDvstN39K6vyUbFJa+gow/pw1vSaLLellv1lQ/WPy4G1+JFQpeVC9iOGFaRKAaH7IaUfZLrjwSsMzF9hyZ53cO92mttVjNAwLx30fK4LfMRUzLGJwEk7nzxm+zElptqfSru/IIVqPWuBZdzGYuFK6JOXYLEf+1ULzXF5SShLCcMKT9hcIRB9FRzIELgEvUMTgKgW4s5AxQJckMUbkgTXziXWiT/iL49a03eLvc1i8Lm4UIWLTWU/+bm0VnHo+b4C5kYHIyyKkToThwTAWj8C5tmgWE1U5/rJrqXndt3fiVdQtk/fCHxD9BsM2gM/osF92KjmZ3axJLn3Zm0JTOVjBxsTN1Sz1S8nIHvIs/CVmJfp1UFz8FfETWwzJYjQKguOAW7xnPfypZGY544soXmGlo9fzFT+5b3uZBYPrf2al4cOUDNz/w2MtWdPSQeNgRmYS5oFLBUTUb7wsHqA3QJgTEK2Rkuy0ZSpzSlUzqtM33jPMz8uqAUVmGjk6kE+vixHpHwdT8drLcoEyvoaHPTfV1j1pmuGCJq2Bqk0qGpcHXH/4cp3yNockBwFEWXhGnp6A=='
            );
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send(JSON.stringify(requestPayload));
          },
          storeContexts: [],
          options: {},
        },
        load_measurement: {
          commandFn: retrieveAllMeasurements,
          storeContexts: [],
          options: {},
        },
        save_measurement: {
          commandFn: saveMeasurements,
          storeContexts: [],
          options: {},
        },
        reload: {
          commandFn: function() {
            location.reload();
          },
          storeContexts: [],
          options: {},
        },
        load_heat_map: {
          commandFn: function() {
            const allDicomUIDs = getAllInstancesUIDs();
            const targetUIDs = allDicomUIDs.filter(dicomUID => {
              return (
                dicomUID.SeriesInstanceUID == getDicomUIDs().SeriesInstanceUID
              );
            });

            function loop(targetUIDs, i) {
              if (i >= targetUIDs.length) {
                return;
              }

              var requestPrediction = {
                microservice: 'orthanc',
                task: 'prepare',
                file_ID: targetUIDs[i].SOPInstanceUID,
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
                title: 'Realizando predicción',
                message: 'Este proceso tomara unos segundos.',
              });

              var url = 'https://deepsars.uis.edu.co/trs/aiModels/';
              var request = new XMLHttpRequest();
              request.open('POST', url);
              request.onreadystatechange = function() {
                if (
                  request.readyState === XMLHttpRequest.DONE &&
                  request.status === 200
                ) {
                  var data = JSON.parse(request.responseText);
                  console.log(data);
                  loop(targetUIDs, i + 1);
                }
              };
              request.setRequestHeader(
                'Authorization',
                'eW1I0vBmaURGlp0uo9a7gm3cQ8EpRgcQYyIa86uXIIFVEbWrrwnnfVgE8xtR22LkfIpXUPrM4h9FQwhdvqqioUPKHycVPNrSQ7ssV40JNUHmw35Jeks0Q8zI+ad8vaLD4tlhxQ87h7t57mNGP7Utgni37geebJ6lHzqwubrYgPfBjvu/ODLO/HItbC4/r4iT4sFG6r0ZjFWM76Gm8mk9+Qr/tFCIIszfpIecc34pinRoEoCmIZNjqJjEkjS5IiYQeNYNJmt4a1RESfLZ5Xf5LZw3pA5NhRisRGpoLTDqJdPUzo0qKMo3INpivZxjm93XOiJ5wKpQEgwblPQ2Qd+lbWp3aujQzEXWVzcK1AGZKGtzhnjOw+eAJEcEO4ygRntUDNIqv5wAlaLvr7d2UoLcbq42ZCKC/EcBXPhJ6MGBkYCi1Wh6zG5kXfuJeSaFvjzHHYDvstN39K6vyUbFJa+gow/pw1vSaLLellv1lQ/WPy4G1+JFQpeVC9iOGFaRKAaH7IaUfZLrjwSsMzF9hyZ53cO92mttVjNAwLx30fK4LfMRUzLGJwEk7nzxm+zElptqfSru/IIVqPWuBZdzGYuFK6JOXYLEf+1ULzXF5SShLCcMKT9hcIRB9FRzIELgEvUMTgKgW4s5AxQJckMUbkgTXziXWiT/iL49a03eLvc1i8Lm4UIWLTWU/+bm0VnHo+b4C5kYHIyyKkToThwTAWj8C5tmgWE1U5/rJrqXndt3fiVdQtk/fCHxD9BsM2gM/osF92KjmZ3axJLn3Zm0JTOVjBxsTN1Sz1S8nIHvIs/CVmJfp1UFz8FfETWwzJYjQKguOAW7xnPfypZGY544soXmGlo9fzFT+5b3uZBYPrf2al4cOUDNz/w2MtWdPSQeNgRmYS5oFLBUTUb7wsHqA3QJgTEK2Rkuy0ZSpzSlUzqtM33jPMz8uqAUVmGjk6kE+vixHpHwdT8drLcoEyvoaHPTfV1j1pmuGCJq2Bqk0qGpcHXH/4cp3yNockBwFEWXhGnp6A=='
              );
              request.setRequestHeader('Content-Type', 'application/json');
              request.send(JSON.stringify(requestPayload));
            }
            loop(targetUIDs, 0);
          },
          storeContexts: [],
          options: {},
        },
        show_current_segmentation: {
          commandFn: function() {
            const dicomUIDs = getDicomUIDs();
            var segmentationModule = cornerstoneTools.getModule('segmentation');
            var segmentationSeries = segmentationModule.state.series;
            var wadorsKey = Object.keys(segmentationSeries).find(wadors => {
              return (
                wadors.split('/').slice(-7)[0] == dicomUIDs.StudyInstanceUID
              );
            });
            if (!wadorsKey) {
              console.log('There are no segmentations to show');
            } else {
              var segmentationSeriesMetadata =
                segmentationSeries[wadorsKey].labelmaps3D[0].metadata;
              console.log(segmentationSeriesMetadata);
              var segmentationMaskDataArray =
                segmentationSeries[wadorsKey].labelmaps3D[0].labelmaps2D;
              console.log(segmentationMaskDataArray);
            }
          },
          storeContexts: [],
          options: {},
        },
      },

      defaultContext: ['VIEWER'],
    };
  },
};
