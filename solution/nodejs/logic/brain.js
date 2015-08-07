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

    if (!board.sourceSeeds || board.sourceSeeds.length == 0) {
        return {
            state: {
                state: "error",
                message: "sourceSeeds are required"
            }
        }
    }

    return {
        board: board,
        state: {
            state: "ok",
            unit: board.units[0],
            score: 0,
            unitIndex: 0,
            seed: 0
        }
    }
}