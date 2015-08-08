/**
 * Created by ptaykalo on 8/7/15.
 */
var Long = require("long");
var lcg = require('../logic/lcg');
var extend = require('util')._extend;
var transform = require("../logic/transformations");
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
        }
    };

    // Try to place
    return moveWithMovementFunction(result, "Place", function (cell) {
        return {x: cell.x, y: cell.y}
    }, null, function () {
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
            hashes: state.state.hashes
        }
    };

    return result;
};

var pointIsBlockedAtBoard = function (board, x, y) {
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


    var boardFilled = board.filled.reduce(function (prev, cell) {
        if (prev) {
            return prev;
        }
        return cell.x == x && cell.y == y;

    }, false);
    return boardFilled;
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
            var py = y;
            var px = x;
            var boardFilled = board.filled.some(function (cell) {
                return cell.x == px && cell.y == py;

            });
            if (!boardFilled) {
                should = false;
                break;
            }
        }
        if (should) {
            console.error("Adding line" + y);
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

    linesclearedAt.forEach(function (line) {
        // remove all items in the board
        updatedBoard.filled = updatedBoard.filled
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


    var result = {
        board: updatedBoard,
        state: {
            state: "ok",
            unit: state.state.unit,
            score: state.state.score + move_score,
            seed: state.state.seed,
            ls_old: linesclearedAt.length,
            hashes: state.state.hashes,
        }
    };

    return result;
};


var moveWithMovementFunction = function (state, name, movePoint, moveUnit, failure) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    // get active unit
    var unit = state.state.unit;
    var pivot = unit.pivot;
    // simple -1 for all X

    console.log("Unit.memers" + unit.members);
    var canMoveInDirection = unit.members.reduce(function (prev, cell) {
        if (!prev) {
            return false;
        }
        var nextCell = movePoint(cell, pivot);

        if (pointIsBlockedAtBoard(state.board, nextCell.x, nextCell.y)) {
            console.error(" Board is filled at " + nextCell.x + "," + nextCell.y + "sattBoard " + state.board.width);
            return false;
        }
        return true
    }, true);

    console.error(" Can movePoint " + name + " ? " + canMoveInDirection);
    if (canMoveInDirection) {

        // update all points with move point
        // update pivot with move point
        var updatedUnit = extend({}, unit);
        updatedUnit.members = unit.members.map(function (mem) {
            return movePoint(mem, unit.pivot)
        });
        updatedUnit.pivot = movePoint(unit.pivot, unit.pivot);

        //check next hash
        //console.error("Original unit : " + JSON.stringify(unit))
        //console.error("Original unit hash: " + JSON.stringify(exports.unitHash(unit)))
        //console.error("Next unit : " + JSON.stringify(updatedUnit))
        var updatedUnitHash = exports.unitHash(updatedUnit);

        //console.error("Next unit hash: " + JSON.stringify(updatedUnitHash))
        if (exports.unitHashIsInHashes(updatedUnitHash, state.state.hashes)) {
            return {
                board: state.board,
                state: {
                    state: "BOOM!",
                    message: "Yo have returned to the same state!"
                }
            }
        }


        var nextUnit = moveUnit ? moveUnit(unit) : updatedUnit;
        var nextHashes = state.state.hashes.splice(0);
        if (nextUnit.pivot.y != unit.pivot.y) {
            nextHashes = []
        }
        nextHashes.push(updatedUnitHash);

        return {
            board: state.board,
            state: {
                state: "ok",
                unit: nextUnit,
                score: state.state.score,
                seed: state.state.seed,
                ls_old: state.state.ls_old,
                hashes: nextHashes,
            }
        };
    } else {
        if (failure) {
            return failure();
        }
        var nextState = exports.lockUnit(state);
        nextState = exports.removeAllLines(nextState);
        nextState = exports.getNextUnit(nextState);
        nextState = exports.placeUnitOnTop(nextState, nextState.state.unit);
        return nextState;
    }
};


exports.moveLeft = function (state) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    return moveWithMovementFunction(state, "Left", function (cell, pivot) {
        return {x: cell.x - 1, y: cell.y}
    });
};


exports.moveRight = function (state) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    return moveWithMovementFunction(state, "Right", function (cell) {
        return {x: cell.x + 1, y: cell.y}
    });
};

exports.moveDownLeft = function (state) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    return moveWithMovementFunction(state, "DownLeft", function (cell) {
        return {x: cell.x - (cell.y % 2 == 0 ? 1 : 0), y: cell.y + 1}
    });
};

exports.moveDownRight = function (state) {
    if (exports.stateIsFinished(state)) {
        return state;
    }

    return moveWithMovementFunction(state, "DownRight", function (cell) {
        return {x: cell.x + (cell.y % 2 == 0 ? 0 : 1), y: cell.y + 1}
    });
};

exports.rotateC = function (state) {
    if (exports.stateIsFinished(state)) {
        return state;
    }


    var movePointFunction = function (cell, pivot) {
        return transform.rotateRight(cell, pivot);
    };

    return moveWithMovementFunction(state, "rotateC", movePointFunction);

};

exports.rotateCC = function (state) {
    if (exports.stateIsFinished(state)) {
        return state;
    }
    var movePointFunction = function (cell, pivot) {

        return transform.rotateLeft(cell, pivot);
    };

    return moveWithMovementFunction(state, "rotateCC", movePointFunction);

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
    updatedBoard.filled = state.board.filled.slice();

    var unit = state.state.unit;

    unit.members.forEach(function (cell) {
        var x = cell.x;
        var y = cell.y;
        if (!updatedBoard.filled.some(function (filledCell) {
                return filledCell.x == x && filledCell.y == y;
            })) {
            updatedBoard.filled.push({x: x, y: y});
        }
    });

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
    console.error(state.sequence);

    if (state.sequence.length == 0) {
        console.log("Command sequence is empty");
        return state;
    }

    var sequence = state.sequence;
    var history = "";

    for (var i = 0; i < sequence.length; i++) {
        var c = sequence[i];
        console.log("Sequence execution. Current command: " + c);

        console.error(state.state.state);

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
