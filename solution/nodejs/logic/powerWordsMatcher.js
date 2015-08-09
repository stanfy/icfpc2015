/**
 * Created by alexandervoronov on 8/8/15.
 */

exports.powerWords = [
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
];

/*
* @return {Array<matchings>}
*
* matching = {
*   powerWordIndex: Int
*   powerWordLetterIndex: Int
*   commandIndex: Int
* }
* */

exports.powerWordsMatchingsInCommandsSequence = function (commandsSequence, powerWords) {
    var matchings = [];
    // in all commands
    for (var wordCommandIndex = 0; wordCommandIndex < commandsSequence.length; wordCommandIndex++) {
        // for all power-words
        for (var powerWordIndex = 0; powerWordIndex < powerWords.length; powerWordIndex++) {
            // looping through each power-word letter
            for (var powerWordLetterIndex = 0; powerWordLetterIndex < powerWords[powerWordIndex].length; powerWordLetterIndex++) {
                // for all letters in command
                var lettersInCommand = lettersForCommand(commandsSequence[wordCommandIndex])
                for (var commandLettersIndex = 0; commandLettersIndex < lettersInCommand.length; commandLettersIndex++) {
                    // if power-word starts with this letter
                    if (powerWordLetterIndex === 0) {
                        // if letters are equal
                        if (lettersInCommand[commandLettersIndex].toLowerCase() === powerWords[powerWordIndex][powerWordLetterIndex].toLowerCase()) {
                            // then add it into matchings
                            matchings.push({
                                powerWordIndex: powerWordIndex,
                                powerWordLetterIndex: powerWordLetterIndex,
                                commandIndex: wordCommandIndex
                            })
                        }
                    }

                    // check matchings for completing power-words
                    // in all matchings
                    for (var matchingsIndex = 0; matchingsIndex < matchings.length; matchingsIndex++) {
                        // if we're following correct commands sequence
                        if (matchings[matchingsIndex].commandIndex === wordCommandIndex - 1) {
                            // for current power-word
                            if (matchings[matchingsIndex].powerWordIndex === powerWordIndex) {
                                // if not yet completed
                                if (matchings[matchingsIndex].powerWordLetterIndex < powerWords[matchings[matchingsIndex].powerWordIndex].length) {
                                    // if we're following correct power-word letters sequence
                                    if (matchings[matchingsIndex].powerWordLetterIndex === powerWordLetterIndex - 1) {
                                        // if letters are equal
                                        if (lettersInCommand[commandLettersIndex].toLowerCase() === powerWords[powerWordIndex][powerWordLetterIndex].toLowerCase()) {
                                            matchings[matchingsIndex].powerWordLetterIndex = powerWordLetterIndex
                                            matchings[matchingsIndex].commandIndex = wordCommandIndex
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
        }
    }

    return matchings
};

var lettersForCommand = function (command) {
    switch (command) {
        case "W":
            return ["p", "'", "!", ".", "0", "3"];
        case "E":
            return ["b", "c", "e", "f", "y", "2"];
        case "SW":
            return ["a", "g", "h", "i", "j", "4"];
        case "SE":
            return ["l", "m", "n", "o", " ", "5"];
        case "C":
            return ["d", "q", "r", "v", "z", "1"];
        case "CC":
            return ["k", "s", "t", "u", "w", "x"]
    }
};