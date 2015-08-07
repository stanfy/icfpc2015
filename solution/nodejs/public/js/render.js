var canvas = document.getElementById('c');
var cellSize = 40;
var gapSize = 5;

var defaultColor = '#eee';
var filledColor = '#FFD700';
var unitColor = '#66FF99';
var pivotColor = '#6600FF';
function draw(canvas, x, y, size, color) {
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
      
    ctx.beginPath();
    ctx.moveTo(x + size/2, y + 0);
    ctx.lineTo(x + size,   y + size/4);
    ctx.lineTo(x + size,   y + size/4*3);
    ctx.lineTo(x + size/2, y + size);
    ctx.lineTo(x + 0,      y + size/4*3);
    ctx.lineTo(x + 0,      y + size/4);
    ctx.lineTo(x + size/2, y + 0);
    ctx.closePath();
    ctx.fill();
  }
}

function drawBoard(h, v, size, gap) {
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < v; j++) {
            fill(i,j, defaultColor);
        }
    }
}

function fill(i, j, color){
    draw(canvas, 
               j%2 * (cellSize + gapSize)/2 + i * (cellSize + gapSize), 
               j * (cellSize - cellSize/4 + gapSize), 
               cellSize, color);
}
function pivot(i,j, color){
 draw(canvas, 
               j%2 * (cellSize + gapSize)/2 + i * (cellSize + gapSize) + cellSize /3, 
               j * (cellSize - cellSize/4 + gapSize) + cellSize /3, 
               cellSize / 3, color); 
}

function drawUnit(unit){
 
  unit.members.forEach(function(member){fill(member.x, member.y, unitColor)});

}

function drawPivot(unit){
  pivot(unit.pivot.x, unit.pivot.y, pivotColor);
}

function drawMap(map){

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    drawBoard(map.width, map.height, cellSize, gapSize);
    map.filled.forEach(function(item){ fill(item.x, item.y, filledColor)});
    
    map.units.forEach(function(unit){drawUnit(unit)});
    map.units.forEach(function(unit){drawPivot(unit)});
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


document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        alert('Left was pressed');
    }
    else if(event.keyCode == 39) {
        alert('Right was pressed');
    }
});

function loadMap(callback, id) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'http://localhost:3000/problems/problem_' + id + '.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function init() {
    loadMap(function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        drawMap(actual_JSON);
    }, 5);
};

function refresh(){
    loadMap(function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        drawMap(actual_JSON);
    },document.getElementById('mapNumber').value);
}
window.addEventListener('resize', resize, false);
resize();
init();


