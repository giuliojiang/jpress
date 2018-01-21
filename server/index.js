var path = require("path");
var jservice = require(path.join(__dirname, "jservice.js"));

// Register services ----------------------------------------------------------

var find_service = function(name) {
    jservice.register(name, require(path.join(__dirname, name + ".jservice.js")));
};

find_service("handlers");
find_service("https_server");
find_service("socket");
find_service("socketio");
find_service("config");
find_service("timeout");
find_service("client_session");
find_service("token_generator");
find_service("handler_login");
find_service("password");

// Start eager services -------------------------------------------------------

jservice.get("handler_login");

// Start server ---------------------------------------------------------------

var socket = jservice.get("socket");
socket.start();
