var express = require('express');
var router = express.Router();
var brain = require('../logic/brain');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.post('/initial', function (req, res, next) {
    var board = req.body;
    console.error(board  + "---");
    var state = brain.initTransform(board);
    res.json(state);
});

router.post('/state', function (req, res, next) {
    var state = req.body;
    state.board.filled.push({x:2,y:2});
    res.json(state);
});

module.exports = router;
