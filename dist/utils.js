"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mkdirp = require("mkdirp");
function fill(x, length) {
    return `000000000${x}`.substr(-length);
}
exports.fill = fill;
function count(str, pattern) {
    return str.match(new RegExp(pattern, "gm")).length;
}
exports.count = count;
function mkdirpSync(dir) {
    return new Promise(ok => mkdirp(dir, () => ok()));
}
exports.mkdirpSync = mkdirpSync;
