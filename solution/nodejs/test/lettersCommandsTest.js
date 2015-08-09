/**
 * Created by hdf on 09.08.15.
 */

var assert = require('assert');
var expect = require("chai").expect;
var letterCommandInterpretator = require("../public/js/letterCommandInterpretator");

describe("letter-commands", function () {

    context("letters test", function () {


        it("letters", function () {

            var letters = "iiimmal 'p";
            var commands = letterCommandInterpretator.commandsFromLetters(letters);
            expect(commands).to.equal("SW SW SW SE SE SW SE SE W W");
        });

        it("commands", function () {

            var commands = "SW SE SW E CC C E E ";
            var letters = letterCommandInterpretator.lettersFromCommands(commands);
            expect(letters).to.equal("alabkdbb");
        });


    });
});