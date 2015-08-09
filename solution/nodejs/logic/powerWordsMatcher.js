/**
 * Created by alexandervoronov on 8/8/15.
 */

var letterCommandInterpretator = require('./../public/js/letterCommandInterpretator');
var _ =require('underscore')

exports.powerWords = [
    "ei!",
    "cthulhu",
    "as2h2",
    "galois",
    "aleister",
    "davar",
    "pentagram",
    "lambda",
    "ia! ia!",
    "turing",
    "r'lyeh!",
    "yuggot",
    ".....",
    "ph'nglui mglw'nafh cthulhu r'lyeh wgah'nagl fhtagn!",
    "conway",
    "cocke",
    "hopcroft",
    "backus",
    "bigboote",
    "big-booty",
    "bigboo-tay"
];

String.prototype.splice = function(start, length, replacement) {
    return this.substr(0,start)+replacement+this.substr(start+length);
}

exports.lettersAndScoresWithPowerWords = function(commands, scores, additionalPowerWords) {
    var letters = letterCommandInterpretator.lettersFromCommands(commands.join(" "));
    var allPowerWords = powerWordsWithAdditional(this.powerWords, additionalPowerWords);

    var matchings = this.powerWordsMatchingsThroughCommands(commands, allPowerWords);

    var that = this;
    matchings.forEach(function(matching) {
        var powerWord = that.powerWords[matching.powerWordIndex]
        letters = letters.splice(matching.commandIndex, powerWord.length, powerWord)
    });

    var newScores = this.scoresForPowerWords(matchings, scores);

    return {
        "letters":letters,
        "scores" : newScores
    };
};

var powerWordsWithAdditional = function(powerWords, additionalPowerWords) {
    if (additionalPowerWords === undefined || !additionalPowerWords) {
        return powerWords;
    } else if (powerWords === undefined || !powerWords) {
        return additionalPowerWords;
    }

    var anyMatches = function(item, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return true
            }
        }
        return false
    }

    var filteredPowerWords = powerWords;
    additionalPowerWords.forEach(function (additionalPowerWord) {
        if (!anyMatches(additionalPowerWord, powerWords)) {
            filteredPowerWords.push(additionalPowerWord)
        }
    })
    return filteredPowerWords
}

exports.scoresForPowerWords = function(matchings, oldScores) {
    var powerScores = 0;
    _.chain(matchings)
     .map(function(m) { return m.powerWordIndex })
     .uniq()
     .each(function() { powerScores += 300 })

    matchings.forEach(function(matching) {
        powerScores += 2 * matching.powerWordLength;
    });

    return oldScores + powerScores;
};


/*
 * @return {Array<matchings>}
 *
 * matching = {
 *   powerWordIndex: Int
 *   powerWordLetterIndex: Int
 *   commandIndex: Int
 * }
 * */

exports.powerWordsMatchingsThroughCommands = function (commands, powerWords) {
    var matchings = [];
    // in all commands
    for (var commandIndex = 0; commandIndex < commands.length; commandIndex++) {
        // for all power-words
        for (var powerWordIndex = 0; powerWordIndex < powerWords.length; powerWordIndex++) {
            // looping through each power-word letter
            for (var powerWordLetterIndex = 0; powerWordLetterIndex < powerWords[powerWordIndex].length; powerWordLetterIndex++) {
                // for all letters in command
                var lettersInCommand = letterCommandInterpretator.allLettersForCommand(commands[commandIndex])
                for (var commandLettersIndex = 0; commandLettersIndex < lettersInCommand.length; commandLettersIndex++) {
                    // if power-word starts with this letter
                    if (powerWordLetterIndex === 0) {
                        // if letters are equal
                        if (lettersInCommand[commandLettersIndex].toLowerCase() === powerWords[powerWordIndex][powerWordLetterIndex].toLowerCase()) {
                            // then add it into matchings
                            matchings.push({
                                powerWordIndex: powerWordIndex,
                                powerWordLetterIndex: powerWordLetterIndex,
                                powerWordLength: powerWords[powerWordIndex].length,
                                commandIndex: commandIndex
                            })
                        }
                    }

                    // check matchings for completing power-words
                    // in all matchings
                    for (var matchingsIndex = 0; matchingsIndex < matchings.length; matchingsIndex++) {
                        // if we're following correct commands sequence
                        if (matchings[matchingsIndex].commandIndex === commandIndex - 1) {
                            // for current power-word
                            if (matchings[matchingsIndex].powerWordIndex === powerWordIndex) {
                                // if not yet completed
                                if (matchings[matchingsIndex].powerWordLetterIndex < powerWords[matchings[matchingsIndex].powerWordIndex].length) {
                                    // if we're following correct power-word letters sequence
                                    if (matchings[matchingsIndex].powerWordLetterIndex === powerWordLetterIndex - 1) {
                                        // if letters are equal
                                        if (lettersInCommand[commandLettersIndex].toLowerCase() === powerWords[powerWordIndex][powerWordLetterIndex].toLowerCase()) {
                                            matchings[matchingsIndex].powerWordLetterIndex = powerWordLetterIndex
                                            matchings[matchingsIndex].commandIndex = commandIndex
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // remove uncompleted matchings
    matchingsIndex = matchings.length
    while (matchingsIndex--) {
        if ((matchings[matchingsIndex].powerWordLetterIndex + 1) !== powerWords[matchings[matchingsIndex].powerWordIndex].length) {
            matchings.splice(matchingsIndex, 1)
        } else {
            // map commandIndex from end to start index
            var matching = matchings[matchingsIndex]
            matching.commandIndex = matching.commandIndex - powerWords[matching.powerWordIndex].length + 1
        }
    }

    // remove intersects
    var sortedMathcing = matchings.sort(function(match1, match2) {
        return match1.commandIndex - match2.commandIndex;
    });

    matchingsIndex = sortedMathcing.length;
    while (matchingsIndex--) {
        //console.log("@@@@@@@@@@@@@@@@@@@@@");
        //console.log(sortedMathcing);

        var previousMatching = matchingsIndex > 0 ? sortedMathcing[matchingsIndex - 1] : null;
        if (!previousMatching) {
            break;
        }
        var currentMatching = sortedMathcing[matchingsIndex];
        var startCurrentMatchingIndex = currentMatching.commandIndex;
        var currentWordLength = currentMatching.powerWordLength;

        var startPreviousMatchingIndex = previousMatching.commandIndex;
        var previousWordLength = previousMatching.powerWordLength;
        var endPreviousMatchingIndex = startPreviousMatchingIndex + previousWordLength - 1;

        if (startCurrentMatchingIndex <= endPreviousMatchingIndex) {
            //console.log("~~~~~~~~~~~~~~~~~~~~~~~");
            //console.log(currentMatching);
            //console.log(previousMatching);
            if (currentWordLength >= previousWordLength) {
                sortedMathcing.splice(matchingsIndex - 1, 1);
            } else {
                sortedMathcing.splice(matchingsIndex, 1)
            }
        }
    }
    matchings = sortedMathcing;

    return matchings;
};