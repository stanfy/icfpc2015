/**
 * Created by hdf on 09.08.15.
 */

// --------------------------------------------

const lettersForW = ["p", "'", "!", ".", "0", "3"];
const lettersForE = ["b", "c", "e", "f", "y", "2"];
const lettersForSW = ["a", "g", "h", "i", "j", "4"];
const lettersForSE = ["l", "m", "n", "o", " ", "5"];
const lettersForC = ["d", "q", "r", "v", "z", "1"];
const lettersForCC = ["k", "s", "t", "u", "w", "x"];

// -> SW W E W E
// <- aaaalllaalla
var lettersFromCommands = function (commands) {
    var commandsArray = commands.split(" ");
    var letters = "";

    commandsArray.map(function (command) {
        letters += selectLetterFromCommand(command);
    });
    return letters;
};


var selectLetterFromCommand = function (command) {
    var letters = [];
    switch (command) {
        case "W":
            letters = lettersForW;
            break;
        case "E":
            letters = lettersForE;
            break;
        case "SW":
            letters = lettersForSW;
            break;
        case "SE":
            letters = lettersForSE;
            break;
        case "C":
            letters = lettersForC;
            break;
        case "CC":
            letters = lettersForCC;
            break;
    }

    return letters.length > 0 ? letters[0] : "";
    //return letters[Math.floor(Math.random()*letters.length)];
};


// -> alalalal
// <- SW W E W E
var commandsFromLetters = function (letters) {
    var lettersArray = letters.split("");
    var commands = "";

    var count = lettersArray.length;
    lettersArray.map(function (letter) {
        commands += selectCommandFromLetter(letter);
        count--;
        if (count > 0) {
            commands += " ";
        }
    });
    return commands;
};

var selectCommandFromLetter = function (letter) {
    if (lettersForW.indexOf(letter) > -1)
        return "W";
    if (lettersForE.indexOf(letter) > -1)
        return "E";
    if (lettersForSW.indexOf(letter) > -1)
        return "SW";
    if (lettersForSE.indexOf(letter) > -1)
        return "SE";
    if (lettersForC.indexOf(letter) > -1)
        return "C";
    if (lettersForCC.indexOf(letter) > -1)
        return "CC";
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    exports.commandsFromLetters = commandsFromLetters;
    exports.lettersFromCommands = lettersFromCommands;
} else {
    window.commandsFromLetters = commandsFromLetters;
    window.lettersFromCommands = lettersFromCommands;
}