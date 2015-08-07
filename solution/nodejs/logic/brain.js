/**
 * Created by ptaykalo on 8/7/15.
 */
var Long = require("long");
var lcg = require('../logic/lcg');


exports.initTransform = function (board) {
    if (!board) {
        return {
            state: {
                state: "error",
                message: "Board must be specified"
            }
        }
    }

    if (!board.sourceSeeds || board.sourceSeeds.length == 0) {
        return {
            state: {
                state: "error",
                message: "sourceSeeds are required"
            }
        }
    }

    return {
        board: board,
        state: {
            state: "ok",
            unit: board.units[0],
            score: 0,
            unitIndex: 0,
            seed: 0
        }
    }
}
/** Simply puts unit on the board, centering
 * Doesn't peform any checks on it
 * */
exports.placeUnitOnTop = function (state, unit) {

    // get rightmost item of unit
    var maxX = unit.members.reduce(function (prev, curr) {
        return curr.x > prev.x ? curr : prev;
    }).x;

    var emptySpace = (state.board.width - (maxX + 1));
    var unitOrigin = {
        x: (emptySpace / 2 | 0), // Integer division :)
        y: 0
    };
    var result = {
        board: state.board,
        state: {
            state: "ok",
            unit: unit,
            unitOrigin: unitOrigin,
            score: 0,
            unitIndex: 0,
            seed: 0
        }
    };

    return result;
}


/*
Returns state with next unit
 */
exports.getNextUnit = function (state) {

    var seedL = new Long(state.state.seed);
    var lcgValue = lcg.lcgValue(seedL);
    var nexSeed = lcgValue.seed;
    var value = lcgValue.value;
    var unit = state.board.units[value % state.board.units];

    var result = {
        board: state.board,
        state: {
            state: "waiting for placing figure",
            unit: unit,
            score: state.score,
            seed: nexSeed
        }
    };

    return result;
}

