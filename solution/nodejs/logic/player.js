var brain = require('./brain');

exports.initializeAllBoardsFromJson = function (json) {

    var seeds = json.sourceSeeds;
    var board = json;

    seeds.forEach(function (seed) {
        console.error(board + "---");
        var state = brain.initTransform(board, seed);
        console.error(board + "---");
    })
}


exports.initializeOneBoard = function (board, seed) {
    console.error(board + "---");
    var state = brain.initTransform(board, seed);
    console.error(board + "---");
    return state;
}


exports.nextState = function (state, params) {
    // Skip everyting,if current state is not ok
    if (state.state.state != "ok") {
        res.json(state);
        console.error("Skipping since previous state is not OK " + state.state.state);
        return;
    }

    //move [ E | W | SE | SW | C | CC]
    //Move all members of the unit one cell in the given direction.
    //    turn [ clockwise | counter-clockwise ]
    var nextState = state;
    if (params.command == "W") {
        // Move left
        nextState = brain.moveLeft(state);
    } else if (params.command == "E") {
        nextState = brain.moveRight(state);

    } else if (params.command == "SW") {
        nextState = brain.moveDownLeft(state);

    } else if (params.command == "SE") {
        nextState = brain.moveDownRight(state);

    } else if (params.command == "C") {
        nextState = brain.rotateC(state);

    } else if (params.command == "CC") {
        nextState = brain.rotateCC(state);
    } else if (params.command == "SEQUENCE") {
        nextState = brain.performSequence(state);
    }
    return nextState;
}