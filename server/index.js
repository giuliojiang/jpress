var path = require("path");
var jservice = require(path.join(__dirname, "jservice.js"));

// Register services ----------------------------------------------------------

var find_service = function(name) {
    jservice.register(name, require(path.join(__dirname, name + ".jservice.js")));
};

find_service("handlers");
find_service("https_server");
find_service("ws");
find_service("config");
find_service("timeout");
find_service("client_session");
find_service("token_generator");
find_service("handler_login");
find_service("password");
find_service("util");
find_service("handler_posts");
find_service("db_post");
find_service("db");
find_service("handler_session");
find_service("markdown");
find_service("handler_write");
find_service("handler_post");
find_service("handler_binupload");
find_service("db_file");

// Start eager services -------------------------------------------------------

jservice.get("handler_login");
jservice.get("handler_posts");
jservice.get("handler_session");
jservice.get("handler_write");
jservice.get("handler_post");
jservice.get("handler_binupload");

// Start server ---------------------------------------------------------------

jservice.get("ws");
