"use strict";

var priv = {};
var mod = {};
var express = require("express");
var path = require("path");

module.exports.init = async function(jservice) {

    mod.apiMainHandler = await jservice.get("apimainhandler");
    mod.templatemainhandler = await jservice.get("templatemainhandler");

};

module.exports.createApp = function() {

    var app = express();

    // Template engine. Overrides the static file server
    app.use("/", mod.templatemainhandler.createApp());

    // Static file server. Serves other JS and CSS files that
    // do not require processing
    app.use("/", express.static(path.resolve("./../client")));

    // JSON API handler
    app.use("/api", mod.apiMainHandler.createHandler());

    return app;

};