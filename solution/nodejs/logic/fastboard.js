/**
 * Created by ptaykalo on 8/8/15.
 */


exports.isCellFilledAtBoard = function (board, x, y) {
    return board.filled.some(function (cell) {
        return cell.x == x && cell.y == y;
    });
}