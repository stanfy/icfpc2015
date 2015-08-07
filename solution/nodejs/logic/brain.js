/**
 * Created by ptaykalo on 8/7/15.
 */
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
};

var s = {
    "height": 10,
    "width": 10,
    "sourceSeeds": [0],
    "units": [{"members": [{"x": 0, "y": 0}], "pivot": {"x": 0, "y": 0}}, {
        "members": [{"x": 0, "y": 0}, {"x": 2, "y": 0}],
        "pivot": {"x": 1, "y": 0}
    }, {"members": [{"x": 0, "y": 0}, {"x": 0, "y": 2}], "pivot": {"x": 0, "y": 1}}, {
        "members": [{
            "x": 2,
            "y": 0
        }, {"x": 0, "y": 1}, {"x": 2, "y": 2}], "pivot": {"x": 1, "y": 1}
    }, {
        "members": [{"x": 0, "y": 0}, {"x": 1, "y": 1}, {"x": 0, "y": 2}],
        "pivot": {"x": 0, "y": 1}
    }, {"members": [{"x": 0, "y": 0}, {"x": 1, "y": 0}], "pivot": {"x": 0, "y": 0}}, {
        "members": [{
            "x": 0,
            "y": 0
        }, {"x": 1, "y": 0}], "pivot": {"x": 1, "y": 0}
    }, {"members": [{"x": 0, "y": 0}, {"x": 0, "y": 1}], "pivot": {"x": 0, "y": 0}}, {
        "members": [{
            "x": 0,
            "y": 0
        }, {"x": 0, "y": 1}], "pivot": {"x": 0, "y": 1}
    }, {
        "members": [{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}],
        "pivot": {"x": 0, "y": 0}
    }, {
        "members": [{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}],
        "pivot": {"x": 1, "y": 0}
    }, {
        "members": [{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}],
        "pivot": {"x": 2, "y": 0}
    }, {
        "members": [{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
        "pivot": {"x": 0, "y": 0}
    }, {
        "members": [{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
        "pivot": {"x": 0, "y": 1}
    }, {
        "members": [{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
        "pivot": {"x": 0, "y": 2}
    }, {
        "members": [{"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 2}],
        "pivot": {"x": 1, "y": 0}
    }, {
        "members": [{"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 2}],
        "pivot": {"x": 1, "y": 1}
    }, {"members": [{"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 2}], "pivot": {"x": 1, "y": 2}}],
    "id": 0,
    "filled": [],
    "sourceLength": 100
}