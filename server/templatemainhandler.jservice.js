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
    mod.util = await jservice.get("util");
    mod.context = await jservice.get("context");
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
// Return: nothing
module.exports.processTemplate = async function(htmlPath, req, res) {

    // Load the HTML template file
    var mainDom = await module.exports.loadDom(htmlPath);

    // Load header
    var headerDom = await module.exports.loadDom(priv.headerPath);
    
    // Load footer
    var footerDom = await module.exports.loadDom(priv.footerPath);

    // Load jpressJS
    var jpressJS = await mod.utilasync.fsReadFile(priv.jsPath, "utf8");

    // Perform jpressJS replacements
    jpressJS = mod.util.stringReplaceAll(jpressJS, "JPRESSREPLACE_BASEURL", req.baseUrl);
    jpressJS = mod.util.stringReplaceAll(jpressJS, "JPRESSREPLACE_GSIGNIN_CLIENTID", mod.context.getContext().googleClientId);

    // Insert jpressJS into the document
    var scriptElem = mainDom.window.document.createElement("script");
    scriptElem.text = jpressJS;
    var headElement = mainDom.window.document.head;
    headElement.insertBefore(scriptElem, headElement.firstChild);

    // Insert header content
    var headerElem = mainDom.window.document.getElementById("jpress-header");
    headerElem.innerHTML = headerDom.window.document.body.innerHTML;

    // Insert footer content
    var footerElem = mainDom.window.document.getElementById("jpress-footer");
    footerElem.innerHTML = footerDom.window.document.body.innerHTML;

    var finalHtml = mainDom.serialize();
    res.send(finalHtml);
    return;
};

// ============================================================================
// Load an HTML file as jsdom DOM object
module.exports.loadDom = async function(htmlPath) {

    var content = await mod.utilasync.fsReadFile(htmlPath, "utf8");
    var dom = new JSDOM(content);
    return dom;

}