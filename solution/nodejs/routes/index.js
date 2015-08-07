var express = require('express');
var router = express.Router();
var brain = require('../logic/brain');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.get('/initial', function (req, res, next) {
    console.error("Initial started");
    var board = req.body;
    var state = brain.initTransform(board);
    res.json(state);
});

router.get('/state', function (req, res, next) {
    //var info = JSON.parse(req.body);

    // old state
    var state = {
        state: {
            score:10,
            seed:29060,
            seedint:1,
            state:"ok", // finish
            message:""
        },
        board: {

        }
    };

    res.json({
        state: {
            score:10,
            seed:29060,
            seedint:1,
            state:"ok", // finish
            message:""
        },
        board: {

        }

    })
});

module.exports = router;
