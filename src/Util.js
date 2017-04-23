"use strict";
exports.__esModule = true;
var slice = Array.prototype.slice;
function readBytes(buffer, begin, end) {
    return Buffer.from(slice.call(buffer, begin, end));
}
exports.readBytes = readBytes;
function readUInt32(buffer, offset) {
    if (offset === void 0) { offset = 0; }
    return buffer.readUInt32BE(offset);
}
exports.readUInt32 = readUInt32;
function readUInt16(buffer, offset) {
    if (offset === void 0) { offset = 0; }
    return buffer.readUInt16BE(offset);
}
exports.readUInt16 = readUInt16;
function readUInt8(buffer, offset) {
    if (offset === void 0) { offset = 0; }
    return buffer.readUInt8(offset);
}
exports.readUInt8 = readUInt8;
function readString(buffer) {
    var str = '';
    for (var i = 0; i < buffer.length; i++) {
        str += String.fromCharCode(buffer[i]);
    }
    return str;
}
exports.readString = readString;
(function () {
    if (!Function.prototype.curry) {
        Function.prototype.curry = function () {
            var fn = this;
            var args = slice.call(arguments);
            return function () {
                fn.apply(this, args.concat(slice.call(arguments)));
            };
        };
    }
})();
