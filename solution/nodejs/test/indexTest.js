/**
 * Created by ptaykalo on 8/7/15.
 */
var brain = require("../logic/brain");
var assert = require('assert');

describe("initial", function () {
    context("by default", function () {
        var board = {};

        it("return intial state", function () {
            assert.notEqual(brain.initTransform(board), undefined, "Something broken");
            assert.notEqual(brain.initTransform(board).state, undefined, "State is required");
            assert.equal(brain.initTransform(board).state.state, "ok", "State's state should be ok");
            assert.equal(brain.initTransform(board).state.score, 0);
            assert.equal(brain.initTransform(board).state.unitIndex, 0);
            assert.notEqual(brain.initTransform(board).state.seed, undefined);
            assert.notEqual(brain.initTransform(board).board, undefined);
        });

        it('fail in case if board is not specified', function () {
            assert.equal(brain.initTransform().state.state, "error");
            assert.notEqual(brain.initTransform().state.message, undefined);
        });
    });

    context('when board is specified', function () {

    });


});
