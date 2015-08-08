/**
 * Created by ptaykalo on 8/8/15.
 */
var lcg = require("../logic/lcg");
var assert = require('assert');
var Long = require("long");

describe('LCG', function () {
    it('Should generate correct values', function () {

        var knownSeedValues = [0, 24107, 16552, 12125, 9427, 13152, 21440, 3383, 6873, 16117];
        var seed = Long.fromInt(17, true);
        for (var i = 0; i < 10; i++) {
            var lcgValue = lcg.lcgValue(seed);
            assert.equal(lcgValue.value, knownSeedValues[i]);
            seed = lcgValue.seed
        }
    });
});
