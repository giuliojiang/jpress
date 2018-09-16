"use strict";

var mod = {};
var priv = {};

const util = require("util");
const fs = require("fs");

module.exports.init = async function(jservice) {

};

// ============================================================================
// async stat
module.exports.fsStat = async function(thePath) {
    var promiseStat = util.promisify(fs.stat);
    return await promiseStat(thePath);
};

// ============================================================================
// async read file
module.exports.fsReadFile = async function(thePath, theOptions) {
    var readFilePromisified = util.promisify(fs.readFile);
    return await readFilePromisified(thePath, theOptions);
};