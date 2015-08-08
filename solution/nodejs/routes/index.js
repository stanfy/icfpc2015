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
    // TODO : allow to select SEED
    console.error(board + "---");
    var state = brain.initTransform(board);
    console.error(board + "---");

    var stateWithUnit = brain.getNextUnit(state);
    console.error(board + "---" + stateWithUnit.state.unit);

    var nextState = brain.placeUnitOnTop(stateWithUnit, stateWithUnit.state.unit);
    console.error(board + "---");

    res.json(nextState);
});

/*
 States expects "state" object which was set up at the inital method
 */
router.post('/state', function (req, res, next) {
    var state = req.body;
    var params = req.query;
    console.error("Query is " + JSON.stringify(req.query));

    // Skipe everyting,if current state is not ok
    if (state.state.state != "ok") {
        res.json(state);
        console.error("Skipping since previous state is not OK " + state.state.state);
        return;
    }

    //move [ E | W | SE | SW | C | CC]
    //Move all members of the unit one cell in the given direction.
    //    turn [ clockwise | counter-clockwise ]
    var nextState = state;
    if (params.command == "W") {
        // Move left
        nextState = brain.moveLeft(state);
    } else if (params.command == "E") {
        nextState = brain.moveRight(state);

    } else if (params.command == "SW") {
        nextState = brain.moveDownLeft(state);

    } else if (params.command == "SE") {
        nextState = brain.moveDownRight(state);

    } else if (params.command == "C") {
        nextState = brain.rotateC(state);

    } else if (params.command == "CC") {
        nextState = brain.rotateCC(state);

    }
    //
    //
    //state.board.filled.push({x: 2, y: 2});
    //nextState = brain.moveLeft(state);
    res.json(nextState);
});

module.exports = router;
