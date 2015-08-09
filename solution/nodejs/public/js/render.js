var canvas = document.getElementById('c');
var cellSize = 30;
var gapSize = 2;

var defaultColor = '#eee';
var filledColor = '#FFD700';
var filledColorTr = 'rgba(0,128,128,0.5)';
var unitColor = '#66FF99';
var pivotColor = '#6600FF';

var current_board = null;
var current_state = null;

var commandLog = "";

function draw(canvas, x, y, size, color) {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.moveTo(x + size / 2, y + 0);
        ctx.lineTo(x + size, y + size / 4);
        ctx.lineTo(x + size, y + size / 4 * 3);
        ctx.lineTo(x + size / 2, y + size);
        ctx.lineTo(x + 0, y + size / 4 * 3);
        ctx.lineTo(x + 0, y + size / 4);
        ctx.lineTo(x + size / 2, y + 0);
        ctx.closePath();
        ctx.fill();
    }
}

function drawBoard(h, v, size, gap) {
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < v; j++) {
            fill(i, j, defaultColor);
        }
    }
}

function drawTexts(h, v, size, gap) {
    var ctx = canvas.getContext('2d');
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < v; j++) {
            ctx.font= cellSize/3 + "px Georgia";
            ctx.fillStyle = "black";
            ctx.fillText(
                i+","+j,
                cellSize / 4 + j % 2 * (cellSize + gapSize) / 2 + i * (cellSize + gapSize),
                cellSize * 3/ 4 + j * (cellSize - cellSize / 4 + gapSize));
        }
    }
}



function fill(i, j, color) {
    draw(canvas,
        j % 2 * (cellSize + gapSize) / 2 + i * (cellSize + gapSize),
        j * (cellSize - cellSize / 4 + gapSize),
        cellSize, color);
}
function pivot(i, j, color) {
    draw(canvas,
        j % 2 * (cellSize + gapSize) / 2 + i * (cellSize + gapSize) + cellSize / 3,
        j * (cellSize - cellSize / 4 + gapSize) + cellSize / 3,
        cellSize / 3, color);
}

function drawUnit(unit, customColor) {
    unit.members.forEach(function (member) {
        fill(member.x, member.y,
            customColor ? customColor : unitColor
        )
    });

}

function drawPivot(unit) {
    pivot(unit.pivot.x, unit.pivot.y, pivotColor);
}

function drawEstimations(estimations) {
    if (estimations && estimations.length) {
        for (var i = 0; i < estimations.length && i < 10; i++) {
            drawUnit(estimations[i].unit, "rgba(0," + (10.0 - i) * 255.0 + ",0,0.2)")
        }
    }
}
function drawMap(map, state) {

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    console.log("Map " + map.width + "x" + map.height);

    document.getElementById("currentState").innerHTML =
        "State: " + state.state + "\n"
        + "Score: " + state.score + "\n"
        + "Seed: " + state.seed + "\n"
        + "Estimation: " + state.estimation + "\n"
            //+ "FilledOpt: " +  JSON.stringify(map.filledOpt, null, 4)+ "\n"
        + "\nFull state: \n"
        + JSON.stringify(state, null, 4);

    drawBoard(map.width, map.height, cellSize, gapSize);

    if (map.filledOpt) {
        for (var num in map.filledOpt) {
            fill(num % 1000, num / 1000, filledColor);
        }
    }
    //if (map.filled) {
    //    map.filled.forEach(function (item) {
    //        fill(item.x, item.y, filledColor)
    //    });
    //}

    // Draw state
    if (state) {
        var unit = state.unit;
        if (unit) {
            drawUnit(unit)
            drawPivot(unit)
        }

        var estimations = state.estimatedPositions;
        drawEstimations(estimations);
    }

    drawTexts(map.width, map.height, cellSize, gapSize);

}

function resize() {

    var canvas = document.getElementById('c');
    var canvasRatio = canvas.height / canvas.width;
    var windowRatio = window.innerHeight / window.innerWidth;
    var width;
    var height;

    if (windowRatio < canvasRatio) {
        height = window.innerHeight
        width = (height / canvasRatio);
    } else {
        width = window.innerWidth;
        height = width * canvasRatio;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};


document.addEventListener('keydown', function (event) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
    }
    if (event.keyCode == 65) { // a
        moveLeft();
    } else if (event.keyCode == 68) { // d
        moveRight();
    } else if (event.keyCode == 90) { // z
        moveDownLeft();
    } else if (event.keyCode == 88) { // x
        moveDownRight();
    } else if (event.keyCode == 67) { // c
        moveDownRight();
    } else if (event.keyCode == 188) { // ,
        rotateC();
    } else if (event.keyCode == 190) { // .
        rotateCC();
    }
});


function loadJSON(path, callback, jsonObject, method) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open(method ? method : 'GET', 'http://localhost:3000/' + path, true); // Replace 'my_data' with the path to your file
    xobj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            var actual_JSON = JSON.parse(xobj.responseText);
            callback(actual_JSON);
        }
    };
    if (jsonObject) {
        var body = JSON.stringify(jsonObject);
        xobj.send(body);
    } else {
        xobj.send(null);
    }
}

function loadMap(callback, id, seedIndex) {
    loadJSON('problems/problem_' + id + '.json', function (result) {
        current_board = result;
        var seed = current_board.sourceSeeds[seedIndex];
        getInitialState(seed)
    })
}

function init() {
    var mapNumber = document.getElementById('mapNumber').value;
    var mapSeedIndex = document.getElementById('mapSeedIndex').value;
    loadMap(function (actual_JSON) {
        drawMap(actual_JSON);
    }, mapNumber, mapSeedIndex);
};

function refresh() {
    commandLog = "";
    logCommand("");
    var mapNumber = document.getElementById('mapNumber').value;
    var mapSeedIndex = document.getElementById('mapSeedIndex').value;
    loadMap(function (actual_JSON) {
        // Parse JSON string into object
        drawMap(actual_JSON);
    }, mapNumber, mapSeedIndex);
}

function getInitialState(seed) {
    console.log("Current board is " + JSON.stringify(current_board))
    var seededBoard = {seed: seed, board: current_board};
    loadJSON("initial", function (state) {
        console.log("Initial State is updated to " + JSON.stringify(state))
        current_state = state;
        drawMap(state.board, state.state);
    }, seededBoard, "POST");
}

function moveLeft() {
    runMove("W");

}

function moveRight() {
    runMove("E");
}

function moveDownRight() {
    runMove("SE");
}

function moveDownLeft() {
    runMove("SW");
}

function rotateC() {
    runMove("C");
}

function rotateCC() {
    runMove("CC");
}

var current_available_states = [];

function askNextMove() {
    console.log("Current state is " + JSON.stringify(current_state))
    if (current_state.state.state != "ok") {
        return;
    }

    loadJSON("makeMove", function (state) {
        if (state.state.state == "BOOM!") {
            alert("Your last move was incorrect! Returning to previous state");
            return;
        }
        console.log("MOVE State is updated to " + JSON.stringify(state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_state, "POST")

}

function runAskedMove() {
    if (!current_available_states) {
        return;
    }
    var state = current_available_states[0];
    var commands = state.state._nextCommands.join(" ");
    console.log("Submit commands sequence: " + commands);
    var letters = lettersFromCommands(commands);
    console.log("Letters: " + letters);
    submitLettersAuto(letters);
}

function runMove(command) {
    console.log("Current state is " + JSON.stringify(current_state))
    if (current_state.state.state != "ok") {
        return;
    }

    loadJSON("state?command=" + command, function (state) {
        if (state.state.state == "BOOM!") {
            alert("Your last move was incorrect! Returning to previous state");
            return;
        }
        console.log("C State is updated to " + JSON.stringify(state))
        current_state = state;
        logCommand(command);
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function logCommand(command) {
    if (current_state.state.state != "ok") {
        return;
    }

    commandLog += command.trim() + " ";
    document.getElementById("commandLog").value = commandLog;
}


function submitCommandSequence(sequence) {
    console.log("Submit command sequence: " + JSON.stringify(current_state))
    current_state.sequence = sequence;
    loadJSON("state?command=SEQUENCE", function (state) {
        console.log("CC State is updated to " + JSON.stringify(state))
        current_state = state;
        if (state.commandHistory) {
            logCommand(state.commandHistory);
            delete state.commandHistory;
        }
        drawMap(state.board, state.state);
    }, current_state, "POST");
    delete current_state.sequence;
}


function submitCommandsAuto(commands) {
    console.log("Submit commands sequence: " + commands);
    var letters = lettersFromCommands(commands);
    console.log("Letters: " + letters);
    submitLettersAuto(letters);
}


function submitLettersAuto(sequence) {
    console.log("Submit letters sequence: " + JSON.stringify(current_state));
    if (sequence.length > 0) {
        var char = sequence.charAt(0);
        var nexSequence = sequence.substring(1);

        current_state.sequence = char;
        loadJSON("state?command=SEQUENCE", function (state) {
            console.log("CC State is updated to " + JSON.stringify(state));
            current_state = state;
            if (state.commandHistory) {
                logCommand(state.commandHistory);
                delete state.commandHistory;
            }
            drawMap(state.board, state.state);

            setTimeout(function (s) {
                submitLettersAuto((nexSequence));
            }, 10);
        }, current_state, "POST");
    }
}

window.addEventListener('resize', resize, false);
resize();
init();
