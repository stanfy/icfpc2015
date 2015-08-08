var canvas = document.getElementById('c');
var cellSize = 40;
var gapSize = 5;

var defaultColor = '#eee';
var filledColor = '#FFD700';
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

function drawUnit(unit) {
    unit.members.forEach(function (member) {
        fill(member.x, member.y,
            unitColor
        )
    });

}

function drawPivot(unit) {
    pivot(unit.pivot.x, unit.pivot.y, pivotColor);
}

function drawMap(map, state) {

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    console.log("Map " + map.width + "x" + map.height);

    document.getElementById("currentState").innerHTML =
        "State: " + state.state + "\n"
        + "Score: " + state.score + "\n"
        + "Seed: " + state.seed + "\n"
        + "\nFull state: \n"
        + JSON.stringify(state, null, 4);

    drawBoard(map.width, map.height, cellSize, gapSize);
    map.filled.forEach(function (item) {
        fill(item.x, item.y, filledColor)
    });

    // Draw state
    if (state) {
        var unit = state.unit;
        if (unit) {
            drawUnit(unit)
            drawPivot(unit)
        }
    }
}

function resize() {

    var canvas = document.getElementById('c');
    var canvasRatio = canvas.height / canvas.width;
    var windowRatio = window.innerHeight / window.innerWidth;
    var width;
    var height;

    if (windowRatio < canvasRatio) {
        height = window.innerHeight;
        width = height / canvasRatio;
    } else {
        width = window.innerWidth;
        height = width * canvasRatio;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};


document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) { // a
        moveLeft();
    } else if (event.keyCode == 68) { // d
        moveRight();
    } else if (event.keyCode == 90) { // z
        moveDownLeft();
    } else if (event.keyCode == 88) { // x
        moveDownRight();
    }
     else if (event.keyCode == 67) { // c
        moveDownRight();
    }
    else if (event.keyCode == 188) { // ,
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
        getInitialState(seed )
    })
}

function init() {
    var mapNumber = document.getElementById('mapNumber').value;
    var mapSeedIndex = document.getElementById('mapSeedIndex').value;
    loadMap(function (actual_JSON) {
        drawMap(actual_JSON);
    }, mapNumber, mapSeedIndex );
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

function getNextState() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state", function (state) {
        console.log("State is updated to " + JSON.stringify(state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_state, "POST");
}
function moveLeft() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=W", function (state) {
        console.log("W State is updated to " + JSON.stringify(state))
        current_state = state;
        logCommand("W");
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function moveRight() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=E", function (state) {
        console.log("E State is updated to " + JSON.stringify(state))
        current_state = state;
        logCommand("E");
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function moveDownRight() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=SE", function (state) {
        console.log("SE State is updated to " + JSON.stringify(state))
        current_state = state;
        logCommand("SE");
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function moveDownLeft() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=SW", function (state) {
        console.log("SW State is updated to " + JSON.stringify(state))
        current_state = state;
        logCommand("SW");
        drawMap(state.board, state.state);
    }, current_state, "POST");
}


function rotateC() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=C", function (state) {
        console.log("C State is updated to " + JSON.stringify(state))
        current_state = state;
        logCommand("C");
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function rotateCC() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=CC", function (state) {
        console.log("CC State is updated to " + JSON.stringify(state))
        current_state = state;
        logCommand("CC");
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function logCommand(command) {
    commandLog += command + " ";
    document.getElementById("commandSequence").value = commandLog;
}

window.addEventListener('resize', resize, false);
resize();
init();
