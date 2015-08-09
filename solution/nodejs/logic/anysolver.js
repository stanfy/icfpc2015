var player = require('./player');
var solution = require('./oneSolution');
var letterCommandInterpretator = require('./../public/js/letterCommandInterpretator');
var extend = require('util')._extend;
var estimator = require("../logic/estimator");
var fastboard = require("../logic/fastboard");
var astar = require("../logic/astar");


exports.solveBoardForAllSeeds = function (json, magicPhrases, partial_result) {
    var seeds = json.sourceSeeds;
    var board = json;

    var solutions = seeds.map(function (seed) {
        return solution.init(board.id, seed, "", 0)
    });

    var max_cycles = 10000;
    if (!partial_result) {
        max_cycles = 1;
    }
    while (max_cycles > 0) {
        var atLeastOneWasBetter = false;
        solutions = solutions.map(function (oldSolution) {
            var newSolution = solveBoard(board, oldSolution.seed, oldSolution.score);
            if (newSolution.score > oldSolution.score) {
                atLeastOneWasBetter = true;
                return newSolution;
            }
            return oldSolution;
        });

        if (partial_result && atLeastOneWasBetter) {
            partial_result(
                solutions.map(function (s) {
                    return solution.prepareJson(s);
                })
            );
        }
        max_cycles--;
    }
    return solutions.map(function (s) {
        return solution.prepareJson(s);
    });
};

/*
 Returns next state
 */
exports.makeNextMove = function (state) {
    console.error("MAkign next move");

    var value = estimator.findBestPositionsForCurrentState(state);
    console.error("Best items are : " + JSON.stringify(value));

    // Ask A-Star if we can go there
    //{x: x, y: y, est: estimation, unit: stateAfterPlacing.state.unit}
    //  echk if we can go there
    return value
        .map(function (estimatedPoint) {
            var mapStart = state;

            var endState = extend({}, state.state);
            endState.unit = estimatedPoint.unit;
            var mapEnd = {
                board: state.board,
                state: endState
            };
            var g = new astar.Graph(mapStart);
            var res = astar.astar.search(g, mapStart, mapEnd);
            var coms = res.map(function (command) {
                return command.step;
            });
            console.log("Commnds" + coms);

            var resultState = extend({}, state.state);
            resultState.estimatedPositions = value;
            resultState._nextCommands = coms;

            return {
                board: state.board,
                state: resultState
            };
        })
        .filter(function (state) {
            return state && state.state && state.state._nextCommands && state.state._nextCommands.length;
        });
}

exports.makeNextMoveAndLock = function (st) {
    console.error("MAkign next move");

    var value = estimator.findBestPositionsForCurrentState(st);

    // Try to get command
    var commands = null;

    var state = st;


    commands = value.reduce(function (old, estimatedPoint) {
        if (old) {
            return old;
        }
        var mapStart = state;

        var endState = extend({}, state.state);
        endState.unit = estimatedPoint.unit;
        var mapEnd = {
            board: state.board,
            state: endState
        };
        var g = new astar.Graph(mapStart);
        var res = astar.astar.search(g, mapStart, mapEnd);
        var coms = res.map(function (command) {
            return command.step;
        });
        console.log("Commnds" + coms);

        var resultState = extend({}, state.state);
        resultState.estimatedPositions = value;
        resultState._nextCommands = coms;

        var res = {
            board: state.board,
            state: resultState
        };
        if (res && res.state && res.state._nextCommands && res.state._nextCommands.length) {
            return res.state._nextCommands;
        }
        return old;
    }, null);

    if (commands) {
        var finalState = commands.reduce(function (st, command) {
            return player.nextState(st, {"command": command});
        }, state);

        finalState.state._nextCommands = commands;
        finalState.state._commandsToReachThisState = (state.state._commandsToReachThisState ? state.state._commandsToReachThisState : []).concat(commands);

        console.error("Returnint state" + finalState + "Commands" + commands);

        return finalState;
    }

    // What to do here if we weren't able to reach it ?

    // Try harde or just exit? for now - lets' finish an return
    return state;

}


var solveBoard = function (board, seed) {
    var state = player.initializeOneBoard(board, seed);
    var commands = [];
    var lastState = state;
    var score = state.state.score;

    while (state) {
        // generate state

        //
        var alreadyUsedCommands = [];
        var possibleCommand = generateNextCommand(board, seed, alreadyUsedCommands);
        var possibleState = player.nextState(state, {"command": possibleCommand});

        // if state is error - try another command
        var stateAfterCommand = possibleState ? possibleState.state.state : null;

        if (!possibleState
            || stateAfterCommand == "BOOM!"
            || stateAfterCommand == "finished") {

            // but don't repeat commands
            var anotherCommand = possibleCommand;

            do {
                alreadyUsedCommands.push(anotherCommand);
                anotherCommand = generateNextCommand(board, seed, alreadyUsedCommands, commands.last);
                possibleState = player.nextState(state, {"command": anotherCommand});
                stateAfterCommand = possibleState ? possibleState.state.state : null;
            } while ((possibleState == null
            || stateAfterCommand == "BOOM!")
            && anotherCommand);

            possibleCommand = anotherCommand;
        }

        if (possibleCommand) commands.push(possibleCommand);

        state = possibleState;
        lastState = possibleState ? possibleState : lastState;
        score = lastState.state.score;
    }

    var letters = letterCommandInterpretator.lettersFromCommands(commands.join(" "));
    return solution.init(board.id, seed, letters, score);
};


// ---------------------------------------

exports.solveBoardForAllSeedsForLetters = function (json, letters) {
    var seeds = json.sourceSeeds;
    var board = json;

    var solutions = [];
    seeds.forEach(function (seed) {
        solutions.push(solveBoardForLetters(board, seed, letters));
    });
    return solutions;
};


var solveBoardForLetters = function (board, seed, letters) {
    var state = player.initializeOneBoard(board, seed);
    state.sequence = letters;
    state = player.nextState(state, {"command": "SEQUENCE"});
    return solution.init(board.id, seed, letters);
};


var generateNextCommand = function (board, seed, alreadyUsedCommands, previousCommand) {
    // TODO: implement real
    //var possibleCommands = ["SW", "SE", "W", "E", "CC", "C"];
    var possibleCommands = [
        "SW", "SE", "SW", "SE",
        "SW", "SE", "SW", "SE",
        "SW", "SE", "SW", "SE",
        "SW", "SE", "SW", "SE",
        "E", "E", "E", "E",
        "E", "E", "E", "E",
        "W", "W"
        //,"CC", "C"
    ];

    var commandToFilter = null;
    switch (previousCommand) {
        case "W":
            commandToFilter = "E";
            break;
        case "E":
            commandToFilter = "W";
            break;
        case "C":
            commandToFilter = "CC";
            break;
        case "CC":
            commandToFilter = "C";
            break;
    }
    if (commandToFilter) {
        possibleCommands = possibleCommands.filter(function (i) {
            return i != commandToFilter;
        });
    }


    // filter already used commands
    if (alreadyUsedCommands.length > 0) {
        possibleCommands = possibleCommands.filter(function (n) {
            return !(alreadyUsedCommands.indexOf(n) > -1);
        });
    }
    if (possibleCommands.length == 0) {
        return null;
    }

    //return possibleCommands[0];
    return possibleCommands[Math.floor(Math.random() * possibleCommands.length)];
};