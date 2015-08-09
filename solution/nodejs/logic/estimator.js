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
    var scoreCoef = 100.0;
    var itemsLeft = state.board.sourceLength ? state.board.sourceLength : 0;
    var itemsLeftCoef = 5;
    var holesCoef = 0;
    var linesCoef = 1;
    var filledSum = 0;

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
                filledSum += ((y * y * y) + (Math.abs(state.board.width / 2 - x) / state.board.width));
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
    base += filledSum;

    return {
        value: base,
        score: score * scoreCoef,
        holes: holesSum * holesCoef,
        lines: linesSum * linesCoef,
        items: itemsLeft * itemsLeftCoef,
        filled: filledSum
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
    var unit = state.state.unit;

    var updatedUnits =
        [1, 2, 3, 4, 5].reduce(function (units, nubmer) {
            //  rotate
            var lastUnit = units[units.length - 1];
            var rotatedUnit = extend({}, lastUnit);
            rotatedUnit.members = lastUnit.members.map(function (mem) {
                return transformations.rotateLeft(mem, unit.pivot)
            });
            rotatedUnit.rot = lastUnit.rot ? (lastUnit.rot - 1 + 6) % 6 : 5;
            units.push(rotatedUnit);
            return units;
        }, [unit]);
    //var updatedUnits = [unit];

    var hashes = [];
    updatedUnits = updatedUnits.filter(function (unit) {
        var hash = brain.unitHash(unit);
        if (brain.unitHashIsInHashes(hash, hashes)) {
            return false;
        }
        hashes.push(hash);
        return true;
    });

    updatedUnits.map(function (currUnit) {
        var st = extend({}, state.state);
        st.unit = currUnit;
        return {
            board: state.board,
            state: st
        }
    })
        .forEach(function (state) {

            for (var y = 0; y < state.board.height; y++) {
                for (var x = 0; x < state.board.width; x++) {
                    // place and lock item at specified position

                    var stateAfterPlacing = placeItemAtPositionInState(state, x, y);

                    if (stateAfterPlacing) {
                        stateAfterPlacing = brain.lockUnit(stateAfterPlacing);
                        stateAfterPlacing = brain.removeAllLines(stateAfterPlacing);
                        var estimation = exports.estimatePosition(stateAfterPlacing);
                        estimations.push({x: x, y: y, est: estimation, unit: stateAfterPlacing.state.unit});

                        if (estimations.length > 50) {
                            estimations = estimations.sort(function (est1, est2) {
                                return est2.est.value - est1.est.value;
                            });
                            estimations = estimations.slice(0, 100);
                        }
                    }
                }
            }

        })
    estimations = estimations.sort(function (est1, est2) {
        return est2.est.value - est1.est.value;
    });
    estimations = estimations.slice(0, 10);

    return estimations;

}