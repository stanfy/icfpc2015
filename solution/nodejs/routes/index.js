var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.get('/initial', function (req, res, next) {
    //var info = JSON.parse(req.body);

    // old state
    var board = {
            "height": 20,
            "width": 30,
            "sourceSeeds": [0, 29060, 6876, 31960, 6094],
            "units": [{"members": [{"x": 0, "y": 0}, {"x": 2, "y": 0}], "pivot": {"x": 1, "y": 0}}, {
                "members": [{
                    "x": 1,
                    "y": 0
                }, {"x": 0, "y": 1}, {"x": 0, "y": 2}], "pivot": {"x": 0, "y": 1}
            }, {
                "members": [{"x": 2, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
                "pivot": {"x": 1, "y": 0}
            }, {
                "members": [{"x": 1, "y": 1}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
                "pivot": {"x": 0, "y": 0}
            }, {
                "members": [{"x": 2, "y": 0}, {"x": 1, "y": 1}, {"x": 1, "y": 2}, {"x": 0, "y": 3}],
                "pivot": {"x": 1, "y": 1}
            }, {
                "members": [{"x": 2, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
                "pivot": {"x": 1, "y": 1}
            }, {
                "members": [{"x": 1, "y": 1}, {"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
                "pivot": {"x": 0, "y": 1}
            }, {
                "members": [{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
                "pivot": {"x": 0, "y": 1}
            }, {
                "members": [{"x": 1, "y": 0}, {"x": 1, "y": 1}, {"x": 1, "y": 2}, {"x": 0, "y": 3}],
                "pivot": {"x": 0, "y": 1}
            }, {
                "members": [{"x": 2, "y": 0}, {"x": 1, "y": 1}, {"x": 0, "y": 1}, {"x": 0, "y": 2}],
                "pivot": {"x": 1, "y": 1}
            }, {
                "members": [{"x": 2, "y": 1}, {"x": 2, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
                "pivot": {"x": 1, "y": 0}
            }, {
                "members": [{"x": 1, "y": 1}, {"x": 2, "y": 0}, {"x": 1, "y": 0}, {"x": 0, "y": 1}],
                "pivot": {"x": 1, "y": 0}
            }, {
                "members": [{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 1}, {"x": 0, "y": 2}],
                "pivot": {"x": 0, "y": 1}
            }, {
                "members": [{"x": 0, "y": 1}, {"x": 1, "y": 1}, {"x": 3, "y": 0}, {"x": 2, "y": 0}],
                "pivot": {"x": 1, "y": 0}
            }],
            "id": 3,
            "filled": [{"x": 2, "y": 5}, {"x": 3, "y": 5}, {"x": 4, "y": 5}, {"x": 5, "y": 5}, {"x": 11, "y": 5}, {
                "x": 16,
                "y": 5
            }, {"x": 17, "y": 5}, {"x": 18, "y": 5}, {"x": 19, "y": 5}, {"x": 25, "y": 5}, {"x": 4, "y": 6}, {
                "x": 11,
                "y": 6
            }, {"x": 18, "y": 6}, {"x": 25, "y": 6}, {"x": 4, "y": 7}, {"x": 11, "y": 7}, {"x": 18, "y": 7}, {
                "x": 25,
                "y": 7
            }, {"x": 4, "y": 8}, {"x": 11, "y": 8}, {"x": 18, "y": 8}, {"x": 25, "y": 8}, {"x": 4, "y": 9}, {
                "x": 7,
                "y": 9
            }, {"x": 8, "y": 9}, {"x": 11, "y": 9}, {"x": 18, "y": 9}, {"x": 21, "y": 9}, {"x": 22, "y": 9}, {
                "x": 25,
                "y": 9
            }, {"x": 4, "y": 10}, {"x": 7, "y": 10}, {"x": 9, "y": 10}, {"x": 18, "y": 10}, {"x": 21, "y": 10}, {
                "x": 23,
                "y": 10
            }, {"x": 2, "y": 11}, {"x": 3, "y": 11}, {"x": 4, "y": 11}, {"x": 5, "y": 11}, {"x": 7, "y": 11}, {
                "x": 8,
                "y": 11
            }, {"x": 9, "y": 11}, {"x": 11, "y": 11}, {"x": 16, "y": 11}, {"x": 17, "y": 11}, {"x": 18, "y": 11}, {
                "x": 19,
                "y": 11
            }, {"x": 21, "y": 11}, {"x": 22, "y": 11}, {"x": 23, "y": 11}, {"x": 25, "y": 11}],
            "sourceLength": 100
        }
        ;


    res.json({
        state: {
            score:10,
            seed:29060,
            seedint:1,
            state:"ok", // finish
            message:""
        },
        board: board
    })
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
