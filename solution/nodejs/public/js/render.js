var canvas = document.getElementById('c');
var cellSize = 40;
var gapSize = 5;

var defaultColor = '#eee';
var filledColor = '#FFD700';
var unitColor = '#66FF99';
var pivotColor = '#6600FF';

var current_board = null;
var current_state = null;

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

function drawUnit(unit, origin) {
    unit.members.forEach(function (member) {
        fill(member.x + origin.x + (origin.y %2 ==0 ?  0: (member.y %2 == 1 ? 1 : 0)), member.y + origin.y, unitColor)
    });

}

function drawPivot(unit, origin) {
    pivot(unit.pivot.x + origin.x + (origin.y %2 ==0 ?  0: (unit.pivot.y %2 == 1 ? 1 : 0)), unit.pivot.y + origin.y, pivotColor);
}

function drawMap(map, state) {

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    drawBoard(map.width, map.height, cellSize, gapSize);
    map.filled.forEach(function (item) {
        fill(item.x, item.y, filledColor)
    });

    // Draw state
    if (state) {
        var unit = state.unit;
        var origin = state.unitOrigin;
        if (unit && origin) {
            drawUnit(unit, origin)
            drawPivot(unit, origin)
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
    if (event.keyCode == 37) {
        alert('Left was pressed');
    }
    else if (event.keyCode == 39) {
        alert('Right was pressed');
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

function loadMap(callback, id) {
    loadJSON('problems/problem_' + id + '.json', function (result) {
        current_board = result;
        getInitialState()
    })
}

function init() {
    loadMap(function (actual_JSON) {
        drawMap(actual_JSON);
    }, 5);
};

function refresh() {
    loadMap(function (actual_JSON) {
        // Parse JSON string into object
        drawMap(actual_JSON);
    }, document.getElementById('mapNumber').value);
}

function getInitialState() {
    console.log("Current board is " + JSON.stringify(current_board))
    loadJSON("initial", function (state) {
        console.log("State is updated to " + JSON.stringify(state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_board, "POST");
}

function getNextState() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state", function (state) {
        console.log("State is updated to " + JSON.stringify(current_state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_state, "POST");
}
function moveLeft() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=W", function (state) {
        console.log("State is updated to " + JSON.stringify(current_state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function moveRight() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=E", function (state) {
        console.log("State is updated to " + JSON.stringify(current_state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function moveDownRight() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=SE", function (state) {
        console.log("State is updated to " + JSON.stringify(current_state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function moveDownLeft() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=SW", function (state) {
        console.log("State is updated to " + JSON.stringify(current_state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_state, "POST");
}


function rotateC() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=C", function (state) {
        console.log("State is updated to " + JSON.stringify(current_state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

function rotateCC() {
    console.log("Current state is " + JSON.stringify(current_state))
    loadJSON("state?command=CC", function (state) {
        console.log("State is updated to " + JSON.stringify(current_state))
        current_state = state;
        drawMap(state.board, state.state);
    }, current_state, "POST");
}

window.addEventListener('resize', resize, false);
resize();
init();


