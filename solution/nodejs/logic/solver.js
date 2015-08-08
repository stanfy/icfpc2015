var player = require('./player');
var solution = require('./oneSolution');

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
            partial_result(solutions);
        }
        max_cycles--;
    }
    return solutions;
};


var solveBoard = function (board, seed) {
    var state = player.initializeOneBoard(board, seed);
    var commands = [];
    var lastState = state;
    var score = state.state.score;

    while (state) {
        // generate state
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

    var letters = lettersFromCommands(commands.join(","));
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


// --------------------------------------------

// -> SW W E W E
// <- aaaalllaalla
var lettersFromCommands = function (commands) {
    var commandsArray = commands.split(",");
    var letters = "";

    commandsArray.map(function (command) {
        letters += selectLetterFromCommand(command);
    });
    return letters;
};


var selectLetterFromCommand = function (command) {
    var letters = [];
    switch (command) {
        case "W":
            letters = ["p", "'", "!", ".", "0", "3"];
            break;
        case "E":
            letters = ["b", "c", "e", "f", "y", "2"];
            break;
        case "SW":
            letters = ["a", "g", "h", "i", "j", "4"];
            break;
        case "SE":
            letters = ["l", "m", "n", "o", " ", "5"];
            break;
        case "C":
            letters = ["d", "q", "r", "v", "z", "1"];
            break;
        case "CC":
            letters = ["k", "s", "t", "u", "w", "x"];
            break;
    }

    return letters[0];
    //return letters[Math.floor(Math.random()*letters.length)];
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