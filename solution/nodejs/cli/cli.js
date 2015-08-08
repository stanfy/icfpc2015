#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
    .version('0.0.1')
    .option("-f, --file [value]", "File containing JSON encoded input")
    .option("-t, --time [value]", "Time limit, in seconds, to produce output", parseInt)
    .option("-m, --memory [value]", "Memory limit, in megabytes, to produce output", parseInt)
    .option("-c, --cores [value]", "Number of processor cores available", parseInt)
    .parse(process.argv);

//console.log('hello, you\'re running our cli with options:');

const file = program.file;
const time = program.time;
const memory = program.memory;
const cores = program.cores;

// talking to user
//if (file) console.log('- file %s', file);
//if (time) console.log('- time %j', time);
//if (memory) console.log('- memory %j', memory);
//if (cores) console.log('- cores %j', cores);

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
        var result = solver.solveBoardForAllSeeds(json);
        console.log(JSON.stringify(result));
    }
});

