
/**
 * Created by otaykalo on 8-8-2015.
 */
var transform = require("../logic/transformations");
var brain = require("../logic/brain");

function pathTo(node){
    var curr = node,
        path = [];
    while(curr.parent) {
        path.push(curr);
        curr = curr.parent;
    }
    return path.reverse();
}

function getHeap() {
    return new BinaryHeap(function(node) {
        return node.f;
    });
}

exports.astar = {
    /**
     * Perform an A* Search on a graph given a start and end node.
     * @param {Graph} graph
     * @param {state} start
     * @param {state} end
     * @param {Object} [options]
     * @param {bool} [options.closest] Specifies whether to return the
     path to the closest node if the target is unreachable.
     * @param {Function} [options.heuristic] Heuristic function (see
     *          astar.heuristics).
     */
    search: function(graph, start, end, options) {
        graph.cleanDirty();
        options = options || {};
        var heuristic = options.heuristic || astar.heuristics.manhattan,
            closest = options.closest || false;

        var openHeap = getHeap(),
            closestNode = start; // set the start node to be the closest if required

        start.h = heuristic(start, end);

        openHeap.push(start);

        while(openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if(currentNode === end) {
                return pathTo(currentNode);
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node.

            var neighbors = graph.neighbors(currentNode);

            for (var i = 0, il = neighbors.length; i < il; ++i) {
                var neighbor = neighbors[i];

                if (neighbor.closed ) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }
                if(neighbor.isWall()) {
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore = currentNode.g + neighbor.getCost(currentNode),
                    beenVisited = neighbor.visited;

                if (!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    graph.markDirty(neighbor);
                    if (closest) {
                        // If the neighbour is closer than the current closestNode or if it's equally close but has
                        // a cheaper path than the current closest node then it becomes the closest node
                        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                            closestNode = neighbor;
                        }
                    }

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        if (closest) {
            return pathTo(closestNode);
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    },
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    heuristics: {
        manhattan: function(pos0, pos1) {
            var d1 = Math.abs(pos1.unit.pivot.x - pos0.unit.pivot.x);
            var d2 = Math.abs(pos1.unit.pivot.y - pos0.unit.pivot.y);
            return d1 + d2;
        },
        diagonal: function(pos0, pos1) {
            var D = 1;
            var D2 = Math.sqrt(2);
            var d1 = Math.abs(pos1.x - pos0.x);
            var d2 = Math.abs(pos1.y - pos0.y);
            return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
        }
    },
    cleanNode:function(node){
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
        node.move = "";
        node.state = {};
    }
};

/**
 * A graph memory structure
 * @param {Array} gridIn 2D array of input weights
 * @param {Object} [options]
 * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
 */
exports.Graph = function(state, options){
    var maxX = state.board.width;
    var maxY = state.board.height;
    var maxL = 5;
    var maxR = 5;
    options = options || {};
    this.nodes = [];
    this.diagonal = !!options.diagonal;
    this.grid = [];
    this.state = state;
    for (var x = 0; x < maxX; x++) {
        this.grid[x] = [];

        for (var y = 0; y < row.length; y++) {
            this.grid[x][y] = [];
            for ( var l =0; l< maxL; l++){
                this.grid[x][y][l] = [];
                for(var r =0; r<maxR; r++) {
                    // initialization of potential states
                    var node = new GridNode(x, y, l, r, 1);

                    this.grid[x][y][l][r] = node;
                    this.nodes.push(node);
                }
            }

        }
    }
    this.init();
}

exports.Graph.prototype.init = function() {
    this.dirtyNodes = [];
    for (var i = 0; i < this.nodes.length; i++) {
        astar.cleanNode(this.nodes[i]);
    }
};

exports.Graph.prototype.cleanDirty = function() {
    for (var i = 0; i < this.dirtyNodes.length; i++) {
        astar.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
};

exports.Graph.prototype.markDirty = function(node) {
    this.dirtyNodes.push(node);
};

exports.Graph.prototype.neighbors = function(node) {
    var ret = [],
        x = node.x,
        y = node.y,
        l = node.l,
        r = node.r,
        unit = node.unit,
        grid = this.grid;


    var leftState = brain.moveLeft(node.state, function(){return "leftFailure"});

    if(leftState =! "leftFailure" && leftState && leftState.state.state === "ok") {
        if (grid[left.x] && grid[left.x][left.y] && grid[left.x][left.y][left.l] && grid[left.x][left.y][l][r]) {
            var nodeLeft = grid[left.x][left.y][l][r];
            nodeLeft.step = "L";
            nodeLeft.state = leftState;
            ret.push(nodeLeft);
        }
    }


    // right

    var rightState = brain.moveRight(node.state, function(){return "rightFailure"});

    if(rightState != "rightFailure" && rightState && rightState.state.state === "ok") {
        var right = transform.moveRight({x: x, y: y});
        if (grid[right.x] && grid[right.x][right.y] && grid[right.x][right.y][right.l] && grid[right.x][right.y][l][r]) {
            var nodeRight = grid[right.x][right.y][l][r];
            nodeRight.step = "R";
            nodeRight.state = rightState;
            ret.push(nodeRight);
        }
    }

    // se
    var seState = brain.moveDownRight(node.state, function(){return "seFailure";});
    if(seState != "seFailure" && seState && seState.state.state === "ok") {
        var se = transform.moveSE({x: x, y: y});
        if (grid[se.x] && grid[se.x][se.y] && grid[se.x][se.y][se.l] && grid[se.x][se.y][l][r]) {
            var nodeSe = grid[se.x][se.y][l][r];
            nodeSe.step = "SE";
            nodeSe.state = seState;
            ret.push(nodeSe);
        }
    }

    // sw

    var swState = brain.moveDownLeft(node.state, function(){return "swFailure";});
    if(swState != "swFailure" && swState && swState.state.state == "ok") {

        var sw = transform.moveSW({x: x, y: y});
        if (grid[sw.x] && grid[sw.x][sw.y] && grid[sw.x][sw.y][sw.l] && grid[sw.x][sw.y][l][r]) {
            var nodeSw = grid[sw.x][sw.y][l][r];
            nodeSw.step = "SW";
            nodeSe.state = swState;
            ret.push(nodeSw);
        }
    }

    // rotate left
    var ccState = brain.rotateCC(node.state, function(){return "ccFailure";});
    if(ccState != "swFailure" && ccState && ccState.state.state === "ok") {
        if (grid[sw.x] && grid[sw.x][sw.y] && grid[sw.x][sw.y][sw.l] && grid[sw.x][sw.y][(l + 1) % 5][r]) {
            var nodeCC = grid[sw.x][sw.y][(l + 1) % 5][r];
            nodeCC.step = "CC";
            nodeCC.state = ccState;
            ret.push(nodeCC);
        }
    }

    // rotate right

    var cState = brain.rotateC(node.state, function(){return "cFailure";});
    if( cState != "cFailure" && cState && cState.state.state === "ok") {

        if (grid[sw.x] && grid[sw.x][sw.y] && grid[sw.x][sw.y][sw.l] && grid[sw.x][sw.y][l][(r + 1) % 5]) {
            var nodeC = grid[sw.x][sw.y][l][(r + 1) % 5];
            nodeC.step = "C";
            nodeC.state = cState;
            ret.push(nodeC);
        }
    }
    return ret;
};

exports.Graph.prototype.toString = function() {
    var graphString = [],
        nodes = this.grid, // when using grid
        rowDebug, row, y, l;
    for (var x = 0, len = nodes.length; x < len; x++) {
        rowDebug = [];
        row = nodes[x];
        for (y = 0, l = row.length; y < l; y++) {
            rowDebug.push(row[y].weight);
        }
        graphString.push(rowDebug.join(" "));
    }
    return graphString.join("\n");
};

function GridNode(x, y, l, r, weight) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.r = r;

    this.weight = weight;
    this.move = "";
    this.state = {};
}

GridNode.prototype.toString = function() {
    return "[" + this.x + " " + this.y +  " " + this.l + " " + this.r "]";
};

GridNode.prototype.getCost = function(fromNeighbor) {
    // Take diagonal weight into consideration.
//    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
//        return this.weight * 1.41421;
//    }
    return this.weight;
};

GridNode.prototype.isWall = function() {
    return false;
    //return this.weight === 1;
};

function BinaryHeap(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    },
    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    },
    remove: function(node) {
        var i = this.content.indexOf(node);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            }
            else {
                this.bubbleUp(i);
            }
        }
    },
    size: function() {
        return this.content.length;
    },
    rescoreElement: function(node) {
        this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function(n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {

            // Compute the parent element's index, and fetch it.
            var parentN = ((n + 1) >> 1) - 1,
                parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    },
    bubbleUp: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while(true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1,
                child1N = child2N - 1;
            // This is used to store the new position of the element, if any.
            var swap = null,
                child1Score;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore){
                    swap = child1N;
                }
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
};