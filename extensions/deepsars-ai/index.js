import cornerstone from 'cornerstone-core';
import { retrieveAllMeasurements } from './Measurements';
import ToolbarModule from './ToolbarModule';
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
              file_type: 'volumen',
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
              if (xhttp.readyState == 4 && xhttp.status == 200) {
                UINotificationService.show({
                  title: 'Realizado',
                });
              } else {
                UINotificationService.show({
                  type: 'error',
                  title: 'Error',
                  message: 'Sin conexión.',
                });
              }
            };
            xhttp.open('POST', 'http://localhost:10001/trs/aiModels', true);
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
        predecirSliceCt: {
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
              title: 'Realizando predicción',
              message: 'Este proceso tomara unos segundos.',
            });
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (xhttp.readyState == 4 && xhttp.status == 200) {
                UINotificationService.show({
                  title: 'Realizado',
                });
              } else {
                UINotificationService.show({
                  type: 'error',
                  title: 'Error',
                  message: 'Sin conexión.',
                });
              }
            };
            xhttp.open('POST', 'http://localhost:10001/trs/aiModels', true);
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
              file_mod: 'DX',
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
              if (xhttp.readyState == 4 && xhttp.status == 200) {
                UINotificationService.show({
                  title: 'Realizado',
                });
              } else {
                UINotificationService.show({
                  type: 'error',
                  title: 'Error',
                  message: 'Sin conexión.',
                });
              }
            };
            xhttp.open('POST', 'http://localhost:10001/trs/aiModels', true);
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
      },
      defaultContext: ['VIEWER'],
    };
  },
};
