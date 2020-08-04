function ray_tracing_method(x, y, poly) {
  const n = poly.length;
  let inside = false;
  let p1x, p1y, p2x, p2y, xints;
  p1x = poly[0][0];
  p1y = poly[0][1];
  for (let i = 0; i < n + 1; i++) {
    p2x = poly[i % n][0];
    p2y = poly[i % n][1];
    if (y > Math.min(p1y, p2y)) {
      if (y <= Math.max(p1y, p2y)) {
        if (x <= Math.max(p1x, p2x)) {
          if (p1y !== p2y) {
            xints = ((y - p1y) * (p2x - p1x)) / (p2y - p1y) + p1x;
          }
          if (p1x === p2x || x <= xints) {
            inside = !inside;
          }
        }
      }
    }
    p1x = p2x;
    p1y = p2y;
  }
  return inside;
}

function coord2idx(coord, shape_img) {
  return coord[0] * shape_img[0] + coord[1];
}

export function decodingSegmentations(codedAnnotData) {
  var retrivedAnnotData = [];
  let shape_img = codedAnnotData.shape;
  const initPixelData = new Uint16Array(shape_img[0] * shape_img[1]);

  // Recorre el arreglo con los cortes donde hay segmentación
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

    // Recorre el arreglo que contiene las segmentaciones códificadas presentes en un corte
    for (const segmentData of sliceData.segmentsData) {
      let y = segmentData.start_point[0];
      let x = segmentData.start_point[1];
      dataSlice.pixelData[coord2idx(segmentData.start_point, shape_img)] =
        segmentData.label;
      let x_vect = [];
      let y_vect = [];
      let coords_countour = [];
      x_vect.push(x);
      y_vect.push(y);
      coords_countour.push([y, x]);
      // Decodifica la segmentación
      for (const direction of segmentData.code) {
        if ([1, 2, 3].includes(direction)) {
          y -= 1;
        }
        if ([5, 6, 7].includes(direction)) {
          y += 1;
        }
        if ([3, 4, 5].includes(direction)) {
          x -= 1;
        }
        if ([0, 1, 7].includes(direction)) {
          x += 1;
        }
        dataSlice.pixelData[coord2idx([y, x], shape_img)] = segmentData.label;
        x_vect.push(x);
        y_vect.push(y);
        coords_countour.push([y, x]);
      }

      let minX = Math.min(...x_vect);
      let maxX = Math.max(...x_vect);
      let minY = Math.min(...y_vect);
      let maxY = Math.max(...y_vect);

      let points = [];
      for (let x_coord = minX; x_coord < maxX; x_coord++) {
        for (let y_coord = minY; y_coord < maxY; y_coord++) {
          points.push([x_coord, y_coord]);
        }
      }
      // Rellena el contorno calculado
      for (const point of points) {
        if (ray_tracing_method(point[1], point[0], coords_countour) == true) {
          dataSlice.pixelData[coord2idx([point[1], point[0]], shape_img)] =
            segmentData.label;
        }
      }
    }
    retrivedAnnotData.push(dataSlice);
  }
  return retrivedAnnotData;
}
