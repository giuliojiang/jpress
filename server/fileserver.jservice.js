var express = require("express");
var path = require("path");

var self = {};
var priv = {};

module.exports.init = function(jservice) {

    self.https_server = jservice.get("https_server");
    self.db_file = jservice.get("db_file");

    var app = self.https_server.get_express_app();

    app.get("/download/:id", (req, res) => {
        priv.handle_file_download(req.params.id, res);
    });

};

priv.handle_file_download = function(file_id, res) {

    self.db_file.get_file(file_id, (err, file_name, file_path) => {

        if (err) {
            var e = new Error(err);
            console.error(e);
            // Send 404
            res.status(404).send();
        } else {
            var abs_path = path.join(__dirname, file_path);
            res.download(abs_path, file_name, (err) => {
                if (err) {
                    console.error(new Error(err));
                }
            });
        }

    });

};
