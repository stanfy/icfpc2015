var assert = require('assert');
var expect = require("chai").expect;
var transform = require("../logic/transformations");

describe("rotation", function () {

    context("converting", function () {


        it("rotate left first test", function () {
           var point = {x: 3, y: 7};
            var pivot = {x: 2, y: 9};
            var rotated =  transform.rotateLeft(point,pivot );
            expect(rotated).to.deep.equal({x:1, y:7});

        });
        it("rotate left second test", function () {

            var point = {x: 4, y: 4};
            var pivot = {x: 2, y: 5};
            var rotated = transform.rotateLeft(point,pivot );
            expect(rotated).to.deep.equal({x:2, y:3});

        });

        it("rotate right first test", function () {
            var point = {x: 1, y: 7};
            var pivot = {x: 2, y: 9};
            var rotated = transform.rotateRight(point,pivot );
            expect(rotated).to.deep.equal({x:3, y:7});

        });
        it("rotate right second test", function () {

            var point = {x: 2, y: 3};
            var pivot = {x: 2, y: 5};
            var rotated = transform.rotateRight(point,pivot );
            expect(rotated).to.deep.equal({x:4, y:4});

        });

        it("rotate left and then right should be the same", function(){
            var point = {x: 2, y: 3};
            var pivot = {x: 2, y: 5};
            var rotated1 = transform.rotateLeft(point,pivot );
            var rotated2 = transform.rotateRight(rotated1,pivot)
            expect(rotated2).to.deep.equal(point);
        });

        it("rotate right and left should be the same", function(){
            var point = {x: 2, y: 3};
            var pivot = {x: 2, y: 5};
            var rotated1 = transform.rotateRight(point,pivot );
            var rotated2 = transform.rotateLeft(rotated1,pivot)
            expect(rotated2).to.deep.equal(point);
        });

        it("six rotates to the right should be the same", function(){
            var point = {x: 2, y: 3};
            var pivot = {x: 2, y: 5};
            var rotated1 = transform.rotateRight(point,pivot );
            var rotated2 = transform.rotateRight(rotated1,pivot);
            var rotated3 = transform.rotateRight(rotated2,pivot);
            var rotated4 = transform.rotateRight(rotated3,pivot);
            var rotated5 = transform.rotateRight(rotated4,pivot);
            var rotated6 = transform.rotateRight(rotated5,pivot);
            expect(rotated6).to.deep.equal(point);
        });

        it("six rotates to the left should be the same", function(){
            var point = {x: 2, y: 3};
            var pivot = {x: 2, y: 5};
            var rotated1 = transform.rotateLeft(point,pivot );
            var rotated2 = transform.rotateLeft(rotated1,pivot);
            var rotated3 = transform.rotateLeft(rotated2,pivot);
            var rotated4 = transform.rotateLeft(rotated3,pivot);
            var rotated5 = transform.rotateLeft(rotated4,pivot);
            var rotated6 = transform.rotateLeft(rotated5,pivot);
            expect(rotated6).to.deep.equal(point);
        });

        it("compex figure right rotation", function(){
            unit = {
                pivot: {x: 0, y: 0},
                members: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}]
            };
            var expectedRotated = {
                pivot: {x: 0, y: 0},
                members: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 2}]
            };
            var rotated = transform.rotateUnitRight(unit);
            expect(rotated).to.deep.equal(expectedRotated);
        });

        it("compex figure left rotation", function(){
            expectedRotated = {
                pivot: {x: 0, y: 0},
                members: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}]
            };
            var unit = {
                pivot: {x: 0, y: 0},
                members: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 2}]
            };
            var rotated = transform.rotateUnitLeft(unit);
            expect(rotated).to.deep.equal(expectedRotated);
        });

    });
});