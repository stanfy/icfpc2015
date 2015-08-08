/**
 * Linear congruent genrator
 * Created by ptaykalo on 8/8/15.
 */
var Long = require("long");

//var seed = Long.fromInt(17,true);
//for (var i = 1; i < 20; i++) {
//    var lcgValue = lcg.lcgValue(seed);
//    console.error(lcgValue.value);
//    seed = lcgValue.seed
//}

exports.lcgValue = function (seed) {
    var s = seed;
    //console.error("============");
    //console.error("Seed is " + s);

    var value = (s.getLowBits() >>> 16);
    //console.error("Value is " + value);

    var multiply = s.multiply(1103515245);
    //console.error("Aftr multiplication1 " + multiply);

    var multiplication = Long.fromBits((multiply.getLowBits() >>> 0) & 0x7FFFFFFF, 0, false);
    //console.error("Aftr multiplication " + multiplication);

    var add = multiplication.add(12345 >>> 0);
    //console.error("Aftr addition " + add);
    var mod = Long.fromBits((add.getLowBits() >>> 0) & 0x7FFFFFFF, 0, false);

    //console.error("Nex seed is " + mod);
    return {seed: mod.getLowBits() >>> 0, value: value}
}
