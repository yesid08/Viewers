function coord2idx(coord, shape_img) {
  return coord[0] * shape_img[1] + coord[1];
}

function idx2coord(idx, shape_img) {
  const rows = Math.floor(idx / shape_img[1]);
  const cols = idx % shape_img[1];
  return [rows, cols];
}

function n8Array(y, x, pixelValue, shape_img) {
  const W = shape_img[1];
  const array_values = [
    pixelValue[x + 1 + (y + 1) * W],
    pixelValue[x + 1 + y * W],
    pixelValue[x + 1 + (y - 1) * W],
    pixelValue[x + (y - 1) * W],
    pixelValue[x - 1 + (y - 1) * W],
    pixelValue[x - 1 + y * W],
    pixelValue[x - 1 + (y + 1) * W],
    pixelValue[x + (y + 1) * W],
    pixelValue[x + 1 + (y + 1) * W],
  ];
  return array_values;
}

function n8UpDown(idx, active_label, pixelValue, shape_img) {
  const W = shape_img[1];
  const y = Math.floor(idx / shape_img[1]);
  const x = idx % shape_img[1];
  const bordersDown = [
    pixelValue[x + 1 + (y + 1) * W],
    pixelValue[x - 1 + (y + 1) * W],
    pixelValue[x + (y + 1) * W],
  ];
  const bordersUp = [
    pixelValue[x + 1 + (y - 1) * W],
    pixelValue[x + (y - 1) * W],
    pixelValue[x - 1 + (y - 1) * W],
  ];
  return [
    countSameNeighbor(bordersDown, active_label).reduce(sumArray),
    countSameNeighbor(bordersUp, active_label).reduce(sumArray),
  ];
}

function sumArray(total, num) {
  return total + num;
}

function countSameNeighbor(border, label) {
  let result = [false, false, false];
  for (let i = 0; i < border.length; i++) {
    if (border[i] == label) {
      result[i] = true;
    }
  }
  return result;
}

function twoConsecutiveN8(n8, label) {
  let exist = false;
  for (let i = 0; i < n8.length; i++) {
    if (n8[i + 1] == label && n8[i] == label) {
      exist = true;
      break;
    }
  }
  return exist;
}

export function decodingSegmentations(codedAnnotData) {
  var retrivedAnnotData = [];
  let shape_img = codedAnnotData.shape;
  const initPixelData = new Uint16Array(shape_img[0] * shape_img[1]);

  // Recorre el arreglo con los cortes donde  hay segmentación
  for (const sliceData of codedAnnotData.slicesData) {
    if (sliceData == null) {
      retrivedAnnotData.push(null);
      continue;
    }
    // Inicializa objeto idéntico a la entrada
    let dataSlice = {
      segmentsOnLabelmap: sliceData.segmentsOnLabelmap,
      pixelData: new Uint16Array(initPixelData),
    };

    let layers = [];
    let layers_borders = [];
    // Recorre el arreglo que contiene las segmentaciones códificadas presentes en un corte
    for (const segmentData of sliceData.segmentsData) {
      let pixelLayer = [...initPixelData];
      const tmp = idx2coord(segmentData.start_point, shape_img);
      let y = tmp[0];
      let x = tmp[1];
      pixelLayer[segmentData.start_point] = segmentData.label;
      let x_vect = [];
      let y_vect = [];
      let coords_countour = [];
      x_vect.push(x);
      y_vect.push(y);
      coords_countour.push([y, x, segmentData.start_point]);
      let idx_contour;
      // Decodifica la segmentación
      for (const direction of segmentData.code) {
        if ([2, 3, 4].includes(direction)) {
          y -= 1;
        }
        if ([6, 7, 8, 0].includes(direction)) {
          y += 1;
        }
        if ([4, 5, 6].includes(direction)) {
          x -= 1;
        }
        if ([2, 1, 0, 8].includes(direction)) {
          x += 1;
        }
        idx_contour = coord2idx([y, x], shape_img);
        pixelLayer[idx_contour] = segmentData.label;
        x_vect.push(x);
        y_vect.push(y);
        coords_countour.push([y, x, idx_contour]);
      }

      const thresh = segmentData.label * 2;
      let n8, sum_array;
      for (const coords of coords_countour) {
        n8 = n8Array(coords[0], coords[1], pixelLayer, shape_img);

        sum_array = n8.slice(0, n8.length - 1).reduce(sumArray);
        if (sum_array <= thresh) {
          if (
            twoConsecutiveN8(n8.slice(0, n8.length), segmentData.label) ||
            sum_array <= segmentData.label
          ) {
            pixelLayer[coords[2]] = 0;
          }
        }
      }

      let pixelOrigBorder = [...pixelLayer];
      layers_borders.push(pixelOrigBorder);

      let minX = Math.min(...x_vect);
      let maxX = Math.max(...x_vect);
      let minY = Math.min(...y_vect);
      let maxY = Math.max(...y_vect);

      let idx;
      let current_label;
      let prev_label;
      for (let y_coord = minY; y_coord < maxY; y_coord++) {
        let intoBorder = false;
        let arrayIn = [];
        let upIn, downIn, upOut, downOut;
        for (let x_coord = minX; x_coord < maxX; x_coord++) {
          idx = coord2idx([y_coord, x_coord], shape_img);
          if (idx == 0) {
            continue;
          }
          current_label = pixelLayer[idx];
          prev_label = pixelLayer[idx - 1];
          if (
            pixelOrigBorder[idx] &&
            pixelOrigBorder[idx] != pixelOrigBorder[idx - 1] &&
            !intoBorder
          ) {
            let resultN8UpDownIn = n8UpDown(
              idx,
              current_label,
              pixelOrigBorder,
              shape_img
            );
            upIn = resultN8UpDownIn[0];
            downIn = resultN8UpDownIn[1];
            if (!(Boolean(upIn) && Boolean(downIn))) {
              intoBorder = true;
            }
          } else if (current_label != prev_label && intoBorder) {
            intoBorder = false;
            let resultN8UpDownOut = n8UpDown(
              idx,
              prev_label,
              pixelOrigBorder,
              shape_img
            );
            upOut = resultN8UpDownOut[0];
            downOut = resultN8UpDownOut[1];
            if (
              Boolean(upIn) == Boolean(upOut) &&
              Boolean(downIn) == Boolean(downOut)
            ) {
              if (arrayIn.length) {
                arrayIn.shift();
              } else {
                arrayIn.push(prev_label);
              }
              if (arrayIn.length) {
                pixelLayer[idx] = arrayIn[arrayIn.length - 1];
                continue;
              }
            }
          }
          if (
            pixelOrigBorder[idx] == pixelOrigBorder[idx - 1] &&
            arrayIn.includes(current_label)
          ) {
            continue;
          }
          if (
            (current_label && !prev_label) ||
            (current_label != prev_label && current_label && prev_label)
          ) {
            arrayIn.push(current_label);
            continue;
          }
          if (!current_label && prev_label && arrayIn.length) {
            pixelLayer[idx] = arrayIn[arrayIn.length - 1];
            continue;
          } else if (
            current_label &&
            prev_label &&
            current_label == prev_label &&
            arrayIn.includes(current_label)
          ) {
            arrayIn.shift();
          }
        }
      }

      layers.push([pixelLayer, segmentData.label]);
    }

    for (let active_label of dataSlice.segmentsOnLabelmap) {
      if (active_label == 0) {
        continue;
      }
      let layer_per_label = [...initPixelData];
      let idx_layer = 0;
      for (let layerInfo of layers) {
        let layer_label = layerInfo[1];
        if (layer_label == active_label) {
          for (let idx = 0; idx < layer_per_label.length; idx++) {
            layer_per_label[idx] =
              Boolean(layer_per_label[idx]) != Boolean(layerInfo[0][idx]);
            layer_per_label[idx] =
              Boolean(layer_per_label[idx]) ||
              Boolean(layers_borders[idx_layer][idx]);
          }
        }
        idx_layer++;
      }
      for (let idx = 0; idx < layer_per_label.length; idx++) {
        layer_per_label[idx] = layer_per_label[idx] * active_label;
        dataSlice.pixelData[idx] =
          dataSlice.pixelData[idx] + layer_per_label[idx];
      }
    }
    retrivedAnnotData.push(dataSlice);
  }
  return retrivedAnnotData;
}
