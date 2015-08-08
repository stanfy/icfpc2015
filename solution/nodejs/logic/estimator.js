/**
 * Created by ptaykalo on 8/8/15.
 */

var fastboard = require('./fastboard');

/*
 Estimates postition on the board by some coefficitend :
 Score, number of items left, holes, and lines
 */
exports.estimatePosition = function (state) {
    var boardSize = state.board.width * state.board.height;

    var score = state.state.score ? state.state.score : 0;
    var scoreCoef = 10.0;
    var itemsLeft = state.board.sourceLength ? state.board.sourceLength : 0;
    var itemsLeftCoef = 5;
    var holesCoef = 1;
    var linesCoef = 1;

    var holesSum = 0;
    var linesSum = 0;
    for (var y = 0; y < state.board.height; y++) {

        var currentLineLength = 0;
        var currentHoleLength = 0;

        for (var x = 0; x < state.board.width; x++) {

            // Check if

            if (fastboard.isCellFilledAtBoard(state.board, x, y)) {
                currentLineLength++;
                if (currentHoleLength != 0) {
                    holesSum += (-10 / currentHoleLength);
                    currentHoleLength = 0;
                }
            } else {
                currentHoleLength++;
                if (currentLineLength != 0) {
                    linesSum += currentLineLength * currentLineLength;
                    currentLineLength = 0;
                }
            }
        }

        if (currentHoleLength != 0) {
            holesSum += (-10 / currentHoleLength);
            currentHoleLength = 0;
        }

        if (currentLineLength != 0) {
            linesSum += currentLineLength * 1.8;
            currentLineLength = 0;
        }
    }

    var base = score * scoreCoef;
    base += holesSum * holesCoef;
    base += linesSum * linesCoef;
    base += itemsLeft * itemsLeftCoef;

    return {
        value: base,
        score: score * scoreCoef,
        holes: holesSum * holesCoef,
        lines: linesSum * linesCoef,
        items: itemsLeft * itemsLeftCoef
    };
}


exports.findBestPositionsForCurrentState = function (state) {
    // resolving current unit and trying to place it somewhere
}