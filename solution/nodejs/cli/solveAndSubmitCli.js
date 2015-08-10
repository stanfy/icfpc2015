#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
    .version('0.0.1')
    .option("-f, --file [value]", "File containing JSON encoded input")
    .option("-d, --dir [value]", "Dir to store results")
    .parse(process.argv);

//console.log('hello, you\'re running our cli with options:');

const _inputFile = program.file;
const _outputFileDir = program.dir ? program.dir : "../../submission/solve_and_submit_results/";

// ../../../submission/solve_and_submit_results/solved_problem_0.json
const _outputFile = _outputFileDir + "solution_" + _inputFile.slice(_inputFile.indexOf("problem_"));
const _bestResultFile = _outputFileDir + "best_score_" + _inputFile.slice(_inputFile.indexOf("problem_"));

// global vars! hehe
var _bestScores = null;
var _previousSolution = null;
var _problem = null;
var _lastDateWhenSolutionSend = null;


function readFile(file) {
    fs = require('fs');
    if (!fs.existsSync(file)) {
       return null;
    }
    var data = fs.readFileSync(file, 'utf8');
    var json = JSON.parse(data);

    if (!data || !json) {
        return null;
    }

    return json;
}


function readFilesFirstThen() {
    console.log("reading best score file..");
    _problem = readFile(_inputFile);

    console.log("reading input file..");
    _bestScores = readFile(_bestResultFile);

    if (!_bestScores) {
        _bestScores = {};
        _problem.sourceSeeds.forEach(function(seed) {
            var stringSeed = seed.toString();
            _bestScores[stringSeed] = 0;
        });
    }
    console.log("previous best scores are " + JSON.stringify(_bestScores));

    console.log("reading output file..");
    _previousSolution = readFile(_outputFile);
    if (!_previousSolution) {
        _previousSolution = [];
        _problem.sourceSeeds.forEach(function(seed) {
            _previousSolution.push({});
        });
    }
    //console.log("_previousSolution " + JSON.stringify(_previousSolution));
}



function solveProblemAndRewrite() {
    console.log("solving problem..");

    var anysolver = require("../logic/anysolver");
    var solution = require("../logic/oneSolution");
    var iteration = 0;
    var maxIterations = 1;//(100 / (_problem.height * _problem.width)) * 2000;
    maxIterations = Math.floor(maxIterations);
    console.log("maxIterations " + maxIterations);

    anysolver.solveBoardForAllSeeds(_problem, "", function(partial_solutions) {

        var shouldRewriteFile = false;

        partial_solutions.map(function (s) {
            var seed = s.seed;
            var scores = s.score;
            var bestScoreForThisSeed = _bestScores[seed];

            if (scores > bestScoreForThisSeed) {
                shouldRewriteFile = true;

                // find which seed was updated
                var seedIndexes = _previousSolution.map(function(sol){
                    return sol.seed;
                });
                var indexToUpdate = seedIndexes ? seedIndexes.indexOf(seed) : 0;
                indexToUpdate = indexToUpdate >= 0 ? indexToUpdate : 0;
                console.log("~~~~~~~~~~~~~~~~~~~~ seedIndexes " + seedIndexes);
                console.log("~~~~~~~~~~~~~~~~~~~~ indexToUpdate " + indexToUpdate);

                _previousSolution[indexToUpdate] = solution.prepareJson(s);
                _bestScores[seed] = scores;
                iteration++;
                console.log("found better solution for problem " + _problem.id + " for seed " + seed +
                    " scored " + scores + " iteration " + iteration);
            }
        });

        if (shouldRewriteFile) {
            fs = require('fs');
            fs.writeFileSync(_outputFile, JSON.stringify(_previousSolution, null, "\t"));
            fs.writeFileSync(_bestResultFile, JSON.stringify(_bestScores, null, "\t"));
            submitFoundSolution();
        }
    }, maxIterations);
}


function submitFoundSolution() {
    var http = require("https");
    var API_TOKEN = "zSbouMJS0cYhLXgghheLt9alzo8aAHtpku9hiWAVR6U=";
    var TEAM_ID = "6";
    var host = "davar.icfpcontest.org";
    var path = "/teams/"+TEAM_ID+"/solutions";

    var options = {
        host: host,
        path: path,
        method: "POST",
        port : "443",
        headers: {
            "Content-Type": 'application/json',
            'Authorization': 'Basic ' + new Buffer("" + ':' + API_TOKEN).toString('base64')
        }
    };

    var solution = JSON.stringify(_previousSolution, null, "\t");
    console.log("sending request...\n" + solution);
    var request = http.request(options, function(response) {
        console.log("statusCode: ", response.statusCode);
        console.log("headers: ", response.headers);

        var data = "";
        response.on('data', function(chunk) {
            data += chunk;
        });
        response.on('end', function() {
            console.log("response " + data);
        });
    });
    request.write(solution);
    request.end();

    request.on('error', function(e) {
        console.error(e);
    });
}

// function sendSolutionIfNeeded() {
//     var current = new Date();
//     var timeDifference = current.getTime() - (_lastDateWhenSolutionSend ? _lastDateWhenSolutionSend.getTime() : 0);
//     var minutes = 1000 * 60 * 5;
// 
//     if (timeDifference > minutes) {
//         _lastDateWhenSolutionSend = current;
//         submitFoundSolution();
//     }
// }

// -----------------------------------------

readFilesFirstThen();
solveProblemAndRewrite();