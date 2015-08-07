var map = {"height":20,"width":30,"sourceSeeds":[0,29060,6876,31960,6094],"units":[{"members":[{"x":0,"y":0},{"x":2,"y":0}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":1},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":0,"y":0}},{"members":[{"x":2,"y":0},{"x":1,"y":1},{"x":1,"y":2},{"x":0,"y":3}],"pivot":{"x":1,"y":1}},{"members":[{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":1,"y":1}},{"members":[{"x":1,"y":1},{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":0,"y":0},{"x":1,"y":0},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":1,"y":0},{"x":1,"y":1},{"x":1,"y":2},{"x":0,"y":3}],"pivot":{"x":0,"y":1}},{"members":[{"x":2,"y":0},{"x":1,"y":1},{"x":0,"y":1},{"x":0,"y":2}],"pivot":{"x":1,"y":1}},{"members":[{"x":2,"y":1},{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":1,"y":0}},{"members":[{"x":1,"y":1},{"x":2,"y":0},{"x":1,"y":0},{"x":0,"y":1}],"pivot":{"x":1,"y":0}},{"members":[{"x":0,"y":0},{"x":0,"y":1},{"x":1,"y":1},{"x":0,"y":2}],"pivot":{"x":0,"y":1}},{"members":[{"x":0,"y":1},{"x":1,"y":1},{"x":3,"y":0},{"x":2,"y":0}],"pivot":{"x":1,"y":0}}],"id":3,"filled":[{"x":2,"y":5},{"x":3,"y":5},{"x":4,"y":5},{"x":5,"y":5},{"x":11,"y":5},{"x":16,"y":5},{"x":17,"y":5},{"x":18,"y":5},{"x":19,"y":5},{"x":25,"y":5},{"x":4,"y":6},{"x":11,"y":6},{"x":18,"y":6},{"x":25,"y":6},{"x":4,"y":7},{"x":11,"y":7},{"x":18,"y":7},{"x":25,"y":7},{"x":4,"y":8},{"x":11,"y":8},{"x":18,"y":8},{"x":25,"y":8},{"x":4,"y":9},{"x":7,"y":9},{"x":8,"y":9},{"x":11,"y":9},{"x":18,"y":9},{"x":21,"y":9},{"x":22,"y":9},{"x":25,"y":9},{"x":4,"y":10},{"x":7,"y":10},{"x":9,"y":10},{"x":18,"y":10},{"x":21,"y":10},{"x":23,"y":10},{"x":2,"y":11},{"x":3,"y":11},{"x":4,"y":11},{"x":5,"y":11},{"x":7,"y":11},{"x":8,"y":11},{"x":9,"y":11},{"x":11,"y":11},{"x":16,"y":11},{"x":17,"y":11},{"x":18,"y":11},{"x":19,"y":11},{"x":21,"y":11},{"x":22,"y":11},{"x":23,"y":11},{"x":25,"y":11}],"sourceLength":100}

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
               j%2 * (cellSize + gapSize)/2 + i * (cellSize + gapSize), 
               j * (cellSize - cellSize/4 + gapSize), 
               cellSize/4, color); 
}

function drawUnit(unit){
 
  unit.members.forEach(function(member){fill(member.x, member.y, unitColor)});

}

function drawPivot(unit){
  fill(unit.pivot.x, unit.pivot.y, pivotColor);
}

function drawMap(map){
    drawBoard(map.width, map.height, cellSize, gapSize);
    map.filled.forEach(function(item){ fill(item.x, item.y, filledColor)});
    map.units.forEach(function(unit){drawUnit(unit)});
    map.units.forEach(function(unit){drawPivot(unit)});
}
drawMap(map);

