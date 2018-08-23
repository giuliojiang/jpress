"use strict";

var mod = {};
var priv = {};

const util = require("util");
const fs = require("fs");

module.exports.init = function(jservice) {

};

// ============================================================================
// async stat
module.exports.fsStat = async function(path) {
    var promiseStat = util.promisify(fs.stat);
    try {
        var stat = await promiseStat(path);
    } catch (err) {
        TODO RESUME
    }
}