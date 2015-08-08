var player = require('./player');
var solution = require('./oneSolution');

exports.solveBoardForAllSeeds = function(json) {
    var seeds = json.sourceSeeds;
    var board = json;

    var solutions = [];
    seeds.forEach(function (seed) {
        solutions.push(solveBoard(board, seed));
    });
    return solutions;
};


var solveBoard = function (board, seed) {
    var state = player.initializeOneBoard(board, seed);
    var commands = [];

    while(state) {
        var nextCommand = generateNextCommand(board, seed);
        commands.push(nextCommand);
        state = player.nextState(state, {"command" : nextCommand});
    }

    var letters = lettersFromCommands(commands.join(","));
    return solution.init(board.id, seed, letters);
};


// ---------------------------------------

exports.solveBoardForAllSeedsForLetters = function(json, letters) {
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
    state = player.nextState(state, {"command" : "SEQUENCE"});
    return solution.init(board.id, seed, letters);
};


// --------------------------------------------

// -> SW W E W E
// <- aaaalllaalla
var lettersFromCommands = function(commands) {
    var commandsArray = commands.split(",");
    var letters = "";

    commandsArray.map(function(command) {
        letters += selectLetterFromCommand(command);
    });
    return letters;
};


var selectLetterFromCommand = function (command) {
    var letters = [];
    switch(command) {
        case "W": letters = ["p","'","!", ".", "0", "3"]; break;
        case "E": letters = ["b","c","e", "f", "y", "2"]; break;
        case "SW": letters = ["a","g","h", "i", "j", "4"]; break;
        case "SE": letters =["l","m","n", "o", " ", "5"]; break;
        case "C": letters = ["d","q","r", "v", "z", "1"]; break;
        case "CC": letters = ["k","s","t", "u", "w", "x"]; break;
    }

    return letters[0];
    //return letters[Math.floor(Math.random()*letters.length)];
};


var generateNextCommand = function (board, seed) {
    // TODO: implement real

    var possibleCommands = ["W", "E", "SW", "SE", "CC", "C"];
    return possibleCommands[Math.floor(Math.random()*possibleCommands.length)];
};