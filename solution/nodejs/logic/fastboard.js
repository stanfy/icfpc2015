/**
 * Created by ptaykalo on 8/8/15.
 */


exports.isCellFilledAtBoard = function (board, x, y) {
    if (x < 0) {
        //console.error("  X < 0 " + x);
        return true;
    }
    if (x >= board.width) {
        //console.error("  X >= " + x + "sattBoard " + board.width);
        return true;
    }
    if (y < 0) {
        //console.error("  Y < 0 " + y);
        return true;
    }
    if (y >= board.height) {
        //console.error("  Y >= " + y + "sattBoard " + board.height);
        return true;
    }
    return board.filledOpt[y * 1000 + x];
    //return board.filled.some(function (cell) {
    //    return cell.x == x && cell.y == y;
    //});
}


/*
 This one mutates board, so be careful
 it created new filled array, but board remains the same
 */
exports.removeLinesMutator = function (board, linesArray) {
    linesArray.forEach(function (line) {
        // remove all items in the board

        board.filledOpt =
            Object.keys(board.filledOpt)
                .filter(function (num) {
                    return (num / 1000 >>> 0) != line
                })
                .map(function (cell) {
                    if (((cell / 1000 ) >>> 0) > line) {
                        return cell;
                    } else {
                        return Number(cell) + 1000.0;
                    }
                })
                .reduce(function (dict, curr) {
                    dict[curr] = true;
                    return dict;
                }, {});
    });
    return board;
}

/*
 This one mutates board, so be careful
 it creates new filled array, but board remains the same
 */
exports.lockUnitAtBoardMutator = function (brd, unit) {
    var board = brd;
    //board.filled = board.filled.slice();

    var nextFilledOpt = {};
    for (var p in board.filledOpt) {
        nextFilledOpt[p] = true
    }
    board.filledOpt = nextFilledOpt

    unit.members.forEach(function (cell) {
        board.filledOpt[cell.y * 1000 + cell.x] = true;
    });
    return board;
}