/**
 * Created by ptaykalo on 8/7/15.
 */
var brain = require("../logic/brain");
var assert = require('assert');

describe("brain", function () {

    context("When pacing unit on board", function () {
        var unit = {};
        var validBoard = {};
        var state = {};

        beforeEach(function () {
            unit = {
                pivot: {x: 0, y: 0},
                members: [{x: 0, y: 0}]
            };
            validBoard = {
                width: 10,
                height: 10,
                sourceSeeds: [123],
                units: [{
                    pivot: {x: 1, y: 2},
                    members: [{x: 1, y: 2}]
                }]
            };

            state = {
                board: validBoard,
                state: {
                    state: "ok",
                    unit: validBoard.units[0],
                    score: 0,
                    unitIndex: 0,
                    seed: 0
                }
            };

        });
        it('Return state in result', function () {
            var result = brain.placeUnitOnTop(state, unit)

            assert.notEqual(result, undefined, "Should return sate");
            assert.notEqual(state.state, undefined, "State is required");
            assert.equal(result.state.state, "ok", "State's state should be ok");
            assert.equal(result.state.score, state.state.score, "We shouldn't alter score on placing");
            assert.equal(result.state.unitIndex, 0, "We shouldn't alter unit inex");
            assert.notEqual(result.state.unit, undefined, "We should provide unit");
            assert.notEqual(result.board, undefined, "We should provide board in result");
        });

        it('should set original unit in result', function () {
            var result = brain.placeUnitOnTop(state, unit)
            assert.equal(result.state.unit, unit, "We should put original unit in result");
        });

        it('should set units position', function () {
            var result = brain.placeUnitOnTop(state, unit)
            assert.notEqual(result.state.unitOrigin, undefined, "We should provide unit's origin");
            assert.notEqual(result.state.unitOrigin.x, undefined, "We should provide unit's origin");
            assert.notEqual(result.state.unitOrigin.y, undefined, "We should provide unit's origin");
        });

        it('should correctly set unit', function () {
            var result = brain.placeUnitOnTop(state, unit);
            assert.equal(result.state.unitOrigin.y, 0, "We should set unit on the top");
        });

        context('In case of simple unit', function () {
            beforeEach(function () {
                unit = {
                    pivot: {x: 0, y: 0},
                    members: [{x: 0, y: 0}]
                };
            });
            it('Should be placed to the center of the board', function () {
                state.board.width = 1;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin.x, 0, "We should set unit in center");

                state.board.width = 2;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin.x, 0, "We should set unit in center");

                state.board.width = 3;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin.x, 1, "We should set unit in center");

                state.board.width = 4;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin.x, 1, "We should set unit in center");

                state.board.width = 5;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin.x, 2, "We should set unit in center");
            });
        });

        context('In case of complex unit 3x unit', function () {
            beforeEach(function () {
                unit = {
                    pivot: {x: 0, y: 0},
                    members: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}]
                };
            });
            it('Should be placed to the center of the board', function () {
                state.board.width = 3;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin.x, 0, "We should set unit in center");

                state.board.width = 4;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin.x, 0, "We should set unit in center");

                state.board.width = 5;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin.x, 1, "We should set unit in center");
            });
        });



    });


});
