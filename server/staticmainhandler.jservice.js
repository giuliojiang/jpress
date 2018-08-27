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

module.exports.createHandler = function(staticBaseDirectory, jpressContext) {

    var app = express();

    app.get("*", async function(req, res) {

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

            // Read the jpress.js file contents
            var jpressJsString;
            try {
                jpressJsString = await mod.utilasync.fsReadFile("./../client/lib/jpress.js", "utf8");
            } catch (err) {
                console.error("staticmainhandler: Could not read lib/jpress.js file: ", err);
                res.sendStatus(500);
                return;
            }

            // Replace contents in the javascript file
            if (!jpressContext.googleClientId) {
                throw new Error("jpressContext.googleClientId is not defined");
            }
            jpressJsString = mod.util.stringReplaceAll(jpressJsString, "JPRESSREPLACE_BASEURL", baseUrl);
            jpressJsString = mod.util.stringReplaceAll(jpressJsString, "JPRESSREPLACE_GSIGNIN_CLIENTID", jpressContext.googleClientId);

            // Insert script into document
            var scriptElem = dom.window.document.createElement("script");
            scriptElem.text = jpressJsString;
            var headElement = dom.window.document.head;
            headElement.insertBefore(scriptElem, headElement.firstChild);

            // Send to client
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