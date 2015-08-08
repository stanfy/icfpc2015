/**
 * Created by ptaykalo on 8/8/15.
 */

var player = require('./player');


function solve(state, state) {
   var commands = ["W", "E", "SW", "SE", "C", "CC"];

    var nextStates = commands.map(function (cmd) {
        return player.nextState(state, {command: cmd});
    });

   player.nextState()
}

exports.anySolve = function (board, seed) {
    var initialState = player.initializeOneBoard(board, seed);
    return solution.init(board.id, seed, "alalalaal");
};