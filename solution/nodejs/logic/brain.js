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
    var unit = state.board.units[value % state.board.units.length];

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

var moveWithMovementFunction = function (state, name, movePoint, moveUnit) {
    // get active unit
    var unit = state.state.unit;
    var origin = state.state.unitOrigin;
    var pivot = unit.pivot;
    // simple -1 for all X

    console.log("Unit.memers" + unit.members)
    var canMoveInDirection = unit.members.reduce(function (prev, cell) {
        if (!prev) {
            return false;
        }
        var nextCell = movePoint(cell, origin, pivot);

        if (pointIsBlockedAtBoard(state.board, nextCell.x, nextCell.y)) {
            console.error(" Board is filled at " + nextCell.x + "," + nextCell.y + "sattBoard " + state.board.width);
            return false;
        }
        return true
    }, true);

    console.error(" Can movePoint " + name + " ? " + canMoveInDirection);
    if (canMoveInDirection) {
        var nextOrigin = moveUnit ? origin : movePoint({x: 0, y: 0}, origin, pivot);
        var nextUnit = moveUnit ? moveUnit(unit) : unit;
        return {
            board: state.board,
            state: {
                state: "ok",
                unit: nextUnit,
                unitOrigin: nextOrigin,
                score: state.score,
                seed: state.seed
            }
        };
    } else {
        // TODO : Handle ncorrrect movements
        return state;
    }
};


exports.moveLeft = function (state) {
    return moveWithMovementFunction(state, "Left", function (cell, origin) {
        return {x: origin.x + cell.x - 1, y: origin.y + cell.y}
    });
};


exports.moveRight = function (state) {
    return moveWithMovementFunction(state, "Right", function (cell, origin) {
        return {x: origin.x + cell.x + 1, y: origin.y + cell.y}
    });
};

exports.moveDownLeft = function (state) {
    return moveWithMovementFunction(state, "DownLeft", function (cell, origin) {
        return {x: origin.x + cell.x - ((origin.y + cell.y) % 2 == 0 ? 1 : 0), y: origin.y + cell.y + 1}
    });
};

exports.moveDownRight = function (state) {
    return moveWithMovementFunction(state, "DownLeft", function (cell, origin) {
        return {x: origin.x + cell.x + ((origin.y + cell.y) % 2 == 0 ? 0 : 1), y: origin.y + cell.y + 1}
    });
};

exports.rotateC = function (state) {

    var movePointFunction = function (cell, origin, pivot) {

        var CX = cell.x + origin.x + (origin.y % 2 == 0 ? 0 : (cell.y % 2 == 1 ? 1 : 0))
        var CY = cell.y + origin.y;

        var cxx = CX - (CY - CY & 1) / 2;
        var czz = CY;
        var cyy = -cxx - czz;

        var PX = pivot.x + origin.x + (origin.y % 2 == 0 ? 0 : (pivot.y % 2 == 1 ? 1 : 0))
        var PY = pivot.y + origin.y;

        var pxx = PX - (PY - PY & 1) / 2;
        var pzz = PY;
        var pyy = -pxx - pzz;

        // Moving cell to pivot

        cxx = cxx - pxx;
        cyy = cyy - pyy;
        czz = czz - pzz;

        // Rotating Cxx
        var cxx1 = -czz;
        var cyy1 = -cxx;
        var czz1 = -cyy;

        // moving cxx back from pivot

        cxx1 = cxx1 + pxx;
        cyy1 = cyy1 + pyy;
        czz1 = czz1 + pzz;

        var X1 = cxx1 + (czz1 - czz1 & 1) / 2;
        var Y1 = czz1;

        return {x: X1, y: Y1};
    };

    return moveWithMovementFunction(state, "rotateC", movePointFunction, function (unit) {
        return {
            pivot: unit.pivot,
            members: unit.members.map(function (cell) {
                return movePointFunction(cell, {x: 0, y: 0}, unit.pivot);
            })
        };
    });

};

exports.rotateCC = function (state) {
    return state;
};

/*
 Locks unit at current positiong
 */
exports.lockUnit = function (state) {
    if (!state.state.unit) {
        return {
            board: state.board,
            state: {
                state: "error",
                message: "State should contain unit to lock"
            }
        }
    }
    var updatedBoard = Object.create(state.board);
    updatedBoard.filled = state.board.filled.slice();

    var unit = state.state.unit;
    var origin = state.state.unitOrigin;

    state.state.unit.members.forEach(function (cell) {
        var x = cell.x + origin.x + (origin.y % 2 == 0 ? 0 : (cell.y % 2 == 1 ? 1 : 0));
        var y = cell.y + origin.y;
        if (!state.board.filled.some(function (filledCell) {
                return filledCell.x == x && filledCell.y == y;
            })) {
            updatedBoard.filled.push({x: x, y: y});
        }
    });

    return {
        board: updatedBoard,
        state: {
            state: "locked",
            score: state.score,
            seed: state.seed
        }
    }
};
