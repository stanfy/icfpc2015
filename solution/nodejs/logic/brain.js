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
        return false;
    }
    if (x >= board.width) {
        console.error("  X >= " + x + "sattBoard " + board.width);
        return false;
    }
    if (y < 0) {
        console.error("  Y < 0 " + y);
        return false;
    }
    if (y >= board.height) {
        console.error("  Y >= " + y + "sattBoard " + board.height);
        return false;
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
        var nextCell = movePoint(cell, origin,pivot);

        if (pointIsBlockedAtBoard(state.board, nextCell.x, nextCell.y)) {
            console.error(" Board is filled at " + nextCell.x + "," + nextCell.y + "sattBoard " + state.board.width);
            return false;
        }
        return true
    }, true);

    console.error(" Can movePoint " + name + " ? " + canMoveInDirection);
    if (canMoveInDirection) {
        var nextOrigin = moveUnit ? origin : movePoint({x:0,y:0}, origin, pivot);
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
}

exports.moveLeft = function (state) {
    return moveWithMovementFunction(state, "Left", function (cell, origin) {
        return {x: origin.x + cell.x - 1, y: origin.y + cell.y}
    });
};


exports.moveRight = function (state) {
    return moveWithMovementFunction(state, "Right", function (cell,origin) {
        return {x: origin.x + cell.x + 1, y: origin.y + cell.y}
    });
};

exports.moveDownLeft = function (state) {
    return moveWithMovementFunction(state, "DownLeft", function (cell,origin) {
        return {x: origin.x + cell.x - ((origin.y + cell.y) % 2 == 0 ? 1 : 0), y: origin.y + cell.y + 1}
    });
};

exports.moveDownRight = function (state) {
    return moveWithMovementFunction(state, "DownLeft", function (cell,origin) {
        return {x: origin.x +  cell.x + ((origin.y + cell.y) % 2 == 0 ? 0 : 1), y: origin.y + cell.y + 1}
    });
};

exports.rotateC = function (state) {

    var movePointFunction = function (cell, origin, pivot) {
        var X = cell.x - pivot.x;
        var Y = cell.y - pivot.y;

        var xx = X - (Y - Y & 1) / 2;
        var zz = Y;
        var yy = -xx - zz;

        var xx1 = -zz;
        var yy1 = -xx;
        var zz1 = -yy;

        var X1 = xx1 + (zz1 - zz1 & 1) / 2 + pivot.x;
        var Y1 = zz1 + pivot.y;

        
        return {x: origin.x + X1, y: origin.y + Y1};
    };

    return moveWithMovementFunction(state, "rotateC", movePointFunction, function (unit) {
        return {
            pivot: unit.pivot,
            members: unit.members.map(function (cell) {
                return movePointFunction(cell, {x: 0, y: 0}, unit.pivot);
            })
        };
    });

    //x = X - (Y - Y&1) / 2
    //zz = Y
    //yy = -xx - zz
    //return state;
};

exports.rotateCC = function (state) {
    return state;
};
