"use strict";

// This module is a static file server.

// In addition to serving regular static files,
// it injects BASEURL javascript variables into HTML
// files

var priv = {};
var mod = {};
var express = require("express");
var path = require("path");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.init = function(jservice) {

    mod.util = jservice.get("util");
    mod.utilasync = jservice.get("utilasync");

};

module.exports.createHandler = function(staticBaseDirectory) {

    var app = express();

    app.get("*", async function(req, res) {

        console.info("baseurl ["+ req.baseUrl +"] originalurl ["+ req.originalUrl +"] path ["+ req.path +"]");
        var baseUrl = mod.util.sanitizeURL(req.baseUrl);
        var fullUrl = mod.util.sanitizeURL(req.originalUrl);
        var pathUrl = mod.util.sanitizeURL(req.path);

        // The file extension
        var ext = mod.util.splitext(fullUrl);

        // Check if the file exists
        var fsFullPath = path.join(staticBaseDirectory, pathUrl);
        var stat;
        try {
            stat = await mod.utilasync.fsStat(fsFullPath);
        } catch (err) {
            // File doesn't exist
            res.sendStatus(404);
            return;
        }

        // Check if it's a directory
        if (stat.isDirectory()) {
            // It's a directory, we can't serve directories
            res.sendStatus(404);
            return;
        }

        // Send processed HTML file
        if (ext == "html") {
            var htmlFileContents;
            try {
                htmlFileContents = await mod.utilasync.fsReadFile(fsFullPath, "utf8");
            } catch (err) {
                console.error("staticmainhandler: Could not read HTML file: ", err);
                res.sendStatus(500);
                return;
            }

            // Parse the HTML DOM
            var dom = new JSDOM(htmlFileContents);
            var scriptElem = dom.window.document.createElement("script");
            scriptElem.text = 'var BASEURL = "' + baseUrl + '";\n';
            var headElement = dom.window.document.head;
            headElement.insertBefore(scriptElem, headElement.firstChild);

            var finalHtml = dom.serialize();
            res.send(finalHtml);
            return;
        } 
        // Send file as it is
        else {
            res.sendFile(fsFullPath);
            return; 
        }
        
    });

    return app;

};