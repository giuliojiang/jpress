"use strict";

// This module is a static file server.

// In addition to serving regular static files,
// it injects BASEURL javascript variables into HTML
// files

var priv = {};
var mod = {};
var express = require("express");
var path = require("path");

module.exports.init = function(jservice) {

    mod.util = jservice.get("util");

};

module.exports.createHandler = function(staticBaseDirectory) {

    var app = express();

    app.get("*", function(req, res) {

        var baseUrl = mod.util.sanitizeURL(req.baseUrl);
        var fullUrl = mod.util.sanitizeURL(req.originalUrl);
        var pathUrl = mod.util.sanitizeURL(req.path);

        // The file extension
        var ext = mod.util.splitext(fullUrl);

        // Check if the file exists
        var fsFullPath = path.join(staticBaseDirectory, pathUrl);
        
        TODO RESUME
    });

};