var express = require('express');
var router = express.Router();
var brain = require('../logic/brain');
var lcg = require('../logic/lcg');
var Long = require("long");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.post('/initial', function (req, res, next) {
    var board = req.body;
    console.error(board  + "---");
    var state = brain.initTransform(board);
    var nextState = brain.placeUnitOnTop(state, board.units[0]);
    var seed = Long.fromInt(17,true);
    for (var i = 1; i < 20; i++) {
        var lcgValue = lcg.lcgValue(seed);
        console.error(lcgValue.value);
        seed = lcgValue.seed
    }
    res.json(nextState);
});

router.post('/state', function (req, res, next) {
    var state = req.body;
    state.board.filled.push({x:2,y:2});
    res.json(state);
});

module.exports = router;
