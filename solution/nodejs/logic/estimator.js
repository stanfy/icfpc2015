/**
 * Created by ptaykalo on 8/8/15.
 */

var fastboard = require('./fastboard');
var brain = require('./brain');
var transformations = require('./transformations');
var extend = require('util')._extend;


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

// Check best place
exports.findBestPositionsForCurrentState = function (state) {
    if (brain.stateIsFinished(state)) {
        return [];
    }
    // resolving current unit and trying to place it somewhere

    function placeItemAtPositionInState(state, x, y) {
        var updatedUnit = transformations.moveUnitAt(state.state.unit, x, y);
        // check if we can put it here in theory, everything is okay
        if (updatedUnit.members.some(function (cell) {
                return fastboard.isCellFilledAtBoard(state.board, cell.x, cell.y)
            })) {
            return null;
        }

        // updateing state
        var st = extend({}, state.state);
        st.unit = updatedUnit;
        return {
            board: state.board,
            state: st
        }
    }

    var estimations = [];

    for (var y = 0; y < state.board.height; y++) {
        for (var x = 0; x < state.board.width; x++) {
            // place and lock item at specified position
            var stateAfterPlacing = placeItemAtPositionInState(state, x, y);
            if (stateAfterPlacing) {
                stateAfterPlacing = brain.lockUnit(stateAfterPlacing);
                stateAfterPlacing = brain.removeAllLines(stateAfterPlacing);
                var estimation = exports.estimatePosition(stateAfterPlacing);
                estimations.push({x: x, y: y, est: estimation, unit:stateAfterPlacing.state.unit});

                if (estimations.length > 50) {
                    estimations = estimations.sort(function (est1, est2) {
                        return est2.est.value - est1.est.value;
                    });
                    estimations = estimations.slice(0, 10);
                }
            }

        }
    }

    return estimations;

}