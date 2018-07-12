var priv = {};
var express = require("express");
var path = require("path");

module.exports.init = function(jservice) {

    priv.apiMainHandler = jservice.get("apimainhandler");
    priv.s3MainHandler = jservice.get("s3mainhandler");

};

module.exports.createApp = function() {

    var app = express();
    
    app.put("/api", priv.apiMainHandler.createHandler());

    app.get("/s3", priv.s3MainHandler.createHandler());

    app.use("/", express.static(
        path.join(__dirname, "..", "client")
    ));

    return app;

};