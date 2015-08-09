/**
 * Created by ptaykalo on 8/7/15.
 */
var Long = require("long");
var lcg = require('../logic/lcg');
var extend = require('util')._extend;
var transform = require("../logic/transformations");
var estimator = require("../logic/estimator");
var fastboard = require("../logic/fastboard");

exports.stateIsFinished = function (state) {
    return state && state.state && state.state.state == "finished" || state.state.state == "error";
};

exports.initTransform = function (board, seed) {
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

    board.filledOpt = board.filled.reduce(function (dict, cell) {
        dict[cell.y * 1000 + cell.x] = true;
        return dict;
    }, {});

    var initialState = {
        board: board,
        state: {
            state: "ok",
            score: 0,
            seed: seed
        }
    };
    initialState = exports.getNextUnit(initialState);
    initialState = exports.placeUnitOnTop(initialState, initialState.state.unit);
    return initialState
};

exports.unitHash = function (unit) {
    return unit.members.reduce(function (cur, char) {
        var key = (((char.x >>> 0) << 16) + char.y);
        cur[key] = true;
        return cur;
    }, {})
};

exports.unitHashIsInHashes = function (hash, hashes) {
    return hashes.some(function (hs) {
        for (var k in hash) {
            if (!hs[k]) {
                return false;
            }
        }
        return true;
    });
};

exports.unitsAreEqual = function (unit1, unit2) {
    return unit1.pivot.x == unit2.pivot.x &&
        unit1.pivot.y == unit2.pivot.y &&
        ((unit1.rot ? unit1.rot : 0) == (unit2.rot ? unit2.rot : 0);
};

/** Simply puts unit on the board, centering
 * Doesn't peform any checks on it
 * */
exports.placeUnitOnTop = function (state, unit) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    // get rightmost item of unit
    var maxX = unit.members.reduce(function (prev, curr) {
        return curr.x > prev.x ? curr : prev;
    }).x;

    var emptySpace = (state.board.width - (maxX + 1));
    var updatedUnit = extend({}, unit);
    updatedUnit.members = unit.members.map(function (mem) {
        return {x: mem.x + (emptySpace / 2 | 0), y: mem.y};
    });
    updatedUnit.pivot = {x: unit.pivot.x + (emptySpace / 2 | 0), y: unit.pivot.y}

    // check ig unit can be placed
    var hashes = [];
    var result = {
        board: state.board,
        state: {
            state: "ok",
            unit: updatedUnit,
            score: state.state.score,
            seed: state.state.seed,
            ls_old: state.state.ls_old,
            hashes: hashes,
            estimation: state.state.estimation,
        }
    };

    // Try to place
    return moveWithMovementFunction(result, "Place", function (cell) {
        return {x: cell.x, y: cell.y}
    }, function () {
        return {
            board: state.board,
            state: {
                state: "finished",
                message: "Cannot place new item",
                score: state.state.score
            }
        };
    });
};


/*
 Returns state with next unit
 */
exports.getNextUnit = function (state) {

    if (exports.stateIsFinished(state)) {
        return state;
    }
    if (state.board.sourceLength == 0) {
        return {
            board: state.board,
            state: {
                state: "finished",
                message: "No more figures in source",
                score: state.state.score
            }
        };
    }

    var seedL = new Long(state.state.seed);
    var lcgValue = lcg.lcgValue(seedL);
    var nexSeed = lcgValue.seed;
    var value = lcgValue.value;
    var unit = state.board.units[value % state.board.units.length];
    var updatedBoard = extend({}, state.board);
    updatedBoard.sourceLength = updatedBoard.sourceLength - 1;

    var result = {
        board: updatedBoard,
        state: {
            state: "waiting for placing figure",
            unit: unit,
            score: state.state.score,
            seed: nexSeed,
            ls_old: state.state.ls_old,
            hashes: state.state.hashes,
            estimation: state.state.estimation,

        }
    };

    return result;
};

var pointIsBlockedAtBoard = function (board, x, y) {
    return fastboard.isCellFilledAtBoard(board,x,y);
};


exports.removeAllLines = function (state) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    // find the line
    var linesclearedAt = [];
    var board = state.board;
    for (var y = 0; y < board.height; y++) {
        // if we have all filled items here
        var should = true;
        for (var x = 0; x < board.width; x++) {
            if (!fastboard.isCellFilledAtBoard(board,x,y)) {
                should = false;
                break;
            }
        }
        if (should) {
            //console.error("Adding line" + y);
            linesclearedAt.push(y);
        }
    }
    var size = state.state.unit.members.length;

    var ls = linesclearedAt.length;
    var points = size + 100 * (1 + ls) * ls / 2;
    var line_bonus = 0;
    var lsOld = state.state.ls_old;
    if (lsOld > 1) {
        line_bonus = Math.floor((lsOld - 1) * points / 10);
    }
    var move_score = points + line_bonus;
    // Starting from the top
    var updatedBoard = extend({}, state.board);

    updatedBoard = fastboard.removeLinesMutator(updatedBoard, linesclearedAt);

    var result = {
        board: updatedBoard,
        state: {
            state: "ok",
            unit: state.state.unit,
            score: state.state.score + move_score,
            seed: state.state.seed,
            ls_old: linesclearedAt.length,
            hashes: state.state.hashes,
            estimation: state.state.estimation,

        }
    };

    return result;
};


var moveWithMovementFunction = function (state, name, movePoint, failure, unitUpdate) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    // get active unit
    var unit = state.state.unit;
    var pivot = unit.pivot;
    //console.log("Unit.memers" + JSON.stringify(unit.members));

    var canMoveInDirection = unit.members.reduce(function (prev, cell) {
        if (!prev) {
            return false;
        }
        var nextCell = movePoint(cell, pivot);

        if (pointIsBlockedAtBoard(state.board, nextCell.x, nextCell.y)) {
            //console.error(" Board is filled at " + nextCell.x + "," + nextCell.y + "sattBoard " + state.board.width);
            return false;
        }
        return true
    }, true);

    //console.error(" Can movePoint " + name + " ? " + canMoveInDirection);
    if (canMoveInDirection) {

        // update all points with move point
        // update pivot with move point
        var updatedUnit = extend({}, unit);
        updatedUnit.members = unit.members.map(function (mem) {
            return movePoint(mem, unit.pivot)
        });
        updatedUnit.pivot = movePoint(unit.pivot, unit.pivot);
        if (unitUpdate) {
            unitUpdate(updatedUnit);
        }

        //check next hash
        ////console.error("Original unit : " + JSON.stringify(unit))
        ////console.error("Original unit hash: " + JSON.stringify(exports.unitHash(unit)))
        ////console.error("Next unit : " + JSON.stringify(updatedUnit))
        var updatedUnitHash = exports.unitHash(updatedUnit);

        ////console.error("Next unit hash: " + JSON.stringify(updatedUnitHash))
        if (exports.unitHashIsInHashes(updatedUnitHash, state.state.hashes)) {
            return {
                board: state.board,
                state: {
                    state: "BOOM!",
                    message: "Yo have returned to the same state!"
                }
            }
        }

        var nextUnit = updatedUnit;
        var nextHashes = state.state.hashes.splice(0);
        if (nextUnit.pivot.y != unit.pivot.y) {
            nextHashes = []
        }
        nextHashes.push(updatedUnitHash);

        var result = {
            board: state.board,
            state: {
                state: "ok",
                unit: nextUnit,
                score: state.state.score,
                seed: state.state.seed,
                ls_old: state.state.ls_old,
                hashes: nextHashes,
                estimation: state.state.estimation
            }
        };
        result.state.estimation = JSON.stringify(estimator.estimatePosition(result));
        return result;
    } else {
        if (failure) {
            return failure();
        }
        var nextState = exports.lockUnit(state);
        nextState = exports.removeAllLines(nextState);
        nextState = exports.getNextUnit(nextState);
        nextState = exports.placeUnitOnTop(nextState, nextState.state.unit);

        // Estimate this one
        //TODO : ESTIMATOR IS HERE
        //var value = estimator.findBestPositionsForCurrentState(nextState);
        //console.error("Best items are : " + JSON.stringify(value));
        //if (nextState && nextState.state) {
        //    nextState.state.estimatedPositions = value;
        //}
        return nextState;
    }
};


exports.moveLeft = function (state, failure) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    return moveWithMovementFunction(state, "Left", function (cell) {
        return {x: cell.x - 1, y: cell.y}
    }, failure);
};


exports.moveRight = function (state, failure) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    return moveWithMovementFunction(state, "Right", function (cell) {
        return {x: cell.x + 1, y: cell.y}
    }, failure);
};

exports.moveDownLeft = function (state, failure) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    return moveWithMovementFunction(state, "DownLeft", function (cell) {
        return {x: cell.x - (cell.y % 2 == 0 ? 1 : 0), y: cell.y + 1};
    }, failure);
};

exports.moveDownRight = function (state, failure) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    return moveWithMovementFunction(state, "DownRight", function (cell) {
            return {x: cell.x + (cell.y % 2 == 0 ? 0 : 1), y: cell.y + 1}
        },
        failure);
};

exports.rotateC = function (state, failure) {
    if (exports.stateIsFinished(state)) {
        return state;
    }


    var movePointFunction = function (cell, pivot) {
        return transform.rotateRight(cell, pivot);
    };

    var unitUpdate = function (unit) {
        // + 1
        unit.rot = unit.rot ? (unit.rot + 1) % 6 : 1;
    };
    return moveWithMovementFunction(state, "rotateC", movePointFunction, failure, unitUpdate);

};

exports.rotateCC = function (state, failure) {
    if (exports.stateIsFinished(state)) {
        return state;
    }
    var movePointFunction = function (cell, pivot) {

        return transform.rotateLeft(cell, pivot);
    };

    var unitUpdate = function (unit) {
        // - 1
        unit.rot = unit.rot ? (unit.rot - 1 + 6) % 6 : 5;
    };
    return moveWithMovementFunction(state, "rotateCC", movePointFunction, failure, unitUpdate);

};

/*
 Locks unit at current positiong
 */
exports.lockUnit = function (state) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    if (!state.state.unit) {
        return {
            board: state.board,
            state: {
                state: "error",
                message: "State should contain unit to lock"
            }
        }
    }
    var updatedBoard = extend({}, state.board);
    var unit = state.state.unit;

    updatedBoard = fastboard.lockUnitAtBoardMutator(updatedBoard, unit);

    return {
        board: updatedBoard,
        state: {
            state: "locked",
            unit: unit,
            score: state.state.score,
            seed: state.state.seed
        }
    }
};

exports.performSequence = function (state) {
    //console.error(state.sequence);

    if (state.sequence.length == 0) {
        console.log("Command sequence is empty");
        return state;
    }

    var sequence = state.sequence;
    var history = "";

    for (var i = 0; i < sequence.length; i++) {
        var c = sequence[i];
        console.log("Sequence execution. Current command: " + c);

        //console.error(state.state.state);

        if (state.state.state != "ok") {
            state.commandHistory = history;
            return state;
        }

        if ("p'!.03".indexOf(c) >= 0) {/* move W    */
            state = exports.moveLeft(state);
            history += "W ";
        } else if ("bcefy2".indexOf(c) >= 0) {/* move E    */
            state = exports.moveRight(state);
            history += "E ";
        } else if ("aghij4".indexOf(c) >= 0) {/* move SW   */
            state = exports.moveDownLeft(state);
            history += "SW ";
        } else if ("lmno 5".indexOf(c) >= 0) {/* move SE   */
            state = exports.moveDownRight(state);
            history += "SE ";
        } else if ("dqrvz1".indexOf(c) >= 0) {/* rotate C  */
            state = exports.rotateC(state);
            history += "C ";
        } else if ("kstuwx".indexOf(c) >= 0) {/* rotate CC */
            state = exports.rotateCC(state);
            history += "CC ";
        }
    }

    state.commandHistory = history;
    return state;
};

var a = {
    "board": {
        "height": 20,
        "width": 30,
        "sourceSeeds": [0, 22837, 22837, 15215, 24851, 11460, 14027, 32620, 32719, 15577],
        "units": [{"members": [{"x": 0, "y": 0}, {"x": 2, "y": 0}], "pivot": {"x": 1, "y": 0}}, {
            "members": [{
                "x": 1,
                "y": 0
            }, {"x": 0, "y": 1}, {"x": 0, "y": 2}], "pivot": {"x": 0, "y": 1}
        }, {
            "members": [{"x": 2, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
            "pivot": {"x": 1, "y": 0}
        }, {
            "members": [{"x": 1, "y": 1}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
            "pivot": {"x": 0, "y": 0}
        }, {
            "members": [{"x": 2, "y": 0}, {"x": 1, "y": 1}, {"x": 1, "y": 2}, {"x": 0, "y": 3}],
            "pivot": {"x": 1, "y": 1}
        }, {
            "members": [{"x": 2, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
            "pivot": {"x": 1, "y": 1}
        }, {
            "members": [{"x": 1, "y": 1}, {"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
            "pivot": {"x": 0, "y": 1}
        }, {
            "members": [{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
            "pivot": {"x": 0, "y": 1}
        }, {
            "members": [{"x": 1, "y": 0}, {"x": 1, "y": 1}, {"x": 1, "y": 2}, {"x": 0, "y": 3}],
            "pivot": {"x": 0, "y": 1}
        }, {
            "members": [{"x": 2, "y": 0}, {"x": 1, "y": 1}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
            "pivot": {"x": 1, "y": 1}
        }, {
            "members": [{"x": 2, "y": 1}, {"x": 2, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
            "pivot": {"x": 1, "y": 0}
        }, {
            "members": [{"x": 1, "y": 1}, {"x": 2, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
            "pivot": {"x": 1, "y": 0}
        }, {
            "members": [{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 1}, {"x": 0, "y": 2}],
            "pivot": {"x": 0, "y": 1}
        }, {
            "members": [{"x": 0, "y": 1}, {"x": 1, "y": 1}, {"x": 3, "y": 0}, {"x": 2, "y": 0}],
            "pivot": {"x": 1, "y": 0}
        }],
        "id": 5,
        "filled": [{"x": 2, "y": 6}, {"x": 3, "y": 6}, {"x": 4, "y": 6}, {"x": 5, "y": 6}, {"x": 8, "y": 6}, {
            "x": 10,
            "y": 6
        }, {"x": 22, "y": 6}, {"x": 2, "y": 7}, {"x": 5, "y": 7}, {"x": 7, "y": 7}, {"x": 10, "y": 7}, {
            "x": 21,
            "y": 7
        }, {"x": 2, "y": 8}, {"x": 6, "y": 8}, {"x": 8, "y": 8}, {"x": 10, "y": 8}, {"x": 22, "y": 8}, {
            "x": 2,
            "y": 9
        }, {"x": 3, "y": 9}, {"x": 4, "y": 9}, {"x": 5, "y": 9}, {"x": 10, "y": 9}, {"x": 12, "y": 9}, {
            "x": 15,
            "y": 9
        }, {"x": 17, "y": 9}, {"x": 18, "y": 9}, {"x": 19, "y": 9}, {"x": 21, "y": 9}, {"x": 2, "y": 10}, {
            "x": 5,
            "y": 10
        }, {"x": 10, "y": 10}, {"x": 12, "y": 10}, {"x": 15, "y": 10}, {"x": 17, "y": 10}, {"x": 20, "y": 10}, {
            "x": 22,
            "y": 10
        }, {"x": 23, "y": 10}, {"x": 24, "y": 10}, {"x": 2, "y": 11}, {"x": 5, "y": 11}, {"x": 10, "y": 11}, {
            "x": 12,
            "y": 11
        }, {"x": 14, "y": 11}, {"x": 16, "y": 11}, {"x": 17, "y": 11}, {"x": 18, "y": 11}, {"x": 19, "y": 11}, {
            "x": 21,
            "y": 11
        }, {"x": 24, "y": 11}, {"x": 2, "y": 12}, {"x": 6, "y": 12}, {"x": 10, "y": 12}, {"x": 13, "y": 12}, {
            "x": 14,
            "y": 12
        }, {"x": 17, "y": 12}, {"x": 22, "y": 12}, {"x": 25, "y": 12}, {"x": 2, "y": 13}, {"x": 6, "y": 13}, {
            "x": 10,
            "y": 13
        }, {"x": 13, "y": 13}, {"x": 17, "y": 13}, {"x": 18, "y": 13}, {"x": 19, "y": 13}, {"x": 21, "y": 13}, {
            "x": 24,
            "y": 13
        }, {"x": 13, "y": 14}, {"x": 12, "y": 15}],
        "sourceLength": 100
    }
    ,
    "state": {
        "state": "ok", "unit": {
            "members": [{"x": 0, "y": 0}, {"x": 2, "y": 0}], "pivot": {
                "x": 1, "y": 0
            }
        }
        ,
        "unitOrigin": {
            "x": 19, "y": 6
        }
    }
}
