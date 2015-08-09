/**
 * Created by alexandervoronov on 8/8/15.
 */

var pwMatcher = require("../logic/powerWordsMatcher");
var assert = require('assert');

describe('Power Words Matcher', function () {
    it('Should generate array of matchings for input commands sequence', function () {
        var commandsSequence = ['SW','E', 'E', 'E', 'CC', 'SW', 'CC', 'SE', 'SW', 'CC', 'SW', 'CC', 'C', 'SE', 'SW', 'W'];
        var result = pwMatcher.powerWordsMatchingsInCommandsSequence(commandsSequence, [
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
        ])
        assert.equal(result[0].powerWord.toLowerCase(), "bee".toLowerCase())
        assert.equal(result[0].commandIndex, 3)
        assert.equal(result[1].powerWord.toLowerCase(), "cthulhu".toLowerCase())
        assert.equal(result[1].commandIndex, 9)
        assert.equal(result[2].powerWord.toLowerCase(), "LA!".toLowerCase())
        assert.equal(result[2].commandIndex, 15)
    });
});