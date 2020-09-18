var dirsCodeVect = [0, 1, 2, 3, 4, 5, 6, 7, 8]

function dirIdxVect(idx, shape_img) {
    const W = shape_img[1]
    const y = Math.floor(idx / shape_img[1])
    const x = idx % shape_img[1]
    return [x + 1 + (y + 1) * W, x + 1 + y * W, x + 1 + (y - 1) * W, x + (y - 1) * W, x - 1 + (y - 1) * W, x - 1 + y * W, x - 1 + (y + 1) * W, x + (y + 1) * W, x + 1 + (y + 1) * W]
}

function buildDirections(idx, shape_img, dir) {
    const b_direction = dir < 4 ? dir + 5 : dir - 3
    const dirs = dirIdxVect(idx, shape_img)
    const dirs_1 = dirs.slice(b_direction,)
    const dirs_2 = dirs.slice(0, b_direction)
    const directionsIdx = dirs_1.concat(dirs_2)
    const dirsCode_1 = dirsCodeVect.slice(b_direction,)
    const dirsCode_2 = dirsCodeVect.slice(0, b_direction)
    const directionsCode = dirsCode_1.concat(dirsCode_2)
    return [directionsIdx, directionsCode]
}

function findAndCodeContour(pixelFound, pixelValues, current_label, idx, shape_img) {
    let chain = []
    let prevDiff = true;
    let prevDir = 0
    let nextIdx = idx;
    let idxVect = [nextIdx]
    let nextCode = 0
    let direction = 0;
    let count = 0
    let dirsCode
    let dirsIdx
    let valid = true

    do {
        let directionInfo = buildDirections(nextIdx, shape_img, direction);
        dirsCode = directionInfo[1]
        dirsIdx = directionInfo[0]
        prevDir = direction < 5 ? direction + 4 : direction - 4
        for (let i = 0; i < 9; i++) {
            nextIdx = dirsIdx[i];
            nextCode = dirsCode[i]
           
            if (prevDiff &&
                pixelValues[nextIdx] === current_label &&
                prevDir != nextCode &&
                idxVect[idxVect.length - 1] != nextIdx) {
                idxVect.push(nextIdx)
                chain.push(nextCode);
                direction = nextCode;
                pixelFound[nextIdx] = current_label

                break
            }
            prevDiff = pixelValues[nextIdx] != current_label;
        }
        count++
    } while ((nextIdx != idx) && count != 10001)

    if (count < 40 || count > 10000){ valid = false}

    const dataSliceLabel = {
        label: current_label,
        start_point: idx,
        code: chain
    }

    return [valid, pixelValues, dataSliceLabel, pixelFound]
}

export function encodingSegmentations(annotData, rows, columns) {
    let k = 1
    let shape_img = [rows, columns]
    let codedAnnotData = {
        shape: [],
        slicesData: []
    }

    var slice_count = 0
    for (const sliceData of annotData) {
        if (sliceData == undefined) {
            codedAnnotData.slicesData.push(null)
            slice_count++
            continue
        }
        let pixelValues = Object.values(sliceData.pixelData)
        var pixelFound = new Uint16Array(shape_img[0] * shape_img[1]);
        let sliceDataEncode = {
            slice: slice_count,
            segmentsOnLabelmap: sliceData.segmentsOnLabelmap,
            segmentsData: []
        }

        for (let y = 0; y < rows; y += k) {
            const aptInit = y * rows;
            const aptEnd = aptInit + columns;

            let valid = true
            for (let idx = aptInit; idx < aptEnd; idx++) {
                if (idx === 0) { continue }
                let current_label = pixelValues[idx]
                const prev_label = pixelValues[idx - 1]
           
                if (
                    current_label &&
                    current_label != pixelFound[idx] &&
                    current_label != prev_label
                ) {
                    let result = findAndCodeContour(pixelFound, pixelValues, current_label, idx, shape_img)
                    valid = result[0]
                    pixelValues = result[1]
                    pixelFound = result[3]
                    if (valid){
                        sliceDataEncode.segmentsData.push(result[2])
                    }
                }
            }
        }

        codedAnnotData.slicesData.push(sliceDataEncode)
        slice_count++
    }
    codedAnnotData.shape = [shape_img[0], shape_img[1], slice_count]
    return codedAnnotData
}