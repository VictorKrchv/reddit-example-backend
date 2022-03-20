"use strict";
exports.__esModule = true;
exports.generateRandomNumber = void 0;
var generateRandomNumber = function (count) {
    if (count === void 0) { count = 6; }
    return Array.from({ length: count })
        .map(function () { return Math.floor(Math.random() * 11); })
        .join();
};
exports.generateRandomNumber = generateRandomNumber;
