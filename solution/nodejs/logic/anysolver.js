var player = require('./player');
var solution = require('./oneSolution');
var letterCommandInterpretator = require('./../public/js/letterCommandInterpretator');
var extend = require('util')._extend;
var estimator = require("../logic/estimator");
var fastboard = require("../logic/fastboard");
var astar = require("../logic/astar");
var pwMatcher = require('./powerWordsMatcher');


exports.solveBoardForAllSeeds = function (json, magicPhrases, partial_result, max_cycles_constraint) {
    var seeds = json.sourceSeeds;
    var board = json;

    var solutions = seeds.map(function (seed) {
        return solution.init(board.id, seed, "", 0)
    });

    var max_cycles = max_cycles_constraint ? max_cycles_constraint : 10000;
    if (!partial_result) {
        max_cycles = 1;
    }
    while (max_cycles > 0) {
        var atLeastOneWasBetter = false;
        solutions = solutions.map(function (oldSolution) {
            var newSolution = solveBoard(board, oldSolution.seed, magicPhrases);
            if (newSolution.score > oldSolution.score) {
                atLeastOneWasBetter = true;
                return newSolution;
            }
            return oldSolution;
        });

        if (partial_result && atLeastOneWasBetter) {
            partial_result(solutions);
        }
        max_cycles--;
    }
    return solutions;
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
        var finalState = commands.reduce(function (state, command) {
            var nextState = player.nextState(state, {"command": command});
            if (!nextState) {
                console.error(" ALARMAAAAAA!!!!!  On calling "  + command);
                console.error(" Commands here are '" + commands +"'") ;
                console.error(" last state is '" + JSON.stringify(state)) ;
            }

            return nextState;
        }, state);

        // Okay, let's lock it
        var lockCommands = ["E", "SW", "W", "SE"].filter(function(command){
            var nextState = player.nextState(finalState, {"command": command});
            if (nextState.state.state == "BOOM!") {
                return false;
            }
            return nextState.state.score != finalState.state.score;
        });

        commands.push(lockCommands[0]);
        finalState = player.nextState(finalState, {"command": lockCommands[0]});

        finalState.state._nextCommands = commands;
        finalState.state._commandsToReachThisState = (state.state._commandsToReachThisState ? state.state._commandsToReachThisState : []).concat(commands);
        return finalState;
    }

    // TODO :What to do here if we weren't able to reach it ?

    // TODO : Try harde or just exit? for now - lets' finish an return
    state.state.state = "finished";

    return state;

}


var solveBoard = function (board, seed, magicPhrases) {
    var state = player.initializeOneBoard(board, seed);
    var commands = [];
    var lastState = state;
    var score = state.state.score;

    while (state && state.state.state != "finished") {

        state = exports.makeNextMoveAndLock(state);
        commands = state.state._commandsToReachThisState ? state.state._commandsToReachThisState : commands;
        score = state.state.score ? state.state.score : score;
    }

    console.log("=====================================");
    console.log("Solution found. Starting to generate leter");
    console.log("Score : " + score);
    var lettersAndScores = pwMatcher.lettersAndScoresWithPowerWords(commands, score, magicPhrases);
    var letters = lettersAndScores.letters;
    var newScores = lettersAndScores.scores;

    console.log("Final : " + newScores);
    console.log("=============DONE =================");

    return solution.init(board.id, seed, letters, newScores);
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