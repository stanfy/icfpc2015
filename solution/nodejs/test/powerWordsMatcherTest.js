/**
 * Created by alexandervoronov on 8/8/15.
 */

var pwMatcher = require("../logic/powerWordsMatcher");
var assert = require('assert');

describe('Power Words Matcher', function () {
    it('Should generate array of matchings for input commands sequence', function () {
        var commandsSequence = ['SW','E', 'E', 'E', 'CC', 'SW', 'CC', 'SE', 'SW', 'CC', 'SW', 'CC', 'C', 'SE', 'SW', 'W'];
        var powerWords = [
            "ei!",
            "cthulhu",
            "as2h2",
            "galois",
            "bee",
            "aleister",
            "davar",
            "pentagram",
            "lambda",
            "oga",
            "la!",
            "turing",
            "r'lyeh!",
            "yuggot"
        ]
        var result = pwMatcher.powerWordsMatchingsInCommandsSequence(commandsSequence, powerWords)
        assert.equal(powerWords[result[0].powerWordIndex].toLowerCase(), "bee".toLowerCase())
        assert.equal(result[0].commandIndex, 3)
        assert.equal(powerWords[result[1].powerWordIndex].toLowerCase(), "cthulhu".toLowerCase())
        assert.equal(result[1].commandIndex, 9)
        assert.equal(powerWords[result[2].powerWordIndex].toLowerCase(), "LA!".toLowerCase())
        assert.equal(result[2].commandIndex, 15)
    });
});