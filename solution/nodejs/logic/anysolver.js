var player = require('./player');
var solution = require('./oneSolution');
var letterCommandInterpretator = require('./../public/js/letterCommandInterpretator');
var extend = require('util')._extend;
var estimator = require("../logic/estimator");
var fastboard = require("../logic/fastboard");
var astar = require("../logic/astar");
var pwMatcher = require('./powerWordsMatcher');
var timeToEnd = require('./timeToEnd');
var solver = require('./solver');


exports.solveBoardForAllSeeds = function (json, magicPhrases, partial_result, max_cycles_constraint, millisecondsOfEnd) {
    var seeds = json.sourceSeeds;
    var board = json;

    var solutions = seeds.map(function (seed) {
        return solution.init(board.id, seed, "", 0)
    });

    var max_cycles = (max_cycles_constraint > 0) ? max_cycles_constraint : 10000;
    if (!partial_result) {
        max_cycles = 1;
    }
    while (max_cycles > 0) {

        var atLeastOneWasBetter = false;
        solutions = solutions.map(function (oldSolution) {
            var newSolution = solveBoard(board, oldSolution.seed, magicPhrases, millisecondsOfEnd);
            if (newSolution.score > oldSolution.score) {
                atLeastOneWasBetter = true;
                if (partial_result) {
                    partial_result([newSolution]);
                }
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
            console.error("Commnds" + coms);

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
        console.error("Commnds" + coms);

        var resultState = extend({}, state.state);
        resultState.estimatedPositions = value;
        resultState._nextCommands = coms;

        if (resultState._nextCommands && resultState._nextCommands.length) {
            return resultState._nextCommands;
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
                state.state.state = "KILL ME";
                return state;
            }

            return nextState;
        }, state);

        if (finalState && finalState.state.state != "KILL ME") {
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
        }

        finalState.state._nextCommands = commands;
        finalState.state._commandsToReachThisState = (state.state._commandsToReachThisState ? state.state._commandsToReachThisState : []).concat(commands);
        return finalState;
    }

    // TODO :What to do here if we weren't able to reach it ?

    // TODO : Try harde or just exit? for now - lets' finish an return

    var commandsAndScores = solver.solveStateAndReturnCommands(state, state.state.seed, (state.state._commandsToReachThisState ? state.state._commandsToReachThisState : []));
    state.state._commandsToReachThisState = commandsAndScores.commands;
    state.state.score = commandsAndScores.score;
    state.state.state = "finished";

    return state;

};


var solveBoard = function (board, seed, magicPhrases, millisecondsOfEnd) {
    var state = player.initializeOneBoard(board, seed);
    var commands = [];
    var lastState = state;
    var score = state.state.score;
    var tooLittleTimeLeft = false;

    while (state && state.state.state != "finished" && !tooLittleTimeLeft) {
        state = exports.makeNextMoveAndLock(state);
        commands = state.state._commandsToReachThisState ? state.state._commandsToReachThisState : commands;
        score = state.state.score ? state.state.score : score;
        tooLittleTimeLeft = timeToEnd.oneSecondToEnd(millisecondsOfEnd);
    }

    console.error("=====================================");
    console.error("Score : " + score);
    var resultLetters = "";
    var resultScore = score;

    if (tooLittleTimeLeft) {
        console.error("Too little time left.. finishing");
        resultLetters = letterCommandInterpretator.lettersFromCommands(commands.join(" "));
    } else {
        console.error("Solution found. Starting to generate letters");
        var lettersAndScores = pwMatcher.lettersAndScoresWithPowerWords(commands, score, magicPhrases, millisecondsOfEnd);
        resultLetters = lettersAndScores.letters;
        resultScore = lettersAndScores.scores;
    }

    console.error("Final : " + resultScore);
    console.error("=============DONE =================");

    return solution.init(board.id, seed, resultLetters, resultScore);
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