/**
 * Created by otaykalo on 8-8-2015.
 */
var assert = require('assert');
var expect = require("chai").expect;
var astar = require("../logic/astar");
var solver = require("../logic/solver");
describe("astar", function () {

    context("neighbours test", function () {


        it("oneStep Left", function () {

            var map1_seed0_start = {"board":{"filledOpt":{"4002":true,"4003":true,"4004":true,"4005":true,"4006":true,"4011":true,"5002":true,"5008":true,"5011":true,"6002":true,"6011":true,"7002":true,"7003":true,"7004":true,"7008":true,"7011":true,"8002":true,"8009":true,"8011":true,"9002":true,"9008":true,"10002":true,"10003":true,"10004":true,"10005":true,"10006":true,"10009":true,"10011":true},"sourceLength":99,"filled":[{"x":2,"y":4},{"x":3,"y":4},{"x":4,"y":4},{"x":5,"y":4},{"x":6,"y":4},{"x":11,"y":4},{"x":2,"y":5},{"x":8,"y":5},{"x":11,"y":5},{"x":2,"y":6},{"x":11,"y":6},{"x":2,"y":7},{"x":3,"y":7},{"x":4,"y":7},{"x":8,"y":7},{"x":11,"y":7},{"x":2,"y":8},{"x":9,"y":8},{"x":11,"y":8},{"x":2,"y":9},{"x":8,"y":9},{"x":2,"y":10},{"x":3,"y":10},{"x":4,"y":10},{"x":5,"y":10},{"x":6,"y":10},{"x":9,"y":10},{"x":11,"y":10}],"id":1,"units":[{"members":[{"x":0,"y":0}],"pivot":{"x":0,"y":0}}],"sourceSeeds":[0],"width":15,"height":15},"state":{"state":"ok","unit":{"pivot":{"x":7,"y":0},"members":[{"x":7,"y":0}]},"score":0,"seed":12345,"hashes":[]}};
            var map1_seed0_leftStep = {"board":{"filledOpt":{"4002":true,"4003":true,"4004":true,"4005":true,"4006":true,"4011":true,"5002":true,"5008":true,"5011":true,"6002":true,"6011":true,"7002":true,"7003":true,"7004":true,"7008":true,"7011":true,"8002":true,"8009":true,"8011":true,"9002":true,"9008":true,"10002":true,"10003":true,"10004":true,"10005":true,"10006":true,"10009":true,"10011":true},"sourceLength":99,"filled":[{"x":2,"y":4},{"x":3,"y":4},{"x":4,"y":4},{"x":5,"y":4},{"x":6,"y":4},{"x":11,"y":4},{"x":2,"y":5},{"x":8,"y":5},{"x":11,"y":5},{"x":2,"y":6},{"x":11,"y":6},{"x":2,"y":7},{"x":3,"y":7},{"x":4,"y":7},{"x":8,"y":7},{"x":11,"y":7},{"x":2,"y":8},{"x":9,"y":8},{"x":11,"y":8},{"x":2,"y":9},{"x":8,"y":9},{"x":2,"y":10},{"x":3,"y":10},{"x":4,"y":10},{"x":5,"y":10},{"x":6,"y":10},{"x":9,"y":10},{"x":11,"y":10}],"id":1,"units":[{"members":[{"x":0,"y":0}],"pivot":{"x":0,"y":0}}],"sourceSeeds":[0],"width":15,"height":15},"state":{"state":"ok","unit":{"pivot":{"x":6,"y":0},"members":[{"x":6,"y":0}]},"score":0,"seed":12345,"hashes":[{"458752":true},{"393216":true}],"estimation":"{\"value\":459.25,\"score\":0,\"holes\":-109.75000000000001,\"lines\":74,\"items\":495}"}};

            a1 = map1_seed0_start;
            a2 = map1_seed0_leftStep;

            var g = new astar.Graph(a1);
            var res = astar.astar.search(g, a1, a2);
            var coms = [];
            res.forEach(function(x){coms.push(x.step)});
            var comsText = coms.join(",");
            console.log(comsText);
            expect(comsText).to.equal("W");
            var letters = solver.lfc(comsText);

            console.log(letters);
            expect(letters).to.equal("p");
        });


        it("oneStep right", function () {

            var map1_seed0_start = {"board":{"filledOpt":{"4002":true,"4003":true,"4004":true,"4005":true,"4006":true,"4011":true,"5002":true,"5008":true,"5011":true,"6002":true,"6011":true,"7002":true,"7003":true,"7004":true,"7008":true,"7011":true,"8002":true,"8009":true,"8011":true,"9002":true,"9008":true,"10002":true,"10003":true,"10004":true,"10005":true,"10006":true,"10009":true,"10011":true},"sourceLength":99,"filled":[{"x":2,"y":4},{"x":3,"y":4},{"x":4,"y":4},{"x":5,"y":4},{"x":6,"y":4},{"x":11,"y":4},{"x":2,"y":5},{"x":8,"y":5},{"x":11,"y":5},{"x":2,"y":6},{"x":11,"y":6},{"x":2,"y":7},{"x":3,"y":7},{"x":4,"y":7},{"x":8,"y":7},{"x":11,"y":7},{"x":2,"y":8},{"x":9,"y":8},{"x":11,"y":8},{"x":2,"y":9},{"x":8,"y":9},{"x":2,"y":10},{"x":3,"y":10},{"x":4,"y":10},{"x":5,"y":10},{"x":6,"y":10},{"x":9,"y":10},{"x":11,"y":10}],"id":1,"units":[{"members":[{"x":0,"y":0}],"pivot":{"x":0,"y":0}}],"sourceSeeds":[0],"width":15,"height":15},"state":{"state":"ok","unit":{"pivot":{"x":7,"y":0},"members":[{"x":7,"y":0}]},"score":0,"seed":12345,"hashes":[]}};
            var map1_seed0_rightStep = {"board":{"filledOpt":{"4002":true,"4003":true,"4004":true,"4005":true,"4006":true,"4011":true,"5002":true,"5008":true,"5011":true,"6002":true,"6011":true,"7002":true,"7003":true,"7004":true,"7008":true,"7011":true,"8002":true,"8009":true,"8011":true,"9002":true,"9008":true,"10002":true,"10003":true,"10004":true,"10005":true,"10006":true,"10009":true,"10011":true},"sourceLength":99,"filled":[{"x":2,"y":4},{"x":3,"y":4},{"x":4,"y":4},{"x":5,"y":4},{"x":6,"y":4},{"x":11,"y":4},{"x":2,"y":5},{"x":8,"y":5},{"x":11,"y":5},{"x":2,"y":6},{"x":11,"y":6},{"x":2,"y":7},{"x":3,"y":7},{"x":4,"y":7},{"x":8,"y":7},{"x":11,"y":7},{"x":2,"y":8},{"x":9,"y":8},{"x":11,"y":8},{"x":2,"y":9},{"x":8,"y":9},{"x":2,"y":10},{"x":3,"y":10},{"x":4,"y":10},{"x":5,"y":10},{"x":6,"y":10},{"x":9,"y":10},{"x":11,"y":10}],"id":1,"units":[{"members":[{"x":0,"y":0}],"pivot":{"x":0,"y":0}}],"sourceSeeds":[0],"width":15,"height":15},"state":{"state":"ok","unit":{"pivot":{"x":8,"y":0},"members":[{"x":8,"y":0}]},"score":0,"seed":12345,"hashes":[{"458752":true},{"524288":true}],"estimation":"{\"value\":459.25,\"score\":0,\"holes\":-109.75000000000001,\"lines\":74,\"items\":495}"}};
            a1 = map1_seed0_start;
            a2 = map1_seed0_rightStep;

            var g = new astar.Graph(a1);
            var res = astar.astar.search(g, a1, a2);
            var coms = [];
            res.forEach(function(x){coms.push(x.step)});
            var comsText = coms.join(",");
            console.log(comsText);
            expect(comsText).to.equal("E");
            var letters = solver.lfc(comsText);

            console.log(letters);
            expect(letters).to.equal("b");
        });




    });
});