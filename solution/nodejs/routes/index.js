var express = require('express');
var router = express.Router();
var brain = require('../logic/brain');
var lcg = require('../logic/lcg');
var Long = require("long");
var player = require("../logic/player");
var anysolver = require("../logic/anysolver");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.post('/initial', function (req, res, next) {
    var board = req.body.board;
    var seed = req.body.seed;

    var state = player.initializeOneBoard(board, seed);

    res.json(state);
});

/*
 States expects "state" object which was set up at the inital method
 */
router.post('/state', function (req, res, next) {
    var state = req.body;
    var params = req.query;

    // Skip everyting,if current state is not ok
    if (state.state.state != "ok") {
        res.json(state);
        console.error("Skipping since previous state is not OK " + state.state.state);
        return;
    }

    console.error("Query is " + JSON.stringify(req.query));

    var nextState = player.nextState(state, params);
    res.json(nextState);
});


/*
 States expects "state" object which was set up at the inital method
 */
router.post('/nextMove', function (req, res, next) {
    var state = req.body;
    var params = req.query;

    // Skip everyting,if current state is not ok
    if (state.state.state != "ok") {
        res.json(state);
        console.error("Skipping since previous state is not OK " + state.state.state);
        return;
    }

    console.error("Query iss " + JSON.stringify(req.query));

    var moves = anysolver.makeNextMove(state);
    res.json(moves);
});

module.exports = router;
