var path = require("path");
var jservice = require(path.join(__dirname, "jservice.js"));

var find_service = function(name) {
    jservice.register(name, require(path.join(__dirname, name + ".jservice.js")));
};

module.exports.createApp = function() {

    // Register services ----------------------------------------------------------
    find_service("handlers");
    find_service("https_server");
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
    find_service("fileserver");
    find_service("app");
    find_service("apimainhandler");

    // Start eager services -------------------------------------------------------
    jservice.get("handler_login");
    jservice.get("handler_posts");
    jservice.get("handler_session");
    jservice.get("handler_write");
    jservice.get("handler_post");
    jservice.get("handler_binupload");

    var appservice = jservice.get("app");
    return applicationCache.createApp();

};






