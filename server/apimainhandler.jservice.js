"use strict";

var mod = {};
var priv = {};

var express = require("express");
var bodyParser = require("body-parser");

module.exports.init = function(jservice) {
    mod.handlers = jservice.get("handlers");
};

module.exports.createHandler = function() {

    var app = express();

    app.use("/", bodyParser.json());

    app.post("/", async function(req, res) {
        var body = req.body;
        var msgobj = body;
        
        var resp;
        try {
            resp = await mod.handlers.handle(msgobj);
        } catch (err) {
            console.error("apimainhandler: Exception in handler. ", err);
            res.send(JSON.stringify(null));
            return;
        }

        res.send(JSON.stringify(resp));
        return;

    });

    return app;

};