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
                sourceSeeds: [17],
                units: [{
                    pivot: {x: 1, y: 2},
                    members: [{x: 1, y: 2}]
                },
                    {
                        pivot: {x: 0, y: 0},
                        members: [{x: 0, y: 0}]
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
            assert.notEqual(result.state.unit, undefined, "We should provide unit");
            assert.notEqual(result.board, undefined, "We should provide board in result");
        });

        it('should set original unit in result', function () {
            var result = brain.placeUnitOnTop(state, unit)
            assert.equal(result.state.unit, unit, "We should put original unit in result");
            assert.equal(result.state.seed, result.state.seed, "We should put original seed");
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

            it('Should not be placed if state is in eror state', function () {
                state.state.state = "error";
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin, undefined, "We should set anything in case of error");

                state.board.width = 4;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin, undefined, "We should set unit in center");

                state.board.width = 5;
                result = brain.placeUnitOnTop(state, unit);
                assert.equal(result.state.unitOrigin, undefined, "We should set anything in case of error");
            });
        });

        context('When asked for new unit', function () {
            it('return state with unit from the board', function () {
                result = brain.getNextUnit(state);
                assert.equal(result.state.unitOrigin, undefined, "After next unit put, we should set off unit Origin");
                assert.notEqual(result.state.seed, state.state.seed, "We should upate seed to the new value");
                assert.equal(result.state.state, "waiting for placing figure", "We shoudl update state for specific case");
                assert.notEqual(result, undefined, "Should return sate");
                assert.notEqual(state.state, undefined, "State is required");
                assert.equal(result.state.score, state.state.score, "We shouldn't alter score on placing");
                assert.notEqual(result.state.unit, undefined, "We should provide unit");
                assert.notEqual(result.board, undefined, "We should provide board in result");
            });

            it('return finish when theres no more items', function () {
                state.board.sourceLength = 0
                result = brain.getNextUnit(state);
                assert.equal(result.state.state, "finished", "We shoudl update state for specific case");
                assert.notEqual(result.state.message, undefined, "We should notify user why is that");
            });

            it('return decrease numbe of item when gets new unit', function () {
                state.board.sourceLength = 2;
                result = brain.getNextUnit(state);
                assert.equal(result.board.sourceLength, 1, "return decrease numbe of item when gets new unit'");

                state.board.sourceLength = 5;
                result = brain.getNextUnit(state);
                assert.equal(result.board.sourceLength, 4, "return decrease numbe of item when gets new unit'");

            });


        });


    });


});
