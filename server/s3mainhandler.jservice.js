var priv = {};
var express = require("express");
var path = require("path");
var fs = require("fs");

module.exports.init = function() {

}

module.exports.createHandler = function() {

    var app = express();

    app.post("/:uploadid", function(req, res) {

        // TODO make proper uploader to S3

        var uploadid = req.params.uploadid;
        console.info("s3MainHandler: started upload id ", uploadid);
        var diskFilename = path.join("/tmp", uploadid);
        req.pipe(fs.createWriteStream(diskFilename));
        req.on("end", function() {
            console.info("s3MainHandler: upload completed to local file ", diskFilename);
        });

    });

    return app;

};