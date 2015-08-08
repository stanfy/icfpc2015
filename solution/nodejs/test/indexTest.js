/**
 * Created by ptaykalo on 8/7/15.
 */
var brain = require("../logic/brain");
var assert = require('assert');

describe("initial", function () {
    context("by default", function () {
        var board = {};
        var validBoard = {
            sourceSeeds:[123],
            filled:[],
            units:[{
                pivot:{x:1,y:2},
                members:[{x:1,y:2}]
            }]
        };

        it("return intial state", function () {
            assert.notEqual(brain.initTransform(validBoard), undefined, "Something broken");
            assert.notEqual(brain.initTransform(validBoard).state, undefined, "State is required");
            assert.equal(brain.initTransform(validBoard).state.state, "ok", "State's state should be ok");
            assert.equal(brain.initTransform(validBoard).state.score, 0);
            assert.notEqual(brain.initTransform(validBoard).state.unit, undefined);
            assert.notEqual(brain.initTransform(validBoard).state.seed, undefined);
            assert.notEqual(brain.initTransform(validBoard).board, undefined);
        });

        it('fail in case if board is not specified', function () {
            assert.equal(brain.initTransform().state.state, "error");
            assert.notEqual(brain.initTransform().state.message, undefined);
        });

    });


});
