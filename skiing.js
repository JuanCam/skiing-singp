const fs = require('fs');

const mapFile = process.argv[2];

fs.readFile(mapFile, 'utf-8', (err, data) => {
    const M = data.split('\n').slice(1)
        .map(line => line.split(' ')
            .map(item => parseInt(item)));
    console.info('Processing...');
    const {
        maxLen,
        drop
    } = findLongestPath(M);
    console.info(`Completed!\n- Longest path: ${maxLen}\n- Steepest drop: ${drop}`);
});

/**
 * Finds the longest path in a squared map.
 * @param {!Array<Array<number>>} M Matrix map
 * @returns {!Object}
 */
const findLongestPath = (M) => {
    const lowestPoints = getLowestMapPoints(M);
    const lengths = new Map();
    const maxLengths = [];
    const size = M.length;
    let maxLen = -1;
    
    // Compute the longest distance from the lowest points to all reachable points.
    lowestPoints.forEach(point => {

        const {row, col} = mapCoords(point, size);
        let reachablePnts = [point];
        lengths.set(point, 1);

        
        while (reachablePnts.length) {
            const curr = reachablePnts.pop(-1);
            const upperPnts = getUpperPoints(M, curr);
            reachablePnts = reachablePnts.concat(upperPnts);

            for (const pnt of upperPnts) {
                if (!lengths.get(pnt) || lengths.get(curr) > lengths.get(pnt)) {
                    const ndist = (lengths.get(curr)) ? lengths.get(curr) : 0
                    lengths.set(pnt, ndist + 1);
                }
            }
        }

        lengths.forEach((ln, pnt) => {
            const p = mapCoords(pnt, size);
            const drop = Math.abs(M[p.row][p.col] - M[row][col]);
            
            if (ln >= maxLen) {
                maxLen = ln;
                maxLengths.push({
                    maxLen,
                    drop
                });
            }
        });

        lengths.clear();

    });


    return getMaxDistanceAndStep(maxLengths);
}

/**
 * Returns all reachable points.
 * @param {!Array<Array<number>>} M Matrix map
 * @param {number} point Mapped point.
 * @returns {!Array<number>}
 */
const getUpperPoints = (M, point) => {
    const size = M.length;
    const {
        row,
        col
    } = mapCoords(point, size);
    const points = [];
    const cRow = M[row];
    const south = M[row - 1];
    const north = M[row + 1];
    const val = cRow[col];

    north && north[col] > val && points.push(point + size);
    south && south[col] > val && points.push(point - size);
    cRow[col + 1] && cRow[col + 1] > val && points.push(point + 1);
    cRow[col - 1] && cRow[col - 1] > val && points.push(point - 1);

    return points;
};

/**
 * Return the maximum distance and the steepest drop
 * based on a list of maximum lengths found on each
 * iteration over the minimum points.
 * @param {!Array<!Object>} maxLengths
 * @returns {!Object}
 */
const getMaxDistanceAndStep = (maxLengths) => {
    return maxLengths.reduce(({
        maxLen,
        drop
    }, maxFound) => {
        return (maxLen >= maxFound.maxLen && drop > maxFound.drop) ? {
            maxLen,
            drop
        } : maxFound;
    })
};

/**
 * Retruns the row and the column based on a mapped
 * index on the matrix.
 * @param {number} index 
 * @param {number} size 
 * @returns {!Object}
 */
const mapCoords = (index, size) => {
    const row = (Math.ceil((index + 1) / size)) - 1;
    const col = index - row * size;

    return {
        row,
        col
    };
}

/**
 * Gets the lowest points in the map and returns them
 * in a mapped indexed version of the map 2D matrix.
 * @param {!Array<Array<number>>} M Matrix map
 * @returns {!Array<number>}
 */
const getLowestMapPoints = (M) => {
    const size = M.length;
    const points = new Set();
    let r = 0;
    let i = 0;

    for (const row of M) {
        let c = 0;

        for (const point of row) {
            M[r - 1] && M[r - 1][c] - point < 0 && points.add(i - size);
            M[r + 1] && M[r + 1][c] - point < 0 && points.add(i + size);
            M[r][c - 1] && M[r][c - 1] - point < 0 && points.add(i - 1);
            M[r][c + 1] && M[r][c + 1] - point < 0 && points.add(i + 1);
            c++;
            i++;
        }
        r++;
    }
    return points;
};
