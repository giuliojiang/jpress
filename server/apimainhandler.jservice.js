var priv = {};
var express = require("express");
var bodyParser = require("body-parser");

module.exports.init = function(jservice) {

    // priv.handlers = jservice.get("handlers");

};

function ApiResponse (res) {

    var self = this;

    self.send = function(msgobj) {
        res.send(JSON.stringify(msgobj));
    };

    self.alert = function(txt) {
        res.send(JSON.stringify({
            _t: "alert",
            txt: txt
        }));
    };

};

module.exports.createHandler = function() {

    var app = express();

    app.use(bodyParser.text());

    app.put("/", function(req, res) {
        var body = req.body;
        console.info("apimainhandler: request body is ", JSON.stringify(body));
        var msgobj = JSON.parse(body);
        // priv.handlers.handle(msgobj, new ApiResponse(res));
    });

    return app;

};