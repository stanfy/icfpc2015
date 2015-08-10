/**
 * Created by hdf on 10.08.15.
 */


exports.twoSecondsToEnd = function (millisecondsToEnd) {
    var currentTime = new Date().getTime();
    var difference = millisecondsToEnd - currentTime;
    var tooLittleTimeLeft = (difference < (2 * 1000));
    return tooLittleTimeLeft;
};


exports.oneSecondToEnd = function (millisecondsToEnd) {
    var currentTime = new Date().getTime();
    var difference = millisecondsToEnd - currentTime;
    var tooLittleTimeLeft = (difference < (1 * 1000));
    return tooLittleTimeLeft;
};