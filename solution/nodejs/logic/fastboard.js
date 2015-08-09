/**
 * Created by ptaykalo on 8/8/15.
 */


exports.isCellFilledAtBoard = function (board, x, y) {
    if (x < 0) {
        console.error("  X < 0 " + x);
        return true;
    }
    if (x >= board.width) {
        console.error("  X >= " + x + "sattBoard " + board.width);
        return true;
    }
    if (y < 0) {
        console.error("  Y < 0 " + y);
        return true;
    }
    if (y >= board.height) {
        console.error("  Y >= " + y + "sattBoard " + board.height);
        return true;
    }
    return board.filled.some(function (cell) {
        return cell.x == x && cell.y == y;
    });
}


/*
 This one mutates board, so be careful
 it created new filled array, but board remains the same
 */
exports.removeLinesMutator = function (board, linesArray) {
    linesArray.forEach(function (line) {
        // remove all items in the board
        board.filled = board.filled
            .filter(function (cell) {
                return cell.y != line;
            })
            .map(function (cell) {
                if (cell.y > line) {
                    return cell;
                }
                else
                    return {x: cell.x, y: cell.y + 1};
            });
    });
    return board;
}

/*
 This one mutates board, so be careful
 it creates new filled array, but board remains the same
 */
exports.lockUnitAtBoardMutator = function (brd, unit) {
    var board = brd;
    board.filled = board.filled.slice();
    unit.members.forEach(function (cell) {
        var x = cell.x;
        var y = cell.y;
        if (!board.filled.some(function (filledCell) {
                return filledCell.x == x && filledCell.y == y;
            })) {
            board.filled.push({x: x, y: y});
        }
    });
    return board;
}