/**
 * Created by otaykalo on 8-8-2015.
 */
var extend = require('util')._extend;

Cube = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};
Cube.add = function (a, b) {
    return new Cube(a.x + b.x, a.y + b.y, a.z + b.z);
};
Cube.scale = function (a, k) {
    return new Cube(a.x * k, a.y * k, a.z * k);
};
Cube.direction = function (direction) {
    return Cube.directions[direction];
};
Cube.neighbor = function (hex, direction) {
    return Cube.add(hex, Cube.direction(direction));
};
Cube.diagonalNeighbor = function (hex, direction) {
    return Cube.add(hex, Cube.diagonals[direction]);
};

Cube.prototype = {
    toString: function () {
        return this.v().join(",");
    }
    , v: function () {
        return [this.x, this.y, this.z];
    }
    , rotateLeft: function () {
        return new Cube(-this.y, -this.z, -this.x);
    }
    , rotateRight: function () {
        return new Cube(-this.z, -this.x, -this.y);
    }
    , equals: function (other) {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }
};


Hex = function (q, r) {
    this.q = q;
    this.r = r;
};
Hex.prototype = {
    toString: function () {
        return this.q + ":" + this.r;
    }
};


twoAxisToCube = function (hex) {
    return new Cube(hex.q, -hex.r - hex.q, hex.r);
};
cubeToTwoAxis = function (cube) {
    return new Hex(cube.x | 0, cube.z | 0);
};
oddQToCube = function (hex) {
    var x = hex.q;
    var z = hex.r - (hex.q - (hex.q & 1) >> 1);
    return new Cube(x, -x - z, z);
};
cubeToOddQ = function (cube) {
    var x = cube.x | 0;
    var z = cube.z | 0;
    return new Hex(x, z + (x - (x & 1) >> 1));
};
evenQToCube = function (hex) {
    var x = hex.q;
    var z = hex.r - (hex.q + (hex.q & 1) >> 1);
    return new Cube(x, -x - z, z);
};
cubeToEvenQ = function (cube) {
    var x = cube.x | 0;
    var z = cube.z | 0;
    return new Hex(x, z + (x + (x & 1) >> 1));
};
oddRToCube = function (hex) {
    var z = hex.r;
    var x = hex.q - (hex.r - (hex.r & 1) >> 1);
    return new Cube(x, -x - z, z);
};
cubeToOddR = function (cube) {
    var x = cube.x | 0;
    var z = cube.z | 0;
    return new Hex(x + (z - (z & 1) >> 1), z);
};
evenRToCube = function (hex) {
    var z = hex.r;
    var x = hex.q - (hex.r + (hex.r & 1) >> 1);
    return new Cube(x, -x - z, z);
};
cubeToEvenR = function (cube) {
    var x = cube.x | 0;
    var z = cube.z | 0;
    return new Hex(x + (z + (z & 1) >> 1), z);
};

exports.rotateLeft = function (point, pivot) {

    var hex = new Hex(point.x, point.y);

    var cube = oddRToCube(hex);

    var pivotHEx = new Hex(pivot.x, pivot.y);
    var pivotCube = oddRToCube(pivotHEx);

    var translatedUnit = new Cube(cube.x - pivotCube.x, cube.y - pivotCube.y, cube.z - pivotCube.z);
    var rotated = translatedUnit.rotateLeft();

    var tranlatedRotated = new Cube(rotated.x + pivotCube.x, rotated.y + pivotCube.y, rotated.z + pivotCube.z);
    var hexed = cubeToOddR(tranlatedRotated);

    return {x: hexed.q, y: hexed.r};

}

exports.rotateRight = function (point, pivot) {

    var hex = new Hex(point.x, point.y);

    var cube = oddRToCube(hex);

    var pivotHEx = new Hex(pivot.x, pivot.y);
    var pivotCube = oddRToCube(pivotHEx);

    var translatedUnit = new Cube(cube.x - pivotCube.x, cube.y - pivotCube.y, cube.z - pivotCube.z);
    var rotated = translatedUnit.rotateRight();

    var tranlatedRotated = new Cube(rotated.x + pivotCube.x, rotated.y + pivotCube.y, rotated.z + pivotCube.z);
    var hexed = cubeToOddR(tranlatedRotated);

    return {x: hexed.q, y: hexed.r};

}

exports.moveLeft = function (point) {
    var hex = new Hex(point.x, point.y);

    var cube = oddRToCube(hex);
    var tranlatedRotated = new Cube(cube.x - 1, cube.y + 1, cube.z);
    var hexed = cubeToOddR(tranlatedRotated);

    return {x: hexed.q, y: hexed.r};
}

exports.moveRight = function (point) {
    var hex = new Hex(point.x, point.y);

    var cube = oddRToCube(hex);


    var tranlatedRotated = new Cube(cube.x + 1, cube.y - 1, cube.z);
    var hexed = cubeToOddR(tranlatedRotated);

    return {x: hexed.q, y: hexed.r};
}

exports.moveSW = function (point) {
    var hex = new Hex(point.x, point.y);

    var cube = oddRToCube(hex);

    var tranlatedRotated = new Cube(cube.x - 1, cube.y, cube.z + 1);
    var hexed = cubeToOddR(tranlatedRotated);

    return {x: hexed.q, y: hexed.r};
}

exports.moveSE = function (point) {
    var hex = new Hex(point.x, point.y);

    var cube = oddRToCube(hex);


    var tranlatedRotated = new Cube(cube.x, cube.y - 1, cube.z + 1);
    var hexed = cubeToOddR(tranlatedRotated);

    return {x: hexed.q, y: hexed.r};
}

exports.rotateUnitLeft = function (unit) {
    var pivot = unit.pivot;
    var rotatedMembers = [];
    unit.members.forEach(function (member) {
        var rotated = exports.rotateLeft(member, pivot);
        rotatedMembers.push(rotated);
    });
    return {pivot: pivot, members: rotatedMembers};

}

exports.rotateUnitRight = function (unit) {
    var pivot = unit.pivot;
    var rotatedMembers = [];
    unit.members.forEach(function (member) {
        var rotated = exports.rotateRight(member, pivot);
        rotatedMembers.push(rotated);
    });
    return {pivot: pivot, members: rotatedMembers};
}

exports.moveUnitAt = function (unit, x, y) {
    var pivot = unit.pivot;

    var pivotHEx = new Hex(pivot.x, pivot.y);
    var pivotCube = oddRToCube(pivotHEx);

    var translationPointHex = new Hex(x, y);
    var cube = oddRToCube(translationPointHex);

    var diff = new Cube(cube.x - pivotCube.x, cube.y - pivotCube.y, cube.z - pivotCube.z);

    var updatedUnit = extend({}, unit);

    updatedUnit.members = unit.members.map(function (member) {
        var mHex = new Hex(member.x, member.y);
        var mCube = oddRToCube(mHex);
        var mTranslated = new Cube(mCube.x + diff.x, mCube.y + diff.y, mCube.z + diff.z);
        var mHexedTranslated = cubeToOddR(mTranslated);
        return {x: mHexedTranslated.q, y: mHexedTranslated.r};
    });

    var pivotTranslated = new Cube(pivotCube.x + diff.x, pivotCube.y + diff.y, pivotCube.z + diff.z);
    var hexedPivotTranslated = cubeToOddR(pivotTranslated);
    updatedUnit.pivot = {x: hexedPivotTranslated.q, y: hexedPivotTranslated.r};
    return updatedUnit;
}