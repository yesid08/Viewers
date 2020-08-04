var directions = [3, 2, 1, 4, 0, 5, 6, 7];
var change_j = [-1, 0, 1, -1, 1, -1, 0, 1];
var change_i = [-1, -1, -1, 0, 0, 1, 1, 1];
var dir2idx = {
  '3': 0,
  '2': 1,
  '1': 2,
  '4': 3,
  '0': 4,
  '5': 5,
  '6': 6,
  '7': 7,
};

function findAndCodeContour(dataSlice, pixelValues, label, shape_img) {
  let pixelValuesRemoveSeg = Object.assign([], pixelValues);

  // Encuentra el primer pixel (start point)
  function findLabel(pixel) {
    return pixel === label;
  }
  let start_point = idx2coord(pixelValues.findIndex(findLabel), shape_img);
  let chain = [];
  let curr_point = start_point;
  let dirSaved = 0;
  let new_point;
  let x_vect = [];
  let y_vect = [];
  let coords_countour = [];
  let idx_segmentation = [];

  for (let direction of directions) {
    const dir = dir2idx[direction];
    new_point = [
      start_point[0] + change_i[dir],
      start_point[1] + change_j[dir],
    ];
    let idxInImg = coord2idx(new_point, shape_img);
    if (pixelValues[idxInImg] === label) {
      pixelValuesRemoveSeg[idxInImg] = 0;
      idx_segmentation.push(idxInImg);
      x_vect.push(new_point[1]);
      y_vect.push(new_point[0]);
      coords_countour.push([new_point[0], new_point[1]]);
      chain.push(direction);
      curr_point = new_point;
      dirSaved = direction;
      break;
    }
  }
  // Encuentra el contorno (border) y codifica (chain)
  var count = 0;
  while (curr_point[0] !== start_point[0] || curr_point[1] !== start_point[1]) {
    let b_direction = (dirSaved + 5) % 8;
    let dirs_1 = [...Array(8).keys()].slice(b_direction);
    let dirs_2 = Array.from(Array(b_direction).keys());
    let dirs = dirs_1.concat(dirs_2);
    let count_dir = 0;
    for (let direction of dirs) {
      const dir = dir2idx[direction];
      new_point = [
        curr_point[0] + change_i[dir],
        curr_point[1] + change_j[dir],
      ];
      let idxInImg = coord2idx(new_point, shape_img);
      if (pixelValues[idxInImg] === label) {
        pixelValuesRemoveSeg[idxInImg] = 0;
        idx_segmentation.push(idxInImg);
        x_vect.push(new_point[1]);
        y_vect.push(new_point[0]);
        coords_countour.push([new_point[0], new_point[1]]);
        chain.push(direction);
        curr_point = new_point;
        dirSaved = direction;
        if (count_dir !== 0) {
          break;
        }
      }
      count_dir++;
    }
    if (count === pixelValues.length) {
      break;
    }
    count++;
  }

  // Almacena información para cada segmentación en un corte específico
  const dataSliceLabel = {
    label: label,
    start_point: start_point,
    code: chain,
  };
  dataSlice.segmentsData.push(dataSliceLabel);

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
  // Rellena el contorno calculados
  for (const point of points) {
    if (ray_tracing_method(point[1], point[0], coords_countour) == true) {
      let idx_seg = coord2idx([point[1], point[0]], shape_img);
      idx_segmentation.push(idx_seg);
      pixelValuesRemoveSeg[idx_seg] = 0;
    }
  }
  return [dataSlice, idx_segmentation, pixelValuesRemoveSeg];
}

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

function idx2coord(idx, shape_img) {
  const rows = Math.floor(idx / shape_img[0]);
  const cols = idx % shape_img[1];
  return [rows, cols];
}

function coord2idx(coord, shape_img) {
  return coord[0] * shape_img[0] + coord[1];
}

function getAllIndexes(arr, val) {
  var indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

export const encodingSegmentations = (annotData, rows, columns) => {
  let shape_img = [rows, columns];
  let codedAnnotData = {
    shape: [],
    slicesData: [],
  };

  // Recorriendo arreglo que contiene objetos por corte segmentado.
  var slice_count = 0;
  for (const sliceData of annotData) {
    if (sliceData == undefined) {
      codedAnnotData.slicesData.push(null);
      slice_count++;
      continue;
    }
    const pixelValues = Object.values(sliceData.pixelData);
    // Objeto donde se guarda las etiquetas y las segmentaciones codificadas.
    let dataSlice = {
      slice: slice_count,
      segmentsOnLabelmap: sliceData.segmentsOnLabelmap,
      segmentsData: [],
    };
    // Recorriendo arreglo de etiquetas presentes en cada corte.
    for (const label of sliceData.segmentsOnLabelmap) {
      if (label === 0) {
        continue;
      }
      let pixelValuesRemoveSeg = Object.assign([], pixelValues);
      let foundedIdxPerLabel = [];
      let idxPerLabel = [];
      idxPerLabel = getAllIndexes(pixelValues, label);
      for (let numSegPerLabel = 0; numSegPerLabel < 20; numSegPerLabel++) {
        let result = findAndCodeContour(
          dataSlice,
          pixelValuesRemoveSeg,
          label,
          shape_img
        );
        dataSlice = Object.assign({}, result[0]);
        let idx_segmentation = result[1];
        pixelValuesRemoveSeg = Object.assign([], result[2]);
        foundedIdxPerLabel = foundedIdxPerLabel.concat(idx_segmentation);
        let noFoundedIdxPerLabel = [];
        noFoundedIdxPerLabel = idxPerLabel.filter(
          x => foundedIdxPerLabel.indexOf(x) === -1
        );
        if (noFoundedIdxPerLabel.length === 0) {
          break;
        }
      }
    }
    codedAnnotData.slicesData.push(dataSlice);
    slice_count++;
  }
  codedAnnotData.shape = [shape_img[0], shape_img[1], slice_count];
  return codedAnnotData;
};
