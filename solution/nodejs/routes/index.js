var express = require('express');
var router = express.Router();
var brain = require('../logic/brain');
var lcg = require('../logic/lcg');
var Long = require("long");
var player = require("../logic/player");

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
    console.error("Query is " + JSON.stringify(req.query));

    var nextState = player.nextState(state, params);
    res.json(nextState);
});

module.exports = router;
