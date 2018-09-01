"use strict";

// This express app is the template engine to serve
// dynamic HTML files

var mod = {};
var priv = {};
priv.jsPath = "./../template/jpress.js";
priv.headerPath = "./../template/header.html";
priv.footerPath = "./../template/footer.html";

var express = require("express");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// ============================================================================
module.exports.init = async function(jservice) {
    mod.utilasync = await jservice.get("utilasync");
}

// ============================================================================
module.exports.createApp = function() {
 
    var app = express();

    app.get("/", function(req, res) {
        module.exports.processTemplate("./../template/index/index.html", req, res);    
    });

    app.get("/write", function(req, res) {
        module.exports.processTemplate("./../template/write/write.html", req, res);
    });

    return app;

}

// ============================================================================
module.exports.processTemplate = async function(htmlPath, req, res) {

    // TODO resume

};

// ============================================================================
// Load an HTML file as jsdom DOM object
module.exports.loadDom = async function(htmlPath) {

    var content = await mod.utilasync.fsReadFile(htmlPath, "utf8");
    var dom = new JSDOM(content);
    return dom;

}