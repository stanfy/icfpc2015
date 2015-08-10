
/**
 * Created by otaykalo on 8-8-2015.
 */
(function(definition) {
    /* global module, define */
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(typeof define === 'function' && define.amd) {
        define([], definition);
    } else {
        var exports = definition();
        window.astar = exports.astar;
        window.Graph = exports.Graph;
    }
})(function() {

    var transform = require("../logic/transformations");
    var brain = require("../logic/brain");
    var assert = require('assert');
    var lodash = require('lodash');

    function pathTo(node){
    var curr = node,
        path = [];
    while(curr.parent) {
        path.push(curr);
        curr = curr.parent;
    }
    //path.push(curr);
    return path.reverse();
}



function getHeap() {
    return new BinaryHeap(function(node) {
        return node.f;
    });
}
    function countProps(obj) {
        var count = 0;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                count++;
            }
        }
        return count;
    };
    function objectEquals(v1, v2) {
        return brain.unitsAreEqual(v1,v2);
        if (typeof(v1) !== typeof(v2)) {
            return false;
        }

        if (typeof(v1) === "function") {
            return v1.toString() === v2.toString();
        }

        if (v1 instanceof Object && v2 instanceof Object) {
            if (countProps(v1) !== countProps(v2)) {
                return false;
            }
            var r = true;
            for (k in v1) {
                r = objectEquals(v1[k], v2[k]);
                if (!r) {
                    return false;
                }
            }
            return true;
        } else {
            return v1 === v2;
        }
    }
    var f = function(n){
        return   "" + n.step + " (" + n.x + "," + n.y + ")";
    }
    var p = function(n){
        // console.log(f(n) );


    };


    var sf = function(n) {
        var path = pathTo(n);
        var res = [];
        path.reverse().forEach(function(x){ res.push(""+ f(x) +"->" );} );
        return res.join(" ");
    }
    var sp = function(n){
        console.log(sf(n));
    }



    var astar = {
        unitSimpleHash: function (unit) {
            return unit.pivot.y * 10000 + unit.pivot.x * 10 + (unit.rot ? unit.rot : 0);
        },
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
    search: function(graph, startState, endState, options) {
        start = new GridNode(startState.state.unit.pivot.x, startState.state.unit.pivot.y, 0,0, 1);
        this.cleanNode(start);
        start.state = startState;
        start.step = "initial";


        end = new GridNode(endState.state.unit.pivot.x, endState.state.unit.pivot.y, 0,0, 1);
        this.cleanNode(end);
        end.state = endState;

        this.visited = [];
        this.visitedList = {};
        this.visitedCount = 0;
        graph.cleanDirty();
        options = options || {};
        var heuristic = options.heuristic || astar.heuristics.manhattan,
            closest = options.closest || false;

        var openHeap = getHeap(),
            closestNode = start; // set the start node to be the closest if required

        start.h = heuristic(start, end);

        openHeap.push(start);

        while(openHeap.size() > 0) {

            //console.log("current Heap content: ")
            //openHeap.content.forEach(sp);
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();
            // End case -- result has been found, return the traced path.
            // console.log("Current node now is :");
            //p(currentNode);
            //sp(currentNode);
            // console.log("end node is:");
            //p(end);
            //var jsoncur = JSON.stringify(currentNode.state.state.unit.pivot);
            //var jsonEnd = JSON.stringify(end.state.state.unit.pivot);
            // var pe=  objectEquals(currentNode.state.state.unit.pivot, end.state.state.unit.pivot);
           // var pivotEq =  jsoncur === jsonEnd;
            //var jsonMemCur = JSON.stringify(currentNode.state.state.unit.members);
            //var jsonMemEnd = JSON.stringify(end.state.state.unit.members);
            //var membersEq = jsonMemCur == jsonMemEnd;
            var me =  objectEquals(currentNode.state.state.unit, end.state.state.unit);
            //var me = currentNode.state.state.unit.members.deepEquals(end.state.state.unit.members);
            if(me  ) {
                return pathTo(currentNode);
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;
            var currHash = this.unitSimpleHash(currentNode.state.state.unit);
            if(!this.visitedList[currHash]) {
                this.visitedList[currHash] = true;
                this.visitedCount++;
                if(this.visitedCount % 100 == 0) {
                    console.log(this.visitedCount);
                }
            }
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

                var neighborHash = this.unitSimpleHash(neighbor.state.state.unit);
                if (this.visitedList[neighborHash]) {
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
                   // console.log("adding node " + neighbor.step + " (" + neighbor.x + "," + neighbor.y + ")"
                   // + " to parent " + sf(currentNode) );

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
                        // console.log("adding node [" + sf(neighbor)+ "] to HEAP ");
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
            var d1 = Math.abs(pos1.state.state.unit.pivot.x - pos0.state.state.unit.pivot.x);
            var d2 = Math.abs(pos1.state.state.unit.pivot.y - pos0.state.state.unit.pivot.y);
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
        node.state = {};
    }
};


/**
 * A graph memory structure
 * @param {Array} gridIn 2D array of input weights
 * @param {Object} [options]
 * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
 */
function Graph(state, options){
    var maxX = state.board.width;
    var maxY = state.board.height;
    var maxL = 5;
    var maxR = 5;
    options = options || {};
    this.nodes = [];
    this.diagonal = !!options.diagonal;
    this.grid = [];
    this.state = state;
    //for (var x = 0; x < maxX; x++) {
    //    this.grid[x] = [];
    //
    //    for (var y = 0; y < maxY; y++) {
    //        this.grid[x][y] = [];
    //        for ( var l =0; l< maxL; l++){
    //            this.grid[x][y][l] = [];
    //            for(var r =0; r<maxR; r++) {
    //                // initialization of potential states
    //                var node = new GridNode(x, y, l, r, 1);
    //
    //                this.grid[x][y][l][r] = node;
    //                this.nodes.push(node);
    //            }
    //        }
    //
    //    }
    //}
    this.init = function() {
        this.dirtyNodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            astar.cleanNode(this.nodes[i]);
        }
    };
    this.init();
}


Graph.prototype.cleanDirty = function() {
    for (var i = 0; i < this.dirtyNodes.length; i++) {
        astar.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
};

Graph.prototype.markDirty = function(node) {
    this.dirtyNodes.push(node);
};

Graph.prototype.neighbors = function(node) {
    var ret = [],
        x = node.x,
        y = node.y,
        l = node.l,
        r = node.r,
        unit = node.unit,
        grid = this.grid;


    var leftState = brain.moveLeft(node.state, function(){return "leftFailure"});

    if(leftState === "leftFailure"){

    }else
    if(leftState.state.state === "ok") {
        var uniq = leftState.state.unit;
        var p = uniq.pivot;
        //if (grid[p.x] && grid[p.x][p.y] && grid[p.x][p.y][l] && grid[p.x][p.y][l][r]) {


            var nodeLeft = new GridNode(p.x, p.y, l, r, 1);
            nodeLeft.step = "W";
            nodeLeft.state = leftState;
            ret.push(nodeLeft);

        //}
    }


     //right

    var rightState = brain.moveRight(node.state, function(){return "rightFailure"});

    if(rightState === "rightFailure"){

    }else
    if(rightState.state.state === "ok") {
        var uniq = rightState.state.unit;
        var p = uniq.pivot;
        //if (grid[p.x] && grid[p.x][p.y] && grid[p.x][p.y][l] && grid[p.x][p.y][l][r]) {


            var nodeRight = new GridNode(p.x, p.y, l, r, 1);
            nodeRight.step = "E";
            nodeRight.state = rightState;
            ret.push(nodeRight);
            //}

    }

    //// se
    var seState = brain.moveDownRight(node.state, function(){return "seFailure"});

    if(seState === "seFailure"){

    }else
    if(seState.state.state === "ok") {
        var uniq = seState.state.unit;
        var p = uniq.pivot;
        //if (grid[p.x] && grid[p.x][p.y] && grid[p.x][p.y][l] && grid[p.x][p.y][l][r]) {

            var nodese = new GridNode(p.x, p.y, l, r, 1);
            nodese.step = "SE";
            nodese.state = seState;
            ret.push(nodese);
            //}

    }

    //// sw
    //
    var swState = brain.moveDownLeft(node.state, function(){return "swFailure"});

    if(swState === "swFailure"){

    }else
    if(swState.state.state === "ok") {
        var uniq = swState.state.unit;
        var p = uniq.pivot;
        //if (grid[p.x] && grid[p.x][p.y] && grid[p.x][p.y][l] && grid[p.x][p.y][l][r]) {

            var nodesw = new GridNode(p.x, p.y, l, r, 1);
            nodesw.step = "SW";
            nodesw.state = swState;
            ret.push(nodesw);
            //}

    }

    //// rotateLeft
    //
    var ccState = brain.rotateCC(node.state, function(){return "ccFailure"});

    if(ccState === "ccFailure"){

    }else
    if(ccState.state.state === "ok") {
        var uniq = ccState.state.unit;
        var p = uniq.pivot;
        //if (grid[p.x] && grid[p.x][p.y] && grid[p.x][p.y][l] && grid[p.x][p.y][l][r]) {

            var nodecc = new GridNode(p.x, p.y, l, r, 1);
            nodecc.step = "CC";
            nodecc.state = ccState;
            ret.push(nodecc);
            //}

    }

    //// rotateRight
    //
    var cState = brain.rotateC(node.state, function(){return "cFailure"});

    if(cState === "cFailure"){

    }else
    if(cState.state.state === "ok") {
        var uniq = cState.state.unit;
        var p = uniq.pivot;
        //if (grid[p.x] && grid[p.x][p.y] && grid[p.x][p.y][l] && grid[p.x][p.y][l][r]) {

            var nodec = new GridNode(p.x, p.y, l, r, 1);
            nodec.step = "C";
            nodec.state = cState;
            ret.push(nodec);
            //}

    }

    return ret;
};

Graph.prototype.toString = function() {
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

exports.Graph = Graph;
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
    return "[" + this.x + " " + this.y +  " " + this.l + " " + this.r +"]";
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

    // attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };


    Object.prototype.equals = function(object2) {
        //For the first loop, we only check for types
        for (propName in this) {
            //Check for inherited methods and properties - like .equals itself
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
            //Return false if the return value is different
            if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
                return false;
            }
            //Check instance type
            else if (typeof this[propName] != typeof object2[propName]) {
                //Different types => not equal
                return false;
            }
        }
        //Now a deeper check using other objects property names
        for(propName in object2) {
            //We must check instances anyway, there may be a property that only exists in object2
            //I wonder, if remembering the checked values from the first loop would be faster or not
            if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
                return false;
            }
            else if (typeof this[propName] != typeof object2[propName]) {
                return false;
            }
            //If the property is inherited, do not check any more (it must be equa if both objects inherit it)
            if(!this.hasOwnProperty(propName))
                continue;

            //Now the detail check and recursion

            //This returns the script back to the array comparing
            /**REQUIRES Array.equals**/
            if (this[propName] instanceof Array && object2[propName] instanceof Array) {
                // recurse into the nested arrays
                if (!this[propName].equals(object2[propName]))
                    return false;
            }
            else if (this[propName] instanceof Object && object2[propName] instanceof Object) {
                // recurse into another objects
                //console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
                if (!this[propName].equals(object2[propName]))
                    return false;
            }
            //Normal value comparison for strings and numbers
            else if(this[propName] != object2[propName]) {
                return false;
            }
        }
        //If everything passed, let's say YES
        return true;
    };

    return {
        astar: astar,
        Graph: Graph
    };
});