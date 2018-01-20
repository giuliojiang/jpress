var jservice = require("./jservice.js");

// Register services ----------------------------------------------------------

jservice.register("handlers", require("./handlers.jservice.js"));

jservice.register("https_server", require("./https_server.jservice.js"));

jservice.register("socket", require("./socket.jservice.js"));

jservice.register("socketio", require("./socketio.jservice.js"));

jservice.register("config", require("./config.jservice.js"));

jservice.register("timeout", require("./timeout.jservice.js"));

jservice.register("client_session", require("./client_session.jservice.js"));

jservice.register("token_generator", require("./token_generator.jservice.js"));

jservice.register("handler_login", require("./handler_login.jservice.js"));

// Start eager services -------------------------------------------------------

jservice.get("handler_login");

// Start server ---------------------------------------------------------------

var socket = jservice.get("socket");
socket.start();
