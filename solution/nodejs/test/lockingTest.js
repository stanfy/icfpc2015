/**
 * Created by ptaykalo on 8/8/15.
 */
var brain = require("../logic/brain");
var assert = require('assert');

describe('Locking', function () {
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
            filled: [],
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

        var stateWithUnit = brain.getNextUnit(state);
        state = brain.placeUnitOnTop(stateWithUnit, stateWithUnit.state.unit);
    });

    context('When locking without unit', function () {
        beforeEach(function () {
            delete state.state.unit
        });
        it('should fail', function () {
            assert.equal(brain.lockUnit(state).state.state, "error");
            assert.notEqual(brain.lockUnit(state).state.message, undefined);
        });
    });
    context('when locking with unit', function () {
        it('should not fail', function () {
            assert.equal(brain.lockUnit(state).state.state, "locked");
        });
        it('add all unit to filled items', function () {
            var unit = state.state.unit;
            state = brain.lockUnit(state);
            assert.equal(unit.members.every(function (cell) {
                return state.board.filled.some(function (filledCell) {
                    return filledCell.x == cell.x && filledCell.y == cell.y;
                })
            }), true, "All items should be put as locked to the board")
        });

        // It should be on remove all lines
        //it('Should increase score by ate least amount of members in unit', function () {
        //    var unit = state.state.unit;
        //    var origin = state.state.unitOrigin;
        //    var nextState = brain.lockUnit(state);
        //    assert.equal(nextState.state.score, state.state.score + unit.members.length);
        //});

        it('Return state in result', function () {
            state = brain.lockUnit(state);

            assert.notEqual(state, undefined, "Should return sate");
            assert.notEqual(state.state, undefined, "State is required");
            assert.notEqual(state.board, undefined, "We should provide board in result");
        });

    });
});