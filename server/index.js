var jservice = require("./jservice.js");

// Register services ----------------------------------------------------------

jservice.register("handlers", require("./handlers.jservice.js"));

jservice.register("https_server", require("./https_server.jservice.js"));

jservice.register("socket", require("./socket.jservice.js"));

jservice.register("socketio", require("./socketio.jservice.js"));

// Start server ---------------------------------------------------------------

var socket = jservice.get("socket");
socket.start();
