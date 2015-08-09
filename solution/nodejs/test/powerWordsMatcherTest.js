/**
 * Created by alexandervoronov on 8/8/15.
 */

var pwMatcher = require("../logic/powerWordsMatcher");
var assert = require('assert');

describe('Power Words Matcher', function () {
    var commands = ['SW', 'E', 'E', 'E', 'E', 'CC', 'SW', 'CC', 'SE', 'SW', 'CC', 'SW', 'CC', 'C', 'SE', 'SW', 'W'];
    //                     b    e    e
    //                          b    e    e
    //                                    c     t     h     u     l     h     u
    //                                                                                          l     a    !
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

    it('Should generate array of matchings for input commands sequence', function () {

        var result = pwMatcher.powerWordsMatchingsThroughCommands(commands, powerWords)

        //console.log("---->")
        //console.log(result.map(function(matcher) { return powerWords[matcher.powerWordIndex] }))
        //console.log("---->")

        assert.equal(powerWords[result[0].powerWordIndex].toLowerCase(), "bee".toLowerCase())
        assert.equal(result[0].commandIndex, 1)
        assert.equal(powerWords[result[1].powerWordIndex].toLowerCase(), "cthulhu".toLowerCase())
        assert.equal(result[1].commandIndex, 4)
        assert.equal(powerWords[result[2].powerWordIndex].toLowerCase(), "LA!".toLowerCase())
        assert.equal(result[2].commandIndex, 14)
    });

    it('should find & replace powerWords', function () {
        var lettersAndScores = pwMatcher.lettersAndScoresWithPowerWords(commands);
        assert.equal(lettersAndScores.letters, "abeecthulhuakdlap");
    });

    it ('should calculate scores including power words', function() {
        var commands = ['SW', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'CC', 'SW', 'CC', 'SE', 'SW', 'CC', 'SW', 'CC', 'C', 'SE', 'SW', 'W'];
        var lettersAndScores = pwMatcher.lettersAndScoresWithPowerWords(commands, 10);
        //console.log('~~~~~~~~~~~~~>')
        //console.log(lettersAndScores.letters)
        //console.log('~~~~~~~~~~~~~>')
        assert.equal(lettersAndScores.scores, 636);
    })

    it ('should use additional power words and insert them if they match', function() {
        var commands = [
            'W', 'SE', 'CC',                                                                 // random
            'E', 'CC', 'SW', 'CC', 'SE', 'SW', 'CC',                                         // cthulhu
            'C',                                                                             // random
            'SW', 'C', 'SW', 'CC', 'SW', 'SE', 'CC',                                         // azathoth
            'SW', 'E', 'E',                                                                  // random
            'CC', 'SW', 'CC', 'E', 'W', 'SE', 'SW', 'SW', 'SW', 'CC', 'C', 'SW', 'CC', 'SW', // shub.niggurath
            'SW', 'E',                                                                       // random
            'SE', 'CC', 'SW'                                                                 // nug
        ]
        var additionalPowerWords = [
            "azathoth",
            "shub.niggurath",
            "nug"
        ]
        var lettersAndScores = pwMatcher.lettersAndScoresWithPowerWords(commands, 10, additionalPowerWords)
        assert.equal(lettersAndScores.letters, "plkcthulhudazathothbbshub.niggurathabnug")
    })
});