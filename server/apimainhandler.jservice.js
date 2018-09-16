"use strict";

var mod = {};
var priv = {};

var express = require("express");
var bodyParser = require("body-parser");

module.exports.init = async function(jservice) {
    mod.handlers = await jservice.get("handlers");
};

module.exports.createHandler = function() {

    var app = express();

    app.use("/", bodyParser.json());

    app.post("/", async function(req, res) {
        var msgobj = req.body;
        
        var resp;
        try {
            resp = await mod.handlers.handle(msgobj);
        } catch (err) {
            console.error("apimainhandler: Exception in handler. ", err);
            res.send(JSON.stringify(null));
            return;
        }

        res.send(JSON.stringify(resp));


    });

    return app;

};