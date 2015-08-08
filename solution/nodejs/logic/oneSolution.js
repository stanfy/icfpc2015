
/**
 * Created by hdf on 08.08.15.
 */

exports.init = function(boardId, seed, commands, score) {
    var tag = generateTag(boardId, seed);
    var json = {
        "problemId": boardId   /* The `id` of the game configuration */
        , "seed":      seed   /* The seed for the particular game */
        , "tag":       tag   /* A tag for this solution. */
        , "solution":  commands
        , "score":  score
    };

    return json;
};


var generateTag = function (boardId, seed) {
    return "st-"+boardId + "-" + seed + "-" + Date();
};