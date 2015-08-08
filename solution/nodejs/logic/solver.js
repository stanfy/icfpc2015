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
    return solution.init(board.id, seed, "alalalaal");
};