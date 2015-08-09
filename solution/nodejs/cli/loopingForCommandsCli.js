#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
    .version('0.0.1')
    .option("-f, --file [value]", "File containing JSON encoded input")
    .option("-o, --outputFile [value]", "File containing JSON encoded input")
    .parse(process.argv);

//console.log('hello, you\'re running our cli with options:');

const file = program.file;
const outputFile = program.outputFile;

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

        var result = solver.solveBoardForAllSeeds(json, "", function(partial_result) {
            fs.writeFileSync(outputFile, JSON.stringify(partial_result, null, "\t"));
        });

        console.log(JSON.stringify(result));
    }
});

