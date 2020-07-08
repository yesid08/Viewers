import { getDicomUIDs, getAllInstancesUIDs } from './utils';

/*TODO List: By Yesid G.
  1) Create petitions utilities inside of utils.py
  2) Create the logic of each button in the corresponding section (heatmaps.js or predictions.js) by using functions.
  3) Inside this file(commands module) just call the functions from heatmaps.js or predictions.js in front of each commandFn.
  4) This file should have the same form of the one that is currently in index, the idea is to export the whole object to index.
  5) In the file index.js import this commandsModule.js file and return the object of this file
  6) commit the changes and have fun!
*/
export const launchPetition = (petition, url, requestPayload) => {
  const promisePetition = new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          resolve(JSON.parse(xhttp.response));
        } else {
          reject('Sin conexión');
        }
      }
    };
    xhttp.open(petition, url, true);
    xhttp.setRequestHeader(
      'Authorization',
      'eW1I0vBmaURGlp0uo9a7gm3cQ8EpRgcQYyIa86uXIIFVEbWrrwnnfVgE8xtR22LkfIpXUPrM4h9FQwhdvqqioUPKHycVPNrSQ7ssV40JNUHmw35Jeks0Q8zI+ad8vaLD4tlhxQ87h7t57mNGP7Utgni37geebJ6lHzqwubrYgPfBjvu/ODLO/HItbC4/r4iT4sFG6r0ZjFWM76Gm8mk9+Qr/tFCIIszfpIecc34pinRoEoCmIZNjqJjEkjS5IiYQeNYNJmt4a1RESfLZ5Xf5LZw3pA5NhRisRGpoLTDqJdPUzo0qKMo3INpivZxjm93XOiJ5wKpQEgwblPQ2Qd+lbWp3aujQzEXWVzcK1AGZKGtzhnjOw+eAJEcEO4ygRntUDNIqv5wAlaLvr7d2UoLcbq42ZCKC/EcBXPhJ6MGBkYCi1Wh6zG5kXfuJeSaFvjzHHYDvstN39K6vyUbFJa+gow/pw1vSaLLellv1lQ/WPy4G1+JFQpeVC9iOGFaRKAaH7IaUfZLrjwSsMzF9hyZ53cO92mttVjNAwLx30fK4LfMRUzLGJwEk7nzxm+zElptqfSru/IIVqPWuBZdzGYuFK6JOXYLEf+1ULzXF5SShLCcMKT9hcIRB9FRzIELgEvUMTgKgW4s5AxQJckMUbkgTXziXWiT/iL49a03eLvc1i8Lm4UIWLTWU/+bm0VnHo+b4C5kYHIyyKkToThwTAWj8C5tmgWE1U5/rJrqXndt3fiVdQtk/fCHxD9BsM2gM/osF92KjmZ3axJLn3Zm0JTOVjBxsTN1Sz1S8nIHvIs/CVmJfp1UFz8FfETWwzJYjQKguOAW7xnPfypZGY544soXmGlo9fzFT+5b3uZBYPrf2al4cOUDNz/w2MtWdPSQeNgRmYS5oFLBUTUb7wsHqA3QJgTEK2Rkuy0ZSpzSlUzqtM33jPMz8uqAUVmGjk6kE+vixHpHwdT8drLcoEyvoaHPTfV1j1pmuGCJq2Bqk0qGpcHXH/4cp3yNockBwFEWXhGnp6A=='
    );
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(requestPayload));
  });

  return promisePetition;
};

export const generatePetitionData = (file_type, file_mod, file_view, task) => {
  const dicomUIDs = getDicomUIDs();
  var requestPrediction = {
    microservice: 'orthanc',
    task: task,
    file_ID: dicomUIDs.SeriesInstanceUID,
    file_type: file_type,
    file_mod: file_mod,
    file_view: file_view,
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

  return requestPayload;
};

export const responseNotification = (
  response,
  UINotificationService,
  BUTTONS
) => {
  if (response.data.hasOwnProperty('error')) {
    UINotificationService.show({
      title: 'Error de Predicción',
      type: 'warning',
      message: 'Por favor intente de nuevo',
    });
  } else {
    var pathology = response.data.class;
    var probability = response.data.probability.toFixed(2) * 100 + '%';
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
};
// funcion de prueba!

export const solicitud = () => {
  var requestPrediction = {
    microservice: 'orthanc',
    task: 'predict_pathology',
    file_ID: '1.03123.123123',
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

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4) {
      if (xhttp.status == 200) {
        var response = JSON.parse(xhttp.response);
        if (response.data.hasOwnProperty('error')) {
          console.log('ERROR AL PREDECIR');
        } else {
          console.log('Respuesta =>', response.data);
        }
      } else {
        console.log('Error de Conexión');
      }
    }
  };
  xhttp.open('POST', 'https://deepsars.uis.edu.co/trs/aiModels/', true);
  xhttp.setRequestHeader(
    'Authorization',
    'eW1I0vBmaURGlp0uo9a7gm3cQ8EpRgcQYyIa86uXIIFVEbWrrwnnfVgE8xtR22LkfIpXUPrM4h9FQwhdvqqioUPKHycVPNrSQ7ssV40JNUHmw35Jeks0Q8zI+ad8vaLD4tlhxQ87h7t57mNGP7Utgni37geebJ6lHzqwubrYgPfBjvu/ODLO/HItbC4/r4iT4sFG6r0ZjFWM76Gm8mk9+Qr/tFCIIszfpIecc34pinRoEoCmIZNjqJjEkjS5IiYQeNYNJmt4a1RESfLZ5Xf5LZw3pA5NhRisRGpoLTDqJdPUzo0qKMo3INpivZxjm93XOiJ5wKpQEgwblPQ2Qd+lbWp3aujQzEXWVzcK1AGZKGtzhnjOw+eAJEcEO4ygRntUDNIqv5wAlaLvr7d2UoLcbq42ZCKC/EcBXPhJ6MGBkYCi1Wh6zG5kXfuJeSaFvjzHHYDvstN39K6vyUbFJa+gow/pw1vSaLLellv1lQ/WPy4G1+JFQpeVC9iOGFaRKAaH7IaUfZLrjwSsMzF9hyZ53cO92mttVjNAwLx30fK4LfMRUzLGJwEk7nzxm+zElptqfSru/IIVqPWuBZdzGYuFK6JOXYLEf+1ULzXF5SShLCcMKT9hcIRB9FRzIELgEvUMTgKgW4s5AxQJckMUbkgTXziXWiT/iL49a03eLvc1i8Lm4UIWLTWU/+bm0VnHo+b4C5kYHIyyKkToThwTAWj8C5tmgWE1U5/rJrqXndt3fiVdQtk/fCHxD9BsM2gM/osF92KjmZ3axJLn3Zm0JTOVjBxsTN1Sz1S8nIHvIs/CVmJfp1UFz8FfETWwzJYjQKguOAW7xnPfypZGY544soXmGlo9fzFT+5b3uZBYPrf2al4cOUDNz/w2MtWdPSQeNgRmYS5oFLBUTUb7wsHqA3QJgTEK2Rkuy0ZSpzSlUzqtM33jPMz8uqAUVmGjk6kE+vixHpHwdT8drLcoEyvoaHPTfV1j1pmuGCJq2Bqk0qGpcHXH/4cp3yNockBwFEWXhGnp6A=='
  );
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(requestPayload));
};
