#!/usr/bin/env node

/**
 * Module dependencies.
 */

function collect(val, memo) {
    memo.push(val);
    return memo;
}


var program = require('commander');

program
    .version('0.0.1')
    .option("-f, --files [value]", "File containing JSON encoded input", collect, [])
    .option("-t, --time [value]", "Time limit, in seconds, to produce output", parseInt)
    .option("-m, --memory [value]", "Memory limit, in megabytes, to produce output", parseInt)
    .option("-c, --cores [value]", "Number of processor cores available", parseInt)
    .option("-p, --phrases [value]", "Phrase of power", collect, [])
    .parse(process.argv);

const files = program.files;
const time = program.time;
const memory = program.memory;
const cores = program.cores;
const phrases = program.phrases ? program.phrases : [];
const currentDate = new Date();
const millisecondsOfEnd = currentDate.getTime() + (time ? time : 24 * 60 * 60 * 1000);

// reading files

files.forEach(function(file) {
    fs = require('fs');
    fs.readFile(file, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        var json = JSON.parse(data);

        if (!data || !json) {
            console.log("[]");

        } else {
            // initialize all!
            var anysolver = require("../logic/anysolver");
            var solution = require("../logic/oneSolution");

            var solutions = anysolver.solveBoardForAllSeeds(json, phrases, null, 1, millisecondsOfEnd);

            var jsonedSolutions = solutions.map(function (s) {
                return solution.prepareJson(s);
            });
            console.log(JSON.stringify(jsonedSolutions));
        }
    });
});

