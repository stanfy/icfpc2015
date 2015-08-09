
/**
 * Created by hdf on 08.08.15.
 */
var kBoardId;
var kSeed;
var kCommands;
var kTag;

exports.init = function(boardId, seed, commands, score) {
    kTag = generateTag(boardId, seed, score);
    kBoardId = boardId;
    kCommands = commands;
    kSeed = seed;

    return {
        "problemId": kBoardId   /* The `id` of the game configuration */
        , "seed": kSeed   /* The seed for the particular game */
        , "tag": kTag   /* A tag for this solution. */
        , "solution": kCommands
        , "score" : score
    };
};


exports.prepareJson = function(solution) {
    return {
        "problemId": kBoardId   /* The `id` of the game configuration */
        , "seed": kSeed   /* The seed for the particular game */
        , "tag": kTag   /* A tag for this solution. */
        , "solution": kCommands
    };
};


var generateTag = function (boardId, seed, score) {
    return "st_b_"+boardId + "_s_" + seed + "_sc_" + score + "_" + Date();
};