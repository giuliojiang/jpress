"use strict";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var mod = {};
var priv = {};

// ============================================================================
module.exports.init = async function(jservice) {
    mod.utilasync = await jservice.get("utilasync");
};

// ============================================================================
// Load an HTML file as jsdom DOM object
module.exports.loadDom = async function(htmlPath) {

    var content = await mod.utilasync.fsReadFile(htmlPath, "utf8");
    return new JSDOM(content);

};