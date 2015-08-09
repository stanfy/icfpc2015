
/**
 * Created by hdf on 08.08.15.
 */

exports.init = function(boardId, seed, commands, score) {
    var tag = generateTag(boardId, seed, score);
    return {
        "problemId": boardId  /* The `id` of the game configuration */
        , "seed": seed   /* The seed for the particular game */
        , "tag": tag   /* A tag for this solution. */
        , "solution": commands
        , "score" : score
    };
};


exports.prepareJson = function(solution) {
    return {
        "problemId": solution.problemId   /* The `id` of the game configuration */
        , "seed": solution.seed   /* The seed for the particular game */
        , "tag": solution.tag   /* A tag for this solution. */
        , "solution": solution.solution
    };
};


var generateTag = function (boardId, seed, score) {
    var date = new Date();
    var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var day = days[date.getDay()];
    var minute = (date.getMinutes() < 10 ? "0"+date.getMinutes(): date.getMinutes());
    var strDate = day + "_" + date.getHours() + ":" + minute;
    return "b"+boardId + "_s" + seed + "_sc" + score + "_" + strDate;
};