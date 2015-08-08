var brain = require('./brain');


exports.initializeOneBoard = function (board, seed) {
    var state = brain.initTransform(board, seed);
    return state;
};


exports.nextState = function (state, params) {
    // Skip everyting,if current state is not ok
    if (state.state.state != "ok") {
        console.error("Skipping since previous state is not OK " + state.state.state);
        return null;
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
};