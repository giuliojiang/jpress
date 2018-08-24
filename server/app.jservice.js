var priv = {};
var mod = {};
var express = require("express");
var path = require("path");

module.exports.init = function(jservice) {

    mod.apiMainHandler = jservice.get("apimainhandler");
    mod.s3MainHandler = jservice.get("s3mainhandler");
    mod.staticmainhandler = jservice.get("staticmainhandler");

};

module.exports.createApp = function() {

    var app = express();

    app.use("/api", mod.apiMainHandler.createHandler());

    app.use("/s3", mod.s3MainHandler.createHandler());

    app.use("/", mod.staticmainhandler.createHandler(
        path.join(__dirname, "..", "client")
    ));

    return app;

};