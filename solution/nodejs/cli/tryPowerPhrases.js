#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
    .version('0.0.1')
    .option("-f, --file [value]", "File containing JSON encoded input")
    .option("-l, --letters [value]", "Letters to try")
    .parse(process.argv);

//console.log('hello, you\'re running our cli with options:');

const file = program.file;
const letters = program.letters;

// reading file
fs = require('fs')
fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var json = JSON.parse(data);

    if (!data || !json) {
        console.log("[]");

    } else {
        // initialize all!
        var solver = require("../logic/solver");
        var solution = require("../logic/oneSolution");

        var solutions = solver.solveBoardForAllSeedsForLetters(json, letters);

        var jsonedSolutions = solutions.map(function (s) {
            return solution.prepareJson(s);
        });
        console.log(JSON.stringify(jsonedSolutions));
    }
});
