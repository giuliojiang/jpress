var express = require("express");
var app = express();
var fs = require("fs");
var https = require("https");
var path = require("path");

var server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, "..", "local", "private.key")),
    cert: fs.readFileSync(path.join(__dirname, "..", "local", "cert.pem"))
}, app);

server.listen(21000);

app.use('/', express.static(path.join(__dirname, "..", "client")));

console.info("Server on port 21000");
