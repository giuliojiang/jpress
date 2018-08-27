"use strict";

var priv = {};
var mod = {};
var express = require("express");
var path = require("path");

module.exports.init = async function(jservice) {

    mod.apiMainHandler = await jservice.get("apimainhandler");
    mod.s3MainHandler = await jservice.get("s3mainhandler");
    mod.staticmainhandler = await jservice.get("staticmainhandler");

};

module.exports.createApp = function(jpressContext) {

    var app = express();

    app.use("/api", mod.apiMainHandler.createHandler());

    app.use("/s3", mod.s3MainHandler.createHandler());

    app.use("/", mod.staticmainhandler.createHandler(
        path.join(__dirname, "..", "client"),
        jpressContext
    ));

    return app;

};