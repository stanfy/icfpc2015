/**
 * Created by ptaykalo on 8/7/15.
 */
exports.initTransform = function (board) {
    if (!board) {
        return {
            state: {
                state: "error",
                message: "Board must be specified"
            }
        }
    }

    return {
        state: {
            state: "ok",
            score:0,
            unitIndex:0,
            seed:0
        }
    }
}